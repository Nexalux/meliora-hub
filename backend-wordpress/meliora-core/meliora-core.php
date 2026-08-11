<?php
/*
Plugin Name: Meliora Core
Description: Core functionality for Meliora Hub.
Version: 1.0.0
Author: Tanishq
Text Domain: meliora-core
*/

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Plugin Constants
|--------------------------------------------------------------------------
*/

if (!defined('MH_VERSION')) {
    define('MH_VERSION', '1.0.0');
}

if (!defined('MH_PLUGIN_FILE')) {
    define('MH_PLUGIN_FILE', __FILE__);
}

if (!defined('MH_PLUGIN_PATH')) {
    define('MH_PLUGIN_PATH', plugin_dir_path(__FILE__));
}

if (!defined('MH_PLUGIN_URL')) {
    define('MH_PLUGIN_URL', plugin_dir_url(__FILE__));
}

/*
|--------------------------------------------------------------------------
| Database
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/Database/installer.php';

register_activation_hook(
    MH_PLUGIN_FILE,
    'mh_install_plugin'
);

/*
|--------------------------------------------------------------------------
| Core
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/post-types.php';
require_once MH_PLUGIN_PATH . 'includes/taxonomies.php';

/*
|--------------------------------------------------------------------------
| Models
|--------------------------------------------------------------------------
|
| Models must load before helpers and API files that use them.
|
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/Models/Roadmap.php';

/*
|--------------------------------------------------------------------------
| Admin
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/meta-boxes.php';
require_once MH_PLUGIN_PATH . 'includes/Admin/SaveRoadmap.php';

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/helpers/roadmap-helper.php';
require_once MH_PLUGIN_PATH . 'includes/security.php';

/*
|--------------------------------------------------------------------------
| REST API
|--------------------------------------------------------------------------
|
| API controllers are loaded before route registration.
| This allows api.php to register routes while the callback
| functions already exist.
|
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/API/api-roadmaps.php';
require_once MH_PLUGIN_PATH . 'includes/API/api-dashboard.php';
require_once MH_PLUGIN_PATH . 'includes/API/api-learning.php';

require_once MH_PLUGIN_PATH . 'includes/api.php';
require_once MH_PLUGIN_PATH . 'includes/api-auth.php';
require_once MH_PLUGIN_PATH . 'includes/api-bookmarks.php';

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/settings.php';

/*
|--------------------------------------------------------------------------
| Admin Assets
|--------------------------------------------------------------------------
|
| For now, this stays in the main plugin file.
| We will review includes/Admin/Assets.php before deciding whether to move it.
|
|--------------------------------------------------------------------------
*/

function mh_admin_assets($hook_suffix)
{
    if (!function_exists('get_current_screen')) {
        return;
    }

    $screen = get_current_screen();

    if (!$screen || $screen->post_type !== 'roadmap') {
        return;
    }

    /*
    |--------------------------------------------------------------------------
    | Asset Paths
    |--------------------------------------------------------------------------
    */

    $css_path =
        MH_PLUGIN_PATH . 'assets/css/admin.css';

    $js_path =
        MH_PLUGIN_PATH . 'assets/js/admin.js';

    /*
    |--------------------------------------------------------------------------
    | Admin CSS
    |--------------------------------------------------------------------------
    |
    | filemtime() changes the version whenever the file changes.
    | This prevents the browser from using stale cached CSS.
    |--------------------------------------------------------------------------
    */

    wp_enqueue_style(
        'mh-admin',
        MH_PLUGIN_URL . 'assets/css/admin.css',
        [],
        file_exists($css_path)
            ? filemtime($css_path)
            : MH_VERSION
    );

    /*
    |--------------------------------------------------------------------------
    | Admin JavaScript
    |--------------------------------------------------------------------------
    |
    | Same cache-busting system for admin.js.
    |--------------------------------------------------------------------------
    */

    wp_enqueue_script(
        'mh-admin',
        MH_PLUGIN_URL . 'assets/js/admin.js',
        [],
        file_exists($js_path)
            ? filemtime($js_path)
            : MH_VERSION,
        true
    );
}

add_action(
    'admin_enqueue_scripts',
    'mh_admin_assets'
);
