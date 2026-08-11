<?php

if (!defined('ABSPATH')) {
    exit;
}

function mh_dashboard_permissions_check()
{
    return is_user_logged_in();
}

/*
|--------------------------------------------------------------------------
| Dashboard Data
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_data()
{
    return rest_ensure_response([
        'stats'             => mh_get_dashboard_stats(),
        'continue_learning' => mh_get_dashboard_continue_learning(),
        'activities'        => mh_get_dashboard_recent_activity(),
        'recommendations'   => mh_get_dashboard_recommendations(),
    ]);
}

/*
|--------------------------------------------------------------------------
| Dashboard Stats
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_stats()
{
    global $wpdb;

    $user_id = get_current_user_id();

    $roadmap_counts = wp_count_posts('roadmap');

    $stats = [
        'roadmaps'  => (int) ($roadmap_counts->publish ?? 0),
        'bookmarks' => 0,
        'completed' => 0,
        'streak'    => 0,
    ];

    if (!$user_id) {
        return $stats;
    }

    $bookmarks_table = $wpdb->prefix . 'bookmarks';
    $learning_table  = $wpdb->prefix . 'learning';

    $stats['bookmarks'] = (int) $wpdb->get_var(
        $wpdb->prepare(
            "
            SELECT COUNT(*)
            FROM {$bookmarks_table}
            WHERE user_id = %d
            ",
            $user_id
        )
    );

    $stats['completed'] = (int) $wpdb->get_var(
        $wpdb->prepare(
            "
            SELECT COUNT(*)
            FROM {$learning_table}
            WHERE user_id = %d
            ",
            $user_id
        )
    );

    $stats['streak'] = mh_get_dashboard_streak(
        $user_id
    );

    return $stats;
}

/*
|--------------------------------------------------------------------------
| Calculate Learning Streak
|--------------------------------------------------------------------------
|
| A streak remains active when the latest completed step was today or
| yesterday. Consecutive completion dates are counted backwards.
|
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_streak($user_id)
{
    global $wpdb;

    $learning_table = $wpdb->prefix . 'learning';

    $dates = $wpdb->get_col(
        $wpdb->prepare(
            "
            SELECT DISTINCT DATE(completed_at)
            FROM {$learning_table}
            WHERE user_id = %d
            ORDER BY DATE(completed_at) DESC
            ",
            $user_id
        )
    );

    if (empty($dates)) {
        return 0;
    }

    $dates = array_values(
        array_filter(
            array_map(
                'sanitize_text_field',
                $dates
            )
        )
    );

    if (empty($dates)) {
        return 0;
    }

    $timezone = wp_timezone();

    $today = new DateTimeImmutable(
        current_time('Y-m-d'),
        $timezone
    );

    $latest_date = DateTimeImmutable::createFromFormat(
        '!Y-m-d',
        $dates[0],
        $timezone
    );

    if (!$latest_date) {
        return 0;
    }

    $latest_difference = (int) $latest_date
        ->diff($today)
        ->format('%r%a');

    /*
    |--------------------------------------------------------------------------
    | The streak has expired when the latest activity is older than yesterday.
    |--------------------------------------------------------------------------
    */

    if (
        $latest_difference < 0 ||
        $latest_difference > 1
    ) {
        return 0;
    }

    $streak        = 0;
    $expected_date = $latest_date;

    foreach ($dates as $date_string) {
        $activity_date = DateTimeImmutable::createFromFormat(
            '!Y-m-d',
            $date_string,
            $timezone
        );

        if (!$activity_date) {
            continue;
        }

        if (
            $activity_date->format('Y-m-d') !==
            $expected_date->format('Y-m-d')
        ) {
            break;
        }

        $streak++;

        $expected_date = $expected_date->modify(
            '-1 day'
        );
    }

    return $streak;
}

