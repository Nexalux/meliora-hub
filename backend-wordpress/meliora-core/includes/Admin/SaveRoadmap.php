<?php

if (!defined('ABSPATH')) {
    exit;
}

function mh_save_roadmap($post_id)
{
    /*
    |--------------------------------------------------------------------------
    | Security Checks
    |--------------------------------------------------------------------------
    */

    // Ignore autosaves
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    // Ignore revisions
    if (wp_is_post_revision($post_id)) {
        return;
    }

    // Only save Roadmaps
    if (get_post_type($post_id) !== 'roadmap') {
        return;
    }

    // Verify nonce
    if (
        !isset($_POST['mh_roadmap_nonce']) ||
        !wp_verify_nonce($_POST['mh_roadmap_nonce'], 'mh_save_roadmap')
    ) {
        return;
    }

    $roadmap = new Roadmap($post_id);

    $data = $roadmap->get();

    /*
    |--------------------------------------------------------------------------
    | Basic Information
    |--------------------------------------------------------------------------
    */

    $data['basic']['short_description'] =
        sanitize_textarea_field($_POST['mh_short_description'] ?? '');

    /*
    |--------------------------------------------------------------------------
    | Classification
    |--------------------------------------------------------------------------
    */

    $data['classification']['estimated_hours'] =
        absint($_POST['mh_estimated_hours'] ?? 0);

    /*
    |--------------------------------------------------------------------------
    | Learning
    |--------------------------------------------------------------------------
    */

    $data['learning']['prerequisites'] =
        sanitize_textarea_field($_POST['mh_prerequisites'] ?? '');

    $data['learning']['outcomes'] =
        sanitize_textarea_field($_POST['mh_outcomes'] ?? '');

    $data['learning']['skills'] =
        sanitize_textarea_field($_POST['mh_skills'] ?? '');

    /*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    */

    $data['resources']['docs'] =
        esc_url_raw($_POST['mh_docs'] ?? '');

    $data['resources']['roadmapsh'] =
        esc_url_raw($_POST['mh_roadmapsh'] ?? '');

    $data['resources']['github'] =
        esc_url_raw($_POST['mh_github'] ?? '');

    $data['resources']['youtube'] =
        esc_url_raw($_POST['mh_youtube'] ?? '');

    $data['resources']['course'] =
        esc_url_raw($_POST['mh_course'] ?? '');

    /*
    |--------------------------------------------------------------------------
    | Learning Steps
    |--------------------------------------------------------------------------
    */

    $data['steps'] = [];

    if (!empty($_POST['mh_steps']['title'])) {

        foreach ($_POST['mh_steps']['title'] as $i => $title) {

            $data['steps'][] = [

                'title' => sanitize_text_field($title),

                'description' => sanitize_textarea_field(
                    $_POST['mh_steps']['description'][$i] ?? ''
                ),

                'duration' => sanitize_text_field(
                    $_POST['mh_steps']['duration'][$i] ?? ''
                ),

                'difficulty' => sanitize_text_field(
                    $_POST['mh_steps']['difficulty'][$i] ?? 'Beginner'
                )

            ];
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    $roadmap->save($data);
}

add_action('save_post', 'mh_save_roadmap');