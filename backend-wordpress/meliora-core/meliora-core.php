<?php
/*
Plugin Name: Meliora Core
Description: Core functionality for Meliora Hub.
Version: 1.0.0
Author: Tanishq
*/

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Plugin Constants
|--------------------------------------------------------------------------
*/

define('MH_VERSION', '1.0.0');
define('MH_PLUGIN_PATH', plugin_dir_path(__FILE__));
define('MH_PLUGIN_URL', plugin_dir_url(__FILE__));

/*
|--------------------------------------------------------------------------
| Includes
|--------------------------------------------------------------------------
*/

// Core
require_once MH_PLUGIN_PATH . 'includes/post-types.php';
require_once MH_PLUGIN_PATH . 'includes/taxonomies.php';

// Models
require_once MH_PLUGIN_PATH . 'includes/Models/Roadmap.php';

// Admin
require_once MH_PLUGIN_PATH . 'includes/meta-boxes.php';
require_once MH_PLUGIN_PATH . 'includes/Admin/SaveRoadmap.php';

// API
require_once MH_PLUGIN_PATH . 'includes/api.php';

// Helpers
require_once MH_PLUGIN_PATH . 'includes/helpers.php';
require_once MH_PLUGIN_PATH . 'includes/settings.php';

/*
|--------------------------------------------------------------------------
| Admin Assets
|--------------------------------------------------------------------------
*/

function mh_admin_assets($hook)
{
    $screen = get_current_screen();

    if (!$screen || $screen->post_type !== 'roadmap') {
        return;
    }

    wp_enqueue_style(
        'mh-admin',
        MH_PLUGIN_URL . 'assets/css/admin.css',
        [],
        MH_VERSION
    );

    wp_enqueue_script(
        'mh-admin',
        MH_PLUGIN_URL . 'assets/js/admin.js',
        [],
        MH_VERSION,
        true
    );
}

add_action('admin_enqueue_scripts', 'mh_admin_assets');