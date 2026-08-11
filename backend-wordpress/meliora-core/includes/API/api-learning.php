<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Permission Callback
|--------------------------------------------------------------------------
*/

function mh_learning_permissions_check()
{
    return is_user_logged_in();
}

/*
|--------------------------------------------------------------------------
| Validate UUID
|--------------------------------------------------------------------------
*/

function mh_learning_is_valid_uuid($uuid)
{
    if (!is_string($uuid)) {
        return false;
    }

    return (bool) preg_match(
        '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
        $uuid
    );
}

/*
|--------------------------------------------------------------------------
| Validate Roadmap ID
|--------------------------------------------------------------------------
*/

function mh_learning_validate_roadmap_id($value)
{
    return absint($value) > 0;
}

/*
|--------------------------------------------------------------------------
| Validate Step UUID Parameter
|--------------------------------------------------------------------------
*/

function mh_learning_validate_step_uuid($value)
{
    return mh_learning_is_valid_uuid(
        sanitize_text_field((string) $value)
    );
}

/*
|--------------------------------------------------------------------------
| Sanitize Step UUID
|--------------------------------------------------------------------------
*/

function mh_learning_sanitize_step_uuid($value)
{
    return strtolower(
        sanitize_text_field((string) $value)
    );
}

/*
|--------------------------------------------------------------------------
| Register Learning Routes
|--------------------------------------------------------------------------
*/