/*
|--------------------------------------------------------------------------
| Continue Learning
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_continue_learning()
{
    global $wpdb;

    $user_id = get_current_user_id();

    if (!$user_id) {
        return null;
    }

    $learning_table = $wpdb->prefix . 'learning';

    /*
    |--------------------------------------------------------------------------
    | Prefer the last roadmap explicitly opened by the user.
    |--------------------------------------------------------------------------
    */

    $roadmap_id = absint(
        get_user_meta(
            $user_id,
            'mh_last_opened_roadmap',
            true
        )
    );

    /*
    |--------------------------------------------------------------------------
    | Fall back to the roadmap with the latest completed learning step.
    |--------------------------------------------------------------------------
    */

    if (!$roadmap_id) {
        $roadmap_id = absint(
            $wpdb->get_var(
                $wpdb->prepare(
                    "
                    SELECT roadmap_id
                    FROM {$learning_table}
                    WHERE user_id = %d
                    ORDER BY updated_at DESC, completed_at DESC
                    LIMIT 1
                    ",
                    $user_id
                )
            )
        );
    }

    if (!$roadmap_id) {
        return null;
    }

    $continue_learning = mh_build_dashboard_learning_roadmap(
        $user_id,
        $roadmap_id
    );

    /*
    |--------------------------------------------------------------------------
    | If the last opened roadmap is already finished, find another unfinished
    | roadmap that contains completed steps.
    |--------------------------------------------------------------------------
    */

    if (
        $continue_learning &&
        empty($continue_learning['is_complete'])
    ) {
        unset($continue_learning['is_complete']);

        return $continue_learning;
    }

    $recent_roadmap_ids = $wpdb->get_col(
        $wpdb->prepare(
            "
            SELECT roadmap_id
            FROM {$learning_table}
            WHERE user_id = %d
            GROUP BY roadmap_id
            ORDER BY MAX(updated_at) DESC, MAX(completed_at) DESC
            ",
            $user_id
        )
    );

    foreach ($recent_roadmap_ids as $recent_roadmap_id) {
        $recent_roadmap_id = absint(
            $recent_roadmap_id
        );

        if (
            !$recent_roadmap_id ||
            $recent_roadmap_id === $roadmap_id
        ) {
            continue;
        }

        $candidate = mh_build_dashboard_learning_roadmap(
            $user_id,
            $recent_roadmap_id
        );

        if (
            $candidate &&
            empty($candidate['is_complete'])
        ) {
            unset($candidate['is_complete']);

            return $candidate;
        }
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| Build Continue Learning Roadmap
|--------------------------------------------------------------------------
*/

function mh_build_dashboard_learning_roadmap(
    $user_id,
    $roadmap_id
) {
    global $wpdb;

    $post = get_post($roadmap_id);

    if (
        !$post ||
        $post->post_type !== 'roadmap' ||
        $post->post_status !== 'publish'
    ) {
        return null;
    }

    $roadmap = mh_build_roadmap_response(
        $roadmap_id,
        true
    );

    if (!is_array($roadmap)) {
        return null;
    }

    $steps = isset($roadmap['steps']) &&
        is_array($roadmap['steps'])
            ? $roadmap['steps']
            : [];

    $total_steps = count($steps);

    if ($total_steps === 0) {
        return null;
    }

    $learning_table = $wpdb->prefix . 'learning';

    $completed_uuids = $wpdb->get_col(
        $wpdb->prepare(
            "
            SELECT step_uuid
            FROM {$learning_table}
            WHERE user_id = %d
            AND roadmap_id = %d
            ",
            $user_id,
            $roadmap_id
        )
    );

    $completed_lookup = [];

    foreach ($completed_uuids as $completed_uuid) {
        $completed_uuid = strtolower(
            sanitize_text_field(
                (string) $completed_uuid
            )
        );

        if ($completed_uuid !== '') {
            $completed_lookup[$completed_uuid] = true;
        }
    }

    $completed_count = 0;
    $next_step       = null;

    foreach ($steps as $step) {
        if (!is_array($step)) {
            continue;
        }

        $step_uuid = strtolower(
            sanitize_text_field(
                (string) ($step['id'] ?? '')
            )
        );

        if ($step_uuid === '') {
            continue;
        }

        if (isset($completed_lookup[$step_uuid])) {
            $completed_count++;
            continue;
        }

        if ($next_step === null) {
            $next_step = $step;
        }
    }

    $progress_percent = (int) round(
        ($completed_count / $total_steps) * 100
    );

    return array_merge(
        $roadmap,
        [
            'completed_count'  => $completed_count,
            'total_steps'      => $total_steps,
            'progress_percent' => $progress_percent,
            'next_step'        => $next_step,
            'is_complete'      => (
                $completed_count >= $total_steps
            ),
        ]
    );
}

/*
|--------------------------------------------------------------------------
| Dashboard Bookmark Activities
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_bookmark_activities()
{
    global $wpdb;

    $user_id = get_current_user_id();

    if (!$user_id) {
        return [];
    }

    $table = $wpdb->prefix . 'bookmarks';

    $records = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                created_at
            FROM {$table}
            WHERE user_id = %d
            ORDER BY created_at DESC
            LIMIT 8
            ",
            $user_id
        ),
        ARRAY_A
    );

    if (empty($records)) {
        return [];
    }

    $activities = [];

    foreach ($records as $record) {

        $roadmap_id = absint(
            $record['roadmap_id'] ?? 0
        );

        if (!$roadmap_id) {
            continue;
        }

        $roadmap_title = sanitize_text_field(
            get_the_title($roadmap_id)
        );

        $created_at = sanitize_text_field(
            (string) ($record['created_at'] ?? '')
        );

        $activities[] = [

            'id'            => absint($record['id'] ?? 0),
            'type'          => 'roadmap_bookmarked',
            'roadmap_id'    => $roadmap_id,
            'roadmap_title' => $roadmap_title,
            'title'         => 'Bookmarked',
            'description'   => $roadmap_title,
            'timestamp'     => $created_at,
            'created_at'    => $created_at,

        ];
    }

    return $activities;

}

/*
|--------------------------------------------------------------------------
| Dashboard Recently Opened Activities
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_recently_opened_activities()
{
    $user_id = get_current_user_id();

    if (!$user_id) {
        return [];
    }

    $history = get_user_meta(
        $user_id,
        'mh_recently_opened',
        true
    );

    if (!is_array($history)) {
        return [];
    }

    $activities = [];

    foreach ($history as $index => $item) {

        if (!is_array($item)) {
            continue;
        }

        $roadmap_id = absint(
            $item['roadmap_id'] ?? 0
        );

        if (!$roadmap_id) {
            continue;
        }

        $roadmap_title = sanitize_text_field(
            get_the_title($roadmap_id)
        );

        $opened_at = sanitize_text_field(
            (string) ($item['opened_at'] ?? '')
        );

        $activities[] = [

            'id'            => 'opened-' . $roadmap_id . '-' . $index,
            'type'          => 'roadmap_opened',
            'roadmap_id'    => $roadmap_id,
            'roadmap_title' => $roadmap_title,
            'title'         => 'Opened',
            'description'   => $roadmap_title,
            'timestamp'     => $opened_at,
            'opened_at'     => $opened_at,

        ];
    }

    return $activities;
}

/*
|--------------------------------------------------------------------------
| Recent Activity
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_recent_activity()
{
    global $wpdb;

    $user_id = get_current_user_id();

    if (!$user_id) {
        return [];
    }

    $learning_table = $wpdb->prefix . 'learning';

    $records = $wpdb->get_results(
        $wpdb->prepare(
            "
            SELECT
                id,
                roadmap_id,
                step_uuid,
                completed_at,
                updated_at
            FROM {$learning_table}
            WHERE user_id = %d
            ORDER BY completed_at DESC
            LIMIT 8
            ",
            $user_id
        ),
        ARRAY_A
    );

    $activities = [];
    $roadmap_cache = [];

    /*
    |--------------------------------------------------------------------------
    | Completed Steps
    |--------------------------------------------------------------------------
    */

    foreach ($records as $record) {

        $roadmap_id = absint(
            $record['roadmap_id'] ?? 0
        );

        $step_uuid = strtolower(
            sanitize_text_field(
                (string) ($record['step_uuid'] ?? '')
            )
        );

        if (!$roadmap_id || $step_uuid === '') {
            continue;
        }

        if (!array_key_exists(
            $roadmap_id,
            $roadmap_cache
        )) {

            $roadmap_cache[$roadmap_id] =
                mh_build_roadmap_response(
                    $roadmap_id,
                    true
                );

        }

        $roadmap = $roadmap_cache[$roadmap_id];

        if (!is_array($roadmap)) {
            continue;
        }

        $step = mh_get_dashboard_roadmap_step(
            $roadmap,
            $step_uuid
        );

        $step_title = sanitize_text_field(
            (string) ($step['title'] ?? 'Learning step')
        );

        $roadmap_title = sanitize_text_field(
            (string)
            (
                $roadmap['title']
                ??
                get_the_title($roadmap_id)
            )
        );

        $completed_at = sanitize_text_field(
            (string)
            (
                $record['completed_at']
                ??
                ''
            )
        );

        $activities[] = [

            'id' => absint(
                $record['id']
            ),

            'type' => 'step_completed',

            'roadmap_id' => $roadmap_id,

            'roadmap_title' => $roadmap_title,

            'step_uuid' => $step_uuid,

            'step_title' => $step_title,

            'title' => 'Completed ' . $step_title,

            'description' => $roadmap_title,

            'timestamp' => $completed_at,

            'completed_at' => $completed_at,

            'updated_at' => sanitize_text_field(
                (string)
                (
                    $record['updated_at']
                    ??
                    ''
                )
            ),

        ];

    }

    /*
    |--------------------------------------------------------------------------
    | Merge Bookmarks
    |--------------------------------------------------------------------------
    */

    $activities = array_merge(
        $activities,
        mh_get_dashboard_bookmark_activities()
    );

    /*
    |--------------------------------------------------------------------------
    | Merge Recently Opened
    |--------------------------------------------------------------------------
    */

    $activities = array_merge(
        $activities,
        mh_get_dashboard_recently_opened_activities()
    );

    /*
    |--------------------------------------------------------------------------
    | Sort newest first
    |--------------------------------------------------------------------------
    */

    usort(
        $activities,
        function ($a, $b) {

            return strcmp(
                $b['timestamp'],
                $a['timestamp']
            );

        }
    );

    /*
    |--------------------------------------------------------------------------
    | Latest 8 Activities
    |--------------------------------------------------------------------------
    */

    return array_slice(
        $activities,
        0,
        8
    );
}

