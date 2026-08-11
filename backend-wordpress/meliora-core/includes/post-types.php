<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Roadmap Custom Post Type
|--------------------------------------------------------------------------
*/

function mh_register_roadmaps_post_type()
{
    $labels = [

        'name'                  => __('Roadmaps', 'meliora-core'),
        'singular_name'         => __('Roadmap', 'meliora-core'),

        'menu_name'             => __('Roadmaps', 'meliora-core'),

        'add_new'               => __('Add New', 'meliora-core'),
        'add_new_item'          => __('Add New Roadmap', 'meliora-core'),

        'edit_item'             => __('Edit Roadmap', 'meliora-core'),
        'new_item'              => __('New Roadmap', 'meliora-core'),

        'view_item'             => __('View Roadmap', 'meliora-core'),
        'view_items'            => __('View Roadmaps', 'meliora-core'),

        'search_items'          => __('Search Roadmaps', 'meliora-core'),

        'not_found'             => __('No roadmaps found.', 'meliora-core'),
        'not_found_in_trash'    => __('No roadmaps found in Trash.', 'meliora-core'),

        'all_items'             => __('All Roadmaps', 'meliora-core'),

        'archives'              => __('Roadmap Archives', 'meliora-core'),

        'featured_image'        => __('Featured Image', 'meliora-core'),

        'set_featured_image'    => __('Set Featured Image', 'meliora-core'),

        'remove_featured_image' => __('Remove Featured Image', 'meliora-core'),

        'use_featured_image'    => __('Use as Featured Image', 'meliora-core'),
    ];

    register_post_type('roadmap', [

        'labels' => $labels,

        /*
        |--------------------------------------------------------------------------
        | Visibility
        |--------------------------------------------------------------------------
        */

        'public'                => true,
        'publicly_queryable'    => true,
        'show_ui'               => true,
        'show_in_menu'          => true,
        'show_in_nav_menus'     => true,
        'show_in_admin_bar'     => true,
        'show_in_rest'          => true,

        /*
        |--------------------------------------------------------------------------
        | Behaviour
        |--------------------------------------------------------------------------
        */

        'has_archive'           => true,
        'hierarchical'          => false,
        'exclude_from_search'   => false,

        /*
        |--------------------------------------------------------------------------
        | Appearance
        |--------------------------------------------------------------------------
        */

        'menu_position'         => 5,
        'menu_icon'             => 'dashicons-welcome-learn-more',

        /*
        |--------------------------------------------------------------------------
        | Editor Support
        |--------------------------------------------------------------------------
        */

        'supports' => [
            'title',
            'thumbnail',
        ],

        /*
        |--------------------------------------------------------------------------
        | URL
        |--------------------------------------------------------------------------
        */

        'rewrite' => [
            'slug'       => 'roadmaps',
            'with_front' => false,
        ],

        /*
        |--------------------------------------------------------------------------
        | Misc
        |--------------------------------------------------------------------------
        */

        'can_export'            => true,
        'delete_with_user'      => false,
    ]);
}

add_action('init', 'mh_register_roadmaps_post_type');
