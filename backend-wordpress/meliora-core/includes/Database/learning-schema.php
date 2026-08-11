<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Learning Schema
|--------------------------------------------------------------------------
*/

function mh_create_learning_table()
{
    global $wpdb;

    require_once ABSPATH . 'wp-admin/includes/upgrade.php';

    $table = $wpdb->prefix . 'learning';

    $charset_collate = $wpdb->get_charset_collate();

    $sql = "CREATE TABLE {$table} (

        id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,

        user_id BIGINT UNSIGNED NOT NULL,

        roadmap_id BIGINT UNSIGNED NOT NULL,

        step_uuid VARCHAR(36) NOT NULL,

        completed_at DATETIME NOT NULL
            DEFAULT CURRENT_TIMESTAMP,

        updated_at DATETIME NOT NULL
            DEFAULT CURRENT_TIMESTAMP
            ON UPDATE CURRENT_TIMESTAMP,

        PRIMARY KEY (id),

        UNIQUE KEY unique_learning (user_id, step_uuid),

        KEY user_id (user_id),

        KEY roadmap_id (roadmap_id),

        KEY step_uuid (step_uuid)

    ) {$charset_collate};";

    dbDelta($sql);
}