/*
|--------------------------------------------------------------------------
| Find Roadmap Step
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_roadmap_step(
    array $roadmap,
    $step_uuid
) {
    $steps = isset($roadmap['steps']) &&
        is_array($roadmap['steps'])
            ? $roadmap['steps']
            : [];

    foreach ($steps as $step) {
        if (!is_array($step)) {
            continue;
        }

        $current_uuid = strtolower(
            sanitize_text_field(
                (string) ($step['id'] ?? '')
            )
        );

        if (
            $current_uuid !== '' &&
            hash_equals($current_uuid, $step_uuid)
        ) {
            return $step;
        }
    }

    return null;
}

/*
|--------------------------------------------------------------------------
| Recommended Roadmaps
|--------------------------------------------------------------------------
*/

function mh_get_dashboard_recommendations()
{
    global $wpdb;

    $user_id       = get_current_user_id();
    $learning_table = $wpdb->prefix . 'learning';

    $exclude_ids = [];

    /*
    |--------------------------------------------------------------------------
    | Avoid recommending roadmaps the user has already started.
    |--------------------------------------------------------------------------
    */

    if ($user_id) {
        $exclude_ids = array_map(
            'absint',
            $wpdb->get_col(
                $wpdb->prepare(
                    "
                    SELECT DISTINCT roadmap_id
                    FROM {$learning_table}
                    WHERE user_id = %d
                    ",
                    $user_id
                )
            )
        );
    }

    $query_args = [
        'post_type'              => 'roadmap',
        'posts_per_page'         => 4,
        'post_status'            => 'publish',
        'orderby'                => 'date',
        'order'                  => 'DESC',
        'no_found_rows'          => true,
        'update_post_meta_cache' => true,
        'update_post_term_cache' => true,
    ];

    if (!empty($exclude_ids)) {
        $query_args['post__not_in'] = $exclude_ids;
    }

    $query = new WP_Query($query_args);

    /*
    |--------------------------------------------------------------------------
    | When every roadmap has already been started, show the latest roadmaps
    | instead of returning an empty section.
    |--------------------------------------------------------------------------
    */

    if (
        empty($query->posts) &&
        !empty($exclude_ids)
    ) {
        $query = new WP_Query([
            'post_type'              => 'roadmap',
            'posts_per_page'         => 4,
            'post_status'            => 'publish',
            'orderby'                => 'date',
            'order'                  => 'DESC',
            'no_found_rows'          => true,
            'update_post_meta_cache' => true,
            'update_post_term_cache' => true,
        ]);
    }

    $roadmaps = [];

    foreach ($query->posts as $post) {
        $roadmap = mh_build_roadmap_response(
            $post->ID,
            false
        );

        if (is_array($roadmap)) {
            $roadmaps[] = $roadmap;
        }
    }

    wp_reset_postdata();

    return $roadmaps;
}
