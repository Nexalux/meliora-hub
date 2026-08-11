<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Bookmarks Schema
|--------------------------------------------------------------------------
*/

function mh_create_bookmarks_table()
{
    global $wpdb;

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $table = $wpdb->prefix . 'bookmarks';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table} (

        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

        user_id BIGINT UNSIGNED NOT NULL,

        roadmap_id BIGINT UNSIGNED NOT NULL,

        created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        UNIQUE KEY unique_bookmark (user_id, roadmap_id),

        KEY user_id (user_id),

        KEY roadmap_id (roadmap_id)

    ) {$charset_collate};";

    dbDelta($sql);
}
