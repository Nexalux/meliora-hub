<?php
/**
 * Plugin Name: Meliora Deployment Loader
 * Description: Loads required API plugins from the immutable Render image.
 */

if (!defined('ABSPATH')) {
    exit;
}

$jwt_plugin = WP_PLUGIN_DIR . '/jwt-authentication-for-wp-rest-api/jwt-auth.php';
$meliora_plugin = WP_PLUGIN_DIR . '/meliora-core/meliora-core.php';

if (file_exists($jwt_plugin)) {
    require_once $jwt_plugin;
}

if (file_exists($meliora_plugin)) {
    require_once $meliora_plugin;
}

add_action(
    'init',
    static function () {
        $installed_version = get_option('mh_render_schema_version');

        if (
            defined('MH_VERSION') &&
            $installed_version !== MH_VERSION &&
            function_exists('mh_install_plugin')
        ) {
            mh_install_plugin();
            update_option('mh_render_schema_version', MH_VERSION, false);
        }
    },
    1
);
