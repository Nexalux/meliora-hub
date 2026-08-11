<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Meliora REST API Routes
|--------------------------------------------------------------------------
|
| This file is responsible only for registering REST routes.
|
|--------------------------------------------------------------------------
*/

function mh_register_rest_routes()
{
    /*
    |--------------------------------------------------------------------------
    | Roadmaps
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/roadmaps',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_roadmaps',
            'permission_callback' => '__return_true',
        ]
    );

    register_rest_route(
        'meliora/v1',
        '/roadmaps/(?P<id>\d+)',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_single_roadmap',
            'permission_callback' => '__return_true',
            'args'                => [
                'id' => [
                    'required' => true,
                    'validate_callback' => function ($value) {
                        return absint($value) > 0;
                    },
                ],
            ],
        ]
    );

    /*
    |--------------------------------------------------------------------------
    | Dashboard
    |--------------------------------------------------------------------------
    */

    register_rest_route(
        'meliora/v1',
        '/dashboard',
        [
            'methods'             => WP_REST_Server::READABLE,
            'callback'            => 'mh_get_dashboard_data',
            'permission_callback' => 'mh_dashboard_permissions_check',
        ]
    );
}

add_action('rest_api_init', 'mh_register_rest_routes');
