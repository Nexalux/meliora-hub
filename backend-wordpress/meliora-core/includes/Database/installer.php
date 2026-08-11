<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Database Installer
|--------------------------------------------------------------------------
*/

require_once MH_PLUGIN_PATH . 'includes/Database/bookmarks-schema.php';
require_once MH_PLUGIN_PATH . 'includes/Database/learning-schema.php';

/*
|--------------------------------------------------------------------------
| Install Plugin Database
|--------------------------------------------------------------------------
*/

function mh_install_plugin()
{
    mh_create_bookmarks_table();

    mh_create_learning_table();
}
