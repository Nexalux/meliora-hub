<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Meliora REST API
|--------------------------------------------------------------------------
*/

function mh_register_rest_routes()
{
    register_rest_route('meliora/v1', '/roadmaps', [
        'methods'  => 'GET',
        'callback' => 'mh_get_roadmaps',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('meliora/v1', '/roadmaps/(?P<id>\d+)', [
        'methods'  => 'GET',
        'callback' => 'mh_get_single_roadmap',
        'permission_callback' => '__return_true',
    ]);
}

add_action('rest_api_init', 'mh_register_rest_routes');


function mh_get_roadmaps()
{
    $query = new WP_Query([
        'post_type'      => 'roadmap',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
    ]);

    $roadmaps = [];

    foreach ($query->posts as $post) {
        $roadmap = new Roadmap($post->ID);
        $data = $roadmap->get();

        $roadmaps[] = [
            'id'          => $post->ID,
            'title'       => get_the_title($post->ID),
            'slug'        => $post->post_name,
            'image'       => get_the_post_thumbnail_url($post->ID, 'large'),
            'data'        => $data,
        ];
    }

    return rest_ensure_response($roadmaps);
}


function mh_get_single_roadmap($request)
{
    $id = absint($request['id']);

    if (!$id || get_post_type($id) !== 'roadmap') {
        return new WP_Error(
            'roadmap_not_found',
            'Roadmap not found',
            ['status' => 404]
        );
    }

    $post = get_post($id);
    $roadmap = new Roadmap($id);

    return rest_ensure_response([
        'id'      => $id,
        'title'   => get_the_title($id),
        'slug'    => $post->post_name,
        'image'   => get_the_post_thumbnail_url($id, 'large'),
        'data'    => $roadmap->get(),
    ]);
}