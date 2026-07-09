<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Roadmaps
|--------------------------------------------------------------------------
*/

function mh_register_roadmaps_post_type()
{
    register_post_type('roadmap', [

        'labels' => [
            'name'               => 'Roadmaps',
            'singular_name'      => 'Roadmap',
            'add_new'            => 'Add Roadmap',
            'add_new_item'       => 'Add New Roadmap',
            'edit_item'          => 'Edit Roadmap',
            'new_item'           => 'New Roadmap',
            'view_item'          => 'View Roadmap',
            'search_items'       => 'Search Roadmaps',
            'not_found'          => 'No Roadmaps found.',
            'not_found_in_trash' => 'No Roadmaps found in Trash.'
        ],

        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'show_in_rest'       => true,
        'has_archive'        => true,
        'hierarchical'       => false,

        'menu_position'      => 5,
        'menu_icon'          => 'dashicons-welcome-learn-more',

        'supports' => [
            'title',
            'thumbnail'
        ],

        'rewrite' => [
            'slug' => 'roadmaps'
        ]

    ]);
}

add_action('init', 'mh_register_roadmaps_post_type');