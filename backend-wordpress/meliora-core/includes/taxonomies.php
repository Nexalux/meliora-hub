<?php

if (!defined('ABSPATH')) {
    exit;
}

function mh_register_taxonomies()
{
    /*
    |--------------------------------------------------------------------------
    | Categories
    |--------------------------------------------------------------------------
    */

    register_taxonomy('roadmap_category', 'roadmap', [

        'labels' => [
            'name'          => 'Categories',
            'singular_name' => 'Category',
        ],

        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,

        'rewrite' => [
            'slug' => 'roadmap-category'
        ]

    ]);

    /*
    |--------------------------------------------------------------------------
    | Difficulty
    |--------------------------------------------------------------------------
    */

    register_taxonomy('roadmap_difficulty', 'roadmap', [

        'labels' => [
            'name'          => 'Difficulty',
            'singular_name' => 'Difficulty',
        ],

        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,

        'rewrite' => [
            'slug' => 'roadmap-difficulty'
        ]

    ]);
}

add_action('init', 'mh_register_taxonomies');