function mh_register_learning_routes()
{
    /*
    |--------------------------------------------------------------------------
    | GET /learning
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/learning',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_learning',
            'permission_callback' => 'mh_learning_permissions_check',
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | GET /learning/roadmaps/{roadmap_id}
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/learning/roadmaps/(?P<roadmap_id>\d+)',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_roadmap_learning',
            'permission_callback' => 'mh_learning_permissions_check',
            'args'                => [
                'roadmap_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => 'mh_learning_validate_roadmap_id',
                ],
            ],
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | POST /learning
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/learning',
        [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'mh_complete_learning_step',
            'permission_callback' => 'mh_learning_permissions_check',
            'args'                => [
                'roadmap_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => 'mh_learning_validate_roadmap_id',
                ],

                'step_uuid' => [
                    'required'          => true,
                    'sanitize_callback' => 'mh_learning_sanitize_step_uuid',
                    'validate_callback' => 'mh_learning_validate_step_uuid',
                ],
            ],
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | DELETE /learning/{step_uuid}
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/learning/(?P<step_uuid>[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-4[0-9a-fA-F]{3}-[89aAbB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})',
        [
            'methods'             => WP_REST_Server::DELETABLE,
            'callback'            => 'mh_uncomplete_learning_step',
            'permission_callback' => 'mh_learning_permissions_check',
            'args'                => [
                'step_uuid' => [
                    'required'          => true,
                    'sanitize_callback' => 'mh_learning_sanitize_step_uuid',
                    'validate_callback' => 'mh_learning_validate_step_uuid',
                ],
            ],
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | POST /learning/roadmaps/{roadmap_id}/visit
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/learning/roadmaps/(?P<roadmap_id>\d+)/visit',
        [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'mh_record_roadmap_visit',
            'permission_callback' => 'mh_learning_permissions_check',
            'args'                => [
                'roadmap_id' => [
                    'required'          => true,
                    'sanitize_callback' => 'absint',
                    'validate_callback' => 'mh_learning_validate_roadmap_id',
                ],
            ],
        ]
    );
}

add_action(
    'rest_api_init',
    'mh_register_learning_routes'
);

/*
|--------------------------------------------------------------------------
| Get Roadmap Post
|--------------------------------------------------------------------------
*/

function mh_learning_get_roadmap_post($roadmap_id)
{
    $roadmap = get_post($roadmap_id);

    if (
        !$roadmap ||
        $roadmap->post_type !== 'roadmap' ||
        $roadmap->post_status === 'trash'
    ) {
        return new WP_Error(
            'mh_roadmap_not_found',
            'Roadmap not found.',
            [
                'status' => 404,
            ]
        );
    }

    return $roadmap;
}

/*
|--------------------------------------------------------------------------
| Get Roadmap Data
|--------------------------------------------------------------------------
*/

function mh_learning_get_roadmap_data($roadmap_id)
{
    $roadmap = mh_learning_get_roadmap_post($roadmap_id);

    if (is_wp_error($roadmap)) {
        return $roadmap;
    }

    if (!class_exists('Roadmap')) {
        return new WP_Error(
            'mh_roadmap_model_unavailable',
            'The roadmap data model is unavailable.',
            [
                'status' => 500,
            ]
        );
    }

    $data = (new Roadmap($roadmap_id))->get();

    if (!is_array($data)) {
        return new WP_Error(
            'mh_invalid_roadmap_data',
            'The roadmap data could not be loaded.',
            [
                'status' => 500,
            ]
        );
    }

    return $data;
}

/*
|--------------------------------------------------------------------------
| Get Roadmap Steps
|--------------------------------------------------------------------------
*/

function mh_learning_get_roadmap_steps($roadmap_id)
{
    $data = mh_learning_get_roadmap_data($roadmap_id);

    if (is_wp_error($data)) {
        return $data;
    }

    $steps = $data['steps'] ?? [];

    if (!is_array($steps)) {
        return [];
    }

    return $steps;
}

/*
|--------------------------------------------------------------------------
| Find Step in Roadmap
|--------------------------------------------------------------------------
*/

function mh_learning_find_step($roadmap_id, $step_uuid)
{
    $steps = mh_learning_get_roadmap_steps($roadmap_id);

    if (is_wp_error($steps)) {
        return $steps;
    }

    $normalized_uuid = strtolower($step_uuid);

    foreach ($steps as $step) {
        if (!is_array($step)) {
            continue;
        }

        $saved_uuid = strtolower(
            sanitize_text_field(
                (string) ($step['id'] ?? '')
            )
        );

        if (
            $saved_uuid !== '' &&
            hash_equals($saved_uuid, $normalized_uuid)
        ) {
            return $step;
        }
    }

    return new WP_Error(
        'mh_learning_step_not_found',
        'The learning step was not found in this roadmap.',
        [
            'status' => 404,
        ]
    );
}

/*
|--------------------------------------------------------------------------
| Format Learning Record
|--------------------------------------------------------------------------
*/

function mh_format_learning_record($record)
{
    if (!is_array($record)) {
        return null;
    }

    return [
        'id'           => isset($record['id'])
            ? (int) $record['id']
            : 0,

        'roadmap_id'   => isset($record['roadmap_id'])
            ? (int) $record['roadmap_id']
            : 0,

        'step_uuid'    => isset($record['step_uuid'])
            ? (string) $record['step_uuid']
            : '',

        'completed_at' => isset($record['completed_at'])
            ? (string) $record['completed_at']
            : '',

        'updated_at'   => isset($record['updated_at'])
            ? (string) $record['updated_at']
            : '',
    ];
}

/*
|--------------------------------------------------------------------------
| Convert WP Error to REST Response
|--------------------------------------------------------------------------
*/

function mh_learning_error_response(WP_Error $error)
{
    $error_data = $error->get_error_data();

    $status = 500;

    if (
        is_array($error_data) &&
        isset($error_data['status'])
    ) {
        $status = absint($error_data['status']);
    }

    return new WP_REST_Response(
        [
            'success' => false,
            'message' => $error->get_error_message(),
        ],
        $status
    );
}

/*
|--------------------------------------------------------------------------
| Get All Learning Progress
|--------------------------------------------------------------------------
*/

function mh_get_learning()
{
    global $wpdb;

    $table = $wpdb->prefix . 'learning';

    $user_id = get_current_user_id();

    $learning = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$table}
            WHERE user_id = %d
            ORDER BY completed_at DESC
            ",
            $user_id
        ),
        ARRAY_A
    );

    if ($learning === null) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to retrieve learning progress.',
            ],
            500
        );
    }

    $formatted_learning = array_map(
        'mh_format_learning_record',
        $learning
    );

    return rest_ensure_response($formatted_learning);
}

/*
|--------------------------------------------------------------------------
| Get Learning Progress for One Roadmap
|--------------------------------------------------------------------------
*/

