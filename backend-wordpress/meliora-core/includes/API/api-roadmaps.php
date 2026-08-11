<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Roadmap Taxonomy Helper
|--------------------------------------------------------------------------
*/

function mh_get_primary_roadmap_term($post_id, $taxonomy)
{
    $terms = wp_get_post_terms($post_id, $taxonomy);

    if (is_wp_error($terms) || empty($terms)) {
        return null;
    }

    $term = $terms[0];

    return [
        'id'   => (int) $term->term_id,
        'name' => $term->name,
        'slug' => $term->slug,
    ];
}

/*
|--------------------------------------------------------------------------
| Roadmap Response Builder
|--------------------------------------------------------------------------
*/

function mh_build_roadmap_response($post_id, $include_details = true)
{
    $post_id = absint($post_id);

    if ($post_id <= 0) {
        return null;
    }

    $post = get_post($post_id);

    if (
        !$post ||
        $post->post_type !== 'roadmap' ||
        $post->post_status !== 'publish'
    ) {
        return null;
    }

    $roadmap = new Roadmap($post_id);
    $data = $roadmap->get();

    $category = mh_get_primary_roadmap_term(
        $post_id,
        'roadmap_category'
    );

    $difficulty = mh_get_primary_roadmap_term(
        $post_id,
        'roadmap_difficulty'
    );

    $featured_image = get_the_post_thumbnail_url(
        $post_id,
        'large'
    );

    $response = [
        'id' => $post_id,

       'title' => wp_specialchars_decode(
    get_the_title($post_id),
    ENT_QUOTES
),

        'slug' => $post->post_name,

        'featured_image' => $featured_image ?: null,

        'category' => $category,

        'difficulty' => $difficulty,

        'short_description' =>
            $data['basic']['short_description'] ?? '',

        'duration' =>
            $data['classification']['duration'] ?? '',

        'steps_count' => is_array($data['steps'] ?? null)
            ? count($data['steps'])
            : 0,
    ];

    if ($include_details) {

        $response['learning'] = $data['learning'] ?? [
            'prerequisites' => '',
            'outcomes'      => '',
            'skills'        => '',
        ];

        $response['resources'] = $data['resources'] ?? [
            'docs'      => '',
            'roadmapsh' => '',
            'github'    => '',
            'youtube'   => '',
            'course'    => '',
        ];

        $response['steps'] = $data['steps'] ?? [];
    }

    return $response;
}

/*
|--------------------------------------------------------------------------
| GET /roadmaps
|--------------------------------------------------------------------------
*/

function mh_get_roadmaps()
{
    $query = new WP_Query([
        'post_type'              => 'roadmap',
        'posts_per_page'         => -1,
        'post_status'            => 'publish',
        'orderby'                => 'date',
        'order'                  => 'DESC',
        'no_found_rows'          => true,
        'update_post_meta_cache' => true,
        'update_post_term_cache' => true,
    ]);

    $roadmaps = [];

    foreach ($query->posts as $post) {

        $roadmap = mh_build_roadmap_response(
            $post->ID,
            false
        );

        if ($roadmap !== null) {
            $roadmaps[] = $roadmap;
        }
    }

    wp_reset_postdata();

    return rest_ensure_response($roadmaps);
}

/*
|--------------------------------------------------------------------------
| GET /roadmaps/{id}
|--------------------------------------------------------------------------
*/

function mh_get_single_roadmap(WP_REST_Request $request)
{
    $post_id = absint(
        $request->get_param('id')
    );

    $roadmap = mh_build_roadmap_response(
        $post_id,
        true
    );

    if ($roadmap === null) {

        return new WP_Error(
            'roadmap_not_found',
            'Roadmap not found.',
            [
                'status' => 404,
            ]
        );
    }

    return rest_ensure_response($roadmap);
}
