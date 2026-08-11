<?php

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Return a stable client identifier for rate limiting.
 *
 * Deployments behind a trusted proxy can replace this value with a filter.
 * Forwarded IP headers are intentionally not trusted by default.
 */
function mh_get_client_identifier()
{
    $client_identifier = isset($_SERVER['REMOTE_ADDR'])
        ? sanitize_text_field(wp_unslash($_SERVER['REMOTE_ADDR']))
        : 'unknown';

    return (string) apply_filters(
        'mh_client_identifier',
        $client_identifier
    );
}

/**
 * Return the origins allowed to call the Meliora and JWT REST routes.
 *
 * Define MH_ALLOWED_ORIGINS in wp-config.php as an array or a comma-separated
 * string when the production frontend is hosted on a different origin.
 * Same-origin requests do not require CORS headers.
 *
 * @return string[]
 */
function mh_get_allowed_origins()
{
    $allowed_origins = [];

    if (defined('MH_ALLOWED_ORIGINS')) {
        $configured = MH_ALLOWED_ORIGINS;

        $allowed_origins = is_array($configured)
            ? $configured
            : preg_split('/\s*,\s*/', (string) $configured);
    }

    $home_parts = wp_parse_url(home_url());

    if (!empty($home_parts['scheme']) && !empty($home_parts['host'])) {
        $home_origin = $home_parts['scheme'] . '://' . $home_parts['host'];

        if (!empty($home_parts['port'])) {
            $home_origin .= ':' . $home_parts['port'];
        }

        $allowed_origins[] = $home_origin;

        if (in_array($home_parts['host'], ['localhost', '127.0.0.1'], true)) {
            $allowed_origins[] = 'http://localhost:5173';
            $allowed_origins[] = 'http://127.0.0.1:5173';
        }
    }

    $allowed_origins = array_map(
        static function ($origin) {
            return untrailingslashit(esc_url_raw((string) $origin));
        },
        array_filter($allowed_origins)
    );

    return array_values(array_unique(
        apply_filters('mh_allowed_rest_origins', $allowed_origins)
    ));
}

/**
 * Replace WordPress's reflected REST CORS headers on Meliora-owned routes.
 */
function mh_secure_rest_cors($served, $result, $request)
{
    $route = ltrim($request->get_route(), '/');
    $is_meliora_route = strpos($route, 'meliora/v1/') === 0;
    $is_jwt_route = strpos($route, 'jwt-auth/v1/') === 0;

    if (!$is_meliora_route && !$is_jwt_route) {
        return $served;
    }

    header_remove('Access-Control-Allow-Origin');
    header_remove('Access-Control-Allow-Credentials');

    $origin = get_http_origin();

    if (!$origin) {
        return $served;
    }

    $origin = untrailingslashit($origin);

    if (!in_array($origin, mh_get_allowed_origins(), true)) {
        return $served;
    }

    header('Access-Control-Allow-Origin: ' . $origin);
    header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, PATCH, DELETE');
    header('Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce');
    header('Vary: Origin', false);

    return $served;
}

add_filter('rest_pre_serve_request', 'mh_secure_rest_cors', PHP_INT_MAX, 3);

/**
 * Limit repeated JWT login attempts before they reach password verification.
 */
function mh_limit_login_attempts($result, $server, $request)
{
    if (
        $request->get_method() !== WP_REST_Server::CREATABLE ||
        $request->get_route() !== '/jwt-auth/v1/token'
    ) {
        return $result;
    }

    $transient_key = 'mh_login_' . md5(mh_get_client_identifier());
    $attempts = (int) get_transient($transient_key);
    $maximum_attempts = max(
        1,
        (int) apply_filters('mh_login_max_attempts', 10)
    );

    if ($attempts >= $maximum_attempts) {
        return new WP_Error(
            'mh_login_rate_limited',
            'Too many sign-in attempts. Please try again later.',
            ['status' => 429]
        );
    }

    set_transient(
        $transient_key,
        $attempts + 1,
        15 * MINUTE_IN_SECONDS
    );

    return $result;
}

add_filter('rest_pre_dispatch', 'mh_limit_login_attempts', 10, 3);