function mh_get_roadmap_learning(WP_REST_Request $request)
{
    global $wpdb;

    $table = $wpdb->prefix . 'learning';

    $user_id = get_current_user_id();

    $roadmap_id = absint(
        $request->get_param('roadmap_id')
    );

    $roadmap = mh_learning_get_roadmap_post($roadmap_id);

    if (is_wp_error($roadmap)) {
        return mh_learning_error_response($roadmap);
    }

    $learning = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$table}
            WHERE user_id = %d
            AND roadmap_id = %d
            ORDER BY completed_at DESC
            ",
            $user_id,
            $roadmap_id
        ),
        ARRAY_A
    );

    if ($learning === null) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to retrieve roadmap progress.',
            ],
            500
        );
    }

    $formatted_learning = array_map(
        'mh_format_learning_record',
        $learning
    );

    return rest_ensure_response($formatted_learning);
}

/*
|--------------------------------------------------------------------------
| Complete Learning Step
|--------------------------------------------------------------------------
*/

function mh_complete_learning_step(WP_REST_Request $request)
{
    global $wpdb;

    $table = $wpdb->prefix . 'learning';

    $user_id = get_current_user_id();

    $roadmap_id = absint(
        $request->get_param('roadmap_id')
    );

    $step_uuid = mh_learning_sanitize_step_uuid(
        $request->get_param('step_uuid')
    );

    /*
    |--------------------------------------------------------------------------
    | Validate Required Data
    |--------------------------------------------------------------------------
    */

    if (
        !$roadmap_id ||
        !mh_learning_is_valid_uuid($step_uuid)
    ) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'A valid roadmap ID and step UUID are required.',
            ],
            400
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Roadmap and Step
    |--------------------------------------------------------------------------
    */

    $step = mh_learning_find_step(
        $roadmap_id,
        $step_uuid
    );

    if (is_wp_error($step)) {
        return mh_learning_error_response($step);
    }

    /*
    |--------------------------------------------------------------------------
    | Check Existing Completion
    |--------------------------------------------------------------------------
    */

    $existing_record = $wpdb->get_row(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$table}
            WHERE user_id = %d
            AND step_uuid = %s
            LIMIT 1
            ",
            $user_id,
            $step_uuid
        ),
        ARRAY_A
    );

    if ($existing_record) {
        return new WP_REST_Response(
            [
                'success' => true,
                'message' => 'Step is already completed.',
                'record'  => mh_format_learning_record(
                    $existing_record
                ),
            ],
            200
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Save Completion
    |--------------------------------------------------------------------------
    */

    $current_time = current_time('mysql');

    $inserted = $wpdb->insert(
        $table,
        [
            'user_id'      => $user_id,
            'roadmap_id'   => $roadmap_id,
            'step_uuid'    => $step_uuid,
            'completed_at' => $current_time,
            'updated_at'   => $current_time,
        ],
        [
            '%d',
            '%d',
            '%s',
            '%s',
            '%s',
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Handle Duplicate Race Condition
    |--------------------------------------------------------------------------
    */

    if ($inserted === false) {
        $existing_record = $wpdb->get_row(
            $wpdb->prepare(
                "
                SELECT
                    id,
                    roadmap_id,
                    step_uuid,
                    completed_at,
                    updated_at
                FROM {$table}
                WHERE user_id = %d
                AND step_uuid = %s
                LIMIT 1
                ",
                $user_id,
                $step_uuid
            ),
            ARRAY_A
        );

        if ($existing_record) {
            return new WP_REST_Response(
                [
                    'success' => true,
                    'message' => 'Step is already completed.',
                    'record'  => mh_format_learning_record(
                        $existing_record
                    ),
                ],
                200
            );
        }

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to complete the learning step.',
            ],
            500
        );
    }

    $record_id = (int) $wpdb->insert_id;

    $record = $wpdb->get_row(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$table}
            WHERE id = %d
            AND user_id = %d
            LIMIT 1
            ",
            $record_id,
            $user_id
        ),
        ARRAY_A
    );

    /*
    |--------------------------------------------------------------------------
    | Update Continue Learning Information
    |--------------------------------------------------------------------------
    */

    update_user_meta(
        $user_id,
        'mh_last_opened_roadmap',
        $roadmap_id
    );

    update_user_meta(
        $user_id,
        'mh_last_opened_at',
        $current_time
    );

    return new WP_REST_Response(
        [
            'success' => true,
            'message' => 'Learning step completed successfully.',
            'record'  => mh_format_learning_record($record),
        ],
        201
    );
}

