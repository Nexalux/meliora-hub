<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Register Authentication Routes
|--------------------------------------------------------------------------
*/

function mh_register_auth_routes()
{
    register_rest_route(
        'meliora/v1',
        '/register',
        [
            'methods'             => WP_REST_Server::CREATABLE,
            'callback'            => 'mh_register_user',
            'permission_callback' => '__return_true',

            'args' => [
                'name' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_text_field',
                ],

                'username' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_user',
                ],

                'email' => [
                    'required'          => true,
                    'sanitize_callback' => 'sanitize_email',
                ],

                'password' => [
                    'required' => true,
                ],
            ],
        ]
    );
}

add_action('rest_api_init', 'mh_register_auth_routes');


/*
|--------------------------------------------------------------------------
| Register User
|--------------------------------------------------------------------------
*/

function mh_register_user(WP_REST_Request $request)
{
    $rate_limit = mh_check_registration_rate_limit();

    if (is_wp_error($rate_limit)) {
        return $rate_limit;
    }

    $name = sanitize_text_field(
        $request->get_param('name')
    );

    $username = sanitize_user(
        $request->get_param('username'),
        true
    );

    $email = sanitize_email(
        $request->get_param('email')
    );

    $password = (string) $request->get_param('password');

    /*
    |--------------------------------------------------------------------------
    | Validate Required Fields
    |--------------------------------------------------------------------------
    */

    if (
        empty($name) ||
        empty($username) ||
        empty($email) ||
        empty($password)
    ) {
        return new WP_Error(
            'mh_missing_fields',
            'All fields are required.',
            ['status' => 400]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Username
    |--------------------------------------------------------------------------
    */

    if (!validate_username($username)) {
        return new WP_Error(
            'mh_invalid_username',
            'Please enter a valid username.',
            ['status' => 400]
        );
    }

    if (username_exists($username)) {
        return new WP_Error(
            'mh_username_exists',
            'That username is already registered.',
            ['status' => 409]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Email
    |--------------------------------------------------------------------------
    */

    if (!is_email($email)) {
        return new WP_Error(
            'mh_invalid_email',
            'Please enter a valid email address.',
            ['status' => 400]
        );
    }

    if (email_exists($email)) {
        return new WP_Error(
            'mh_email_exists',
            'That email address is already registered.',
            ['status' => 409]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Validate Password
    |--------------------------------------------------------------------------
    */

    if (strlen($password) < 8) {
        return new WP_Error(
            'mh_weak_password',
            'Password must contain at least 8 characters.',
            ['status' => 400]
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Create Subscriber Account
    |--------------------------------------------------------------------------
    */

    $user_id = wp_insert_user([
        'user_login'   => $username,
        'user_pass'    => $password,
        'user_email'   => $email,
        'display_name' => $name,
        'nickname'     => $name,
        'role'         => 'subscriber',
    ]);

    if (is_wp_error($user_id)) {
        return new WP_Error(
            'mh_registration_failed',
            $user_id->get_error_message(),
            ['status' => 400]
        );
    }

    return new WP_REST_Response(
        [
            'success' => true,

            'message' => 'Account created successfully.',

            'user' => [
                'id'       => $user_id,
                'name'     => $name,
                'username' => $username,
                'email'    => $email,
            ],
        ],
        201
    );
}

/**
 * Limit account-creation attempts per client address.
 *
 * The identifier is filterable for deployments behind a trusted reverse
 * proxy. Do not trust forwarded IP headers unless the proxy overwrites them.
 *
 * @return true|WP_Error
 */
function mh_check_registration_rate_limit()
{
    $client_identifier = (string) apply_filters(
        'mh_registration_client_identifier',
        mh_get_client_identifier()
    );

    $transient_key = 'mh_reg_' . md5($client_identifier);
    $attempts = (int) get_transient($transient_key);
    $maximum_attempts = max(
        1,
        (int) apply_filters('mh_registration_max_attempts', 5)
    );

    if ($attempts >= $maximum_attempts) {
        return new WP_Error(
            'mh_registration_rate_limited',
            'Too many registration attempts. Please try again later.',
            ['status' => 429]
        );
    }

    set_transient(
        $transient_key,
        $attempts + 1,
        HOUR_IN_SECONDS
    );

    return true;
}
