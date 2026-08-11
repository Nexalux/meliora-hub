<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Bookmark Routes
|--------------------------------------------------------------------------
*/

function mh_register_bookmark_routes()
{
    /*
    |--------------------------------------------------------------------------
    | GET /bookmarks
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/bookmarks',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_bookmarks',
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]
    );

    /*
|--------------------------------------------------------------------------
| GET /bookmarks/roadmaps
|--------------------------------------------------------------------------
*/

register_rest_route(
    'meliora/v1',
    '/bookmarks/roadmaps',
    [
        'methods'             => WP_REST_Server::READABLE,
        'callback'            => 'mh_get_bookmarked_roadmaps',
        'permission_callback' => function () {
            return is_user_logged_in();
        },
    ]
);

    /*
    |--------------------------------------------------------------------------
    | POST /bookmarks
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/bookmarks',
        [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'mh_add_bookmark',
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | DELETE /bookmarks/{roadmap_id}
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/bookmarks/(?P<roadmap_id>\d+)',
        [
            'methods'             => WP_REST_Server::DELETABLE,
            'callback'            => 'mh_remove_bookmark',
            'permission_callback' => function () {
                return is_user_logged_in();
            },
        ]
    );
}

add_action(
    'rest_api_init',
    'mh_register_bookmark_routes'
);

/*
|--------------------------------------------------------------------------
| Get Bookmarks
|--------------------------------------------------------------------------
*/

function mh_get_bookmarks()
{
    global $wpdb;

    $table = $wpdb->prefix . 'bookmarks';

    $user_id = get_current_user_id();

    $bookmarks = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                created_at
            FROM {$table}
            WHERE user_id = %d
            ORDER BY created_at DESC
            ",
            $user_id
        ),
        ARRAY_A
    );

    foreach ($bookmarks as &$bookmark) {

        $bookmark['id'] = (int) $bookmark['id'];
        $bookmark['roadmap_id'] = (int) $bookmark['roadmap_id'];

    }

    unset($bookmark);

    return rest_ensure_response($bookmarks);
}

/*
|--------------------------------------------------------------------------
| Get Bookmarked Roadmaps
|--------------------------------------------------------------------------
*/

function mh_get_bookmarked_roadmaps()
{
    global $wpdb;

    $table = $wpdb->prefix . 'bookmarks';

    $user_id = get_current_user_id();

    $bookmarks = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                created_at
            FROM {$table}
            WHERE user_id = %d
            ORDER BY created_at DESC
            ",
            $user_id
        ),
        ARRAY_A
    );

    $response = [];

    foreach ($bookmarks as $bookmark) {

       $roadmap = mh_get_roadmap_summary(
    (int) $bookmark['roadmap_id']
);

/*
|--------------------------------------------------------------------------
| Remove stale bookmarks
|--------------------------------------------------------------------------
|
| If the roadmap no longer exists or is no longer available,
| automatically remove the orphaned bookmark so the database
| stays clean.
|
*/

if (!$roadmap) {

    $wpdb->delete(
        $table,
        [
            'id' => (int) $bookmark['id'],
        ],
        [
            '%d',
        ]
    );

    continue;
}

$response[] = [

    'bookmark_id' => (int) $bookmark['id'],

    'created_at' => $bookmark['created_at'],

    'roadmap' => $roadmap,

];
    }

    return rest_ensure_response($response);
}

/*
|--------------------------------------------------------------------------
| Add Bookmark
|--------------------------------------------------------------------------
*/

function mh_add_bookmark(WP_REST_Request $request)
{
    global $wpdb;

    $table = $wpdb->prefix . 'bookmarks';

    $user_id = get_current_user_id();

    $roadmap_id = absint(
        $request->get_param('roadmap_id')
    );

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!$roadmap_id) {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Roadmap ID is required.',
            ],
            400
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Validate Roadmap Exists
    |--------------------------------------------------------------------------
    */

    $roadmap = get_post($roadmap_id);

    if (!$roadmap || $roadmap->post_type !== 'roadmap') {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Roadmap not found.',
            ],
            404
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Prevent Duplicate Bookmarks
    |--------------------------------------------------------------------------
    */

    $exists = $wpdb->get_var(
        $wpdb->prepare(
            "
            SELECT id
            FROM {$table}
            WHERE user_id = %d
            AND roadmap_id = %d
            ",
            $user_id,
            $roadmap_id
        )
    );

    if ($exists) {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Roadmap already bookmarked.',
            ],
            409
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Save Bookmark
    |--------------------------------------------------------------------------
    */

    $inserted = $wpdb->insert(
        $table,
        [
            'user_id'    => $user_id,
            'roadmap_id' => $roadmap_id,
        ],
        [
            '%d',
            '%d',
        ]
    );

    if ($inserted === false) {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to save bookmark.',
            ],
            500
        );

    }

    return new WP_REST_Response(
        [
            'success' => true,
            'message' => 'Roadmap bookmarked successfully.',
        ],
        201
    );
}

/*
|--------------------------------------------------------------------------
| Remove Bookmark
|--------------------------------------------------------------------------
*/

function mh_remove_bookmark(WP_REST_Request $request)
{
    global $wpdb;

    $table = $wpdb->prefix . 'bookmarks';

    $user_id = get_current_user_id();

    $roadmap_id = absint(
        $request->get_param('roadmap_id')
    );

    /*
    |--------------------------------------------------------------------------
    | Validation
    |--------------------------------------------------------------------------
    */

    if (!$roadmap_id) {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Roadmap ID is required.',
            ],
            400
        );

    }

    /*
|--------------------------------------------------------------------------
| Check Bookmark Exists
|--------------------------------------------------------------------------
|
| We intentionally don't validate that the roadmap still exists.
| If the roadmap has been deleted, the user should still be able
| to remove the orphaned bookmark.
|
*/

$exists = $wpdb->get_var(
    $wpdb->prepare(
        "
        SELECT id
        FROM {$table}
        WHERE user_id = %d
        AND roadmap_id = %d
        ",
        $user_id,
        $roadmap_id
    )
);

if (!$exists) {

    return new WP_REST_Response(
        [
            'success' => false,
            'message' => 'Bookmark not found.',
        ],
        404
    );

}

    /*
    |--------------------------------------------------------------------------
    | Delete Bookmark
    |--------------------------------------------------------------------------
    */

    $deleted = $wpdb->delete(
        $table,
        [
            'user_id'    => $user_id,
            'roadmap_id' => $roadmap_id,
        ],
        [
            '%d',
            '%d',
        ]
    );

    if ($deleted === false) {

        return new WP_REST_Response(
            [
                'success' => false,
                'message' => 'Failed to remove bookmark.',
            ],
            500
        );

    }

    return new WP_REST_Response(
        [
            'success' => true,
            'message' => 'Bookmark removed successfully.',
        ],
        200
    );
}