/*
|--------------------------------------------------------------------------
| Uncomplete Learning Step
|--------------------------------------------------------------------------
*/

function mh_uncomplete_learning_step(WP_REST_Request $request)
{
    global $wpdb;

    $table = $wpdb->prefix . 'learning';

    $user_id = get_current_user_id();

    $step_uuid = mh_learning_sanitize_step_uuid(
        $request->get_param('step_uuid')
    );

    if (!mh_learning_is_valid_uuid($step_uuid)) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'A valid step UUID is required.',
            ],
            400
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Find Existing Completion
    |--------------------------------------------------------------------------
    */

    $existing_record = $wpdb->get_row(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$table}
            WHERE user_id = %d
            AND step_uuid = %s
            LIMIT 1
            ",
            $user_id,
            $step_uuid
        ),
        ARRAY_A
    );

    if (!$existing_record) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Completed step not found.',
            ],
            404
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Delete Completion
    |--------------------------------------------------------------------------
    */

    $deleted = $wpdb->delete(
        $table,
        [
            'user_id'   => $user_id,
            'step_uuid' => $step_uuid,
        ],
        [
            '%d',
            '%s',
        ]
    );

    if ($deleted === false) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to update the learning step.',
            ],
            500
        );
    }

    if ($deleted === 0) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Completed step not found.',
            ],
            404
        );
    }

    return new WP_REST_Response(
        [
            'success'   => true,
            'message'   => 'Learning step marked as incomplete.',
            'roadmap_id' => (int) $existing_record['roadmap_id'],
            'step_uuid' => $step_uuid,
        ],
        200
    );
}

/*
|--------------------------------------------------------------------------
| Record Roadmap Visit
|--------------------------------------------------------------------------
*/

function mh_record_roadmap_visit(WP_REST_Request $request)
{
    $user_id = get_current_user_id();

    $roadmap_id = absint(
        $request->get_param('roadmap_id')
    );

    if (!$roadmap_id) {
        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Roadmap ID is required.',
            ],
            400
        );
    }

    $roadmap = mh_learning_get_roadmap_post($roadmap_id);

    if (is_wp_error($roadmap)) {
        return mh_learning_error_response($roadmap);
    }

    $opened_at = current_time('mysql');

    /*
    |--------------------------------------------------------------------------
    | Preserve Continue Learning
    |--------------------------------------------------------------------------
    */

    update_user_meta(
        $user_id,
        'mh_last_opened_roadmap',
        $roadmap_id
    );

    update_user_meta(
        $user_id,
        'mh_last_opened_at',
        $opened_at
    );

    /*
    |--------------------------------------------------------------------------
    | Maintain Recently Opened History
    |--------------------------------------------------------------------------
    */

    $history = get_user_meta(
        $user_id,
        'mh_recently_opened',
        true
    );

    if (!is_array($history)) {
        $history = [];
    }

    /*
    |--------------------------------------------------------------------------
    | Remove existing occurrence of this roadmap.
    |--------------------------------------------------------------------------
    */

    $history = array_values(
        array_filter(
            $history,
            function ($item) use ($roadmap_id) {

                return
                    is_array($item) &&
                    (
                        absint($item['roadmap_id'] ?? 0)
                        !==
                        $roadmap_id
                    );
            }
        )
    );

    /*
    |--------------------------------------------------------------------------
    | Add newest visit to the beginning.
    |--------------------------------------------------------------------------
    */

    array_unshift(
        $history,
        [
            'roadmap_id' => $roadmap_id,
            'opened_at'  => $opened_at,
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Keep only the latest 10 roadmaps.
    |--------------------------------------------------------------------------
    */

    $history = array_slice(
        $history,
        0,
        10
    );

    update_user_meta(
        $user_id,
        'mh_recently_opened',
        $history
    );

    return new WP_REST_Response(
        [
            'success'        => true,
            'message'        => 'Roadmap visit recorded.',
            'roadmap_id'     => $roadmap_id,
            'last_opened_at' => $opened_at,
        ],
        200
    );
}
