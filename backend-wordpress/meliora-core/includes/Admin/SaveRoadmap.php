<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Validate Step UUID
|--------------------------------------------------------------------------
*/

function mh_is_valid_step_uuid($uuid)
{
    return (bool) preg_match(
        '/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i',
        $uuid
    );
}

/*
|--------------------------------------------------------------------------
| Save Roadmap
|--------------------------------------------------------------------------
*/


/*
|--------------------------------------------------------------------------
| Clean + Normalize TinyMCE HTML
|--------------------------------------------------------------------------
*/

function mh_clean_editor_html($html)
{
    $html = wp_unslash($html);

    /*
    |--------------------------------------------------------------------------
    | Remove browser / extension generated attributes
    |--------------------------------------------------------------------------
    */

    $html = preg_replace(
        '/\sclass="PDq2pG_selectionAnchorContainer"/i',
        '',
        $html
    );

    $html = preg_replace(
        '/\sdata-[a-zA-Z0-9_-]+="[^"]*"/i',
        '',
        $html
    );

    $html = preg_replace(
        '#<span[^>]*>\s*</span>#i',
        '',
        $html
    );

    /*
    |--------------------------------------------------------------------------
    | Normalize paragraphs
    |--------------------------------------------------------------------------
    |
    | Converts:
    |
    | Paragraph one
    |
    | Paragraph two
    |
    | into:
    |
    | <p>Paragraph one</p>
    | <p>Paragraph two</p>
    |
    | Existing TinyMCE HTML remains valid.
    |--------------------------------------------------------------------------
    */

    $html = wpautop(
        trim($html)
    );

    /*
    |--------------------------------------------------------------------------
    | Allow safe WordPress post HTML only
    |--------------------------------------------------------------------------
    */

    return wp_kses_post($html);
}

function mh_save_roadmap($post_id)
{
    /*
    |--------------------------------------------------------------------------
    | Security Checks
    |--------------------------------------------------------------------------
    */

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (wp_is_post_revision($post_id)) {
        return;
    }

    if (get_post_type($post_id) !== 'roadmap') {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    if (
        !isset($_POST['mh_roadmap_nonce']) ||
        !wp_verify_nonce(
            sanitize_text_field(
                wp_unslash($_POST['mh_roadmap_nonce'])
            ),
            'mh_save_roadmap'
        )
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
    mh_clean_editor_html(
        $_POST['mh_short_description'] ?? ''
    );

    /*
    |--------------------------------------------------------------------------
    | Classification
    |--------------------------------------------------------------------------
    */

    $data['classification']['duration'] =
        sanitize_text_field(
            wp_unslash(
                $_POST['mh_duration'] ?? ''
            )
        );

    /*
    |--------------------------------------------------------------------------
    | Learning
    |--------------------------------------------------------------------------
    */

    $data['learning']['prerequisites'] =
    mh_clean_editor_html(
        $_POST['mh_prerequisites'] ?? ''
    );

$data['learning']['outcomes'] =
    mh_clean_editor_html(
        $_POST['mh_outcomes'] ?? ''
    );

    $data['learning']['skills'] =
        sanitize_textarea_field(
            wp_unslash(
                $_POST['mh_skills'] ?? ''
            )
        );

    /*
    |--------------------------------------------------------------------------
    | Resources
    |--------------------------------------------------------------------------
    */

    $data['resources']['docs'] =
        esc_url_raw(
            wp_unslash(
                $_POST['mh_docs'] ?? ''
            )
        );

    $data['resources']['roadmapsh'] =
        esc_url_raw(
            wp_unslash(
                $_POST['mh_roadmapsh'] ?? ''
            )
        );

    $data['resources']['github'] =
        esc_url_raw(
            wp_unslash(
                $_POST['mh_github'] ?? ''
            )
        );

    $data['resources']['youtube'] =
        esc_url_raw(
            wp_unslash(
                $_POST['mh_youtube'] ?? ''
            )
        );

    $data['resources']['course'] =
        esc_url_raw(
            wp_unslash(
                $_POST['mh_course'] ?? ''
            )
        );

    /*
    |--------------------------------------------------------------------------
    | Learning Steps
    |--------------------------------------------------------------------------
    */

    $data['steps'] = [];

    $submitted_steps =
        isset($_POST['mh_steps']) &&
        is_array($_POST['mh_steps'])
            ? wp_unslash($_POST['mh_steps'])
            : [];

    $submitted_titles =
        isset($submitted_steps['title']) &&
        is_array($submitted_steps['title'])
            ? $submitted_steps['title']
            : [];

    $submitted_resources =
    isset($submitted_steps['resources']) &&
    is_array($submitted_steps['resources'])
        ? $submitted_steps['resources']
        : [];

    $allowed_difficulties = [
        'Beginner',
        'Intermediate',
        'Advanced',
    ];

    foreach ($submitted_titles as $index => $submitted_title) {
        $step_uuid = sanitize_text_field(
            $submitted_steps['id'][$index] ?? ''
        );

        $title = sanitize_text_field(
            $submitted_title
        );

        $description = mh_clean_editor_html(
            $submitted_steps['description'][$index] ?? ''
        );

        $duration = sanitize_text_field(
            $submitted_steps['duration'][$index] ?? ''
        );

        $difficulty = sanitize_text_field(
            $submitted_steps['difficulty'][$index] ?? 'Beginner'
        );

        if (!in_array($difficulty, $allowed_difficulties, true)) {
            $difficulty = 'Beginner';
        }

        $resources = [];

        $resource_text = trim(
            $submitted_resources[$index] ?? ''
        );

        if ($resource_text !== '') {

            $lines = preg_split(
                "/\r\n|\n|\r/",
                $resource_text
            );

            foreach ($lines as $line) {

                $line = trim($line);

                if ($line === '') {
                    continue;
                }

                $parts = array_map(
                    'trim',
                    explode('|', $line, 3)
                );

                if (count($parts) < 2) {
                    continue;
                }

                $type = sanitize_key(
                    $parts[2] ?? 'other'
                );

                $allowed_types = [
                    'docs',
                    'youtube',
                    'github',
                    'course',
                    'article',
                    'playground',
                    'download',
                    'other',
                ];

                if (!in_array($type, $allowed_types, true)) {
                    $type = 'other';
                }

                $resources[] = [
                    'title' => sanitize_text_field(
                        $parts[0]
                    ),
                    'url' => esc_url_raw(
                        $parts[1]
                    ),
                    'type' => $type,
                ];
            }
        }

        /*
        |--------------------------------------------------------------------------
        | Ignore Completely Empty Rows
        |--------------------------------------------------------------------------
        */

        if (
            $title === '' &&
            $description === '' &&
            $duration === ''
        ) {
            continue;
        }

        /*
        |--------------------------------------------------------------------------
        | Preserve or Generate Permanent Step UUID
        |--------------------------------------------------------------------------
        */

        if (!mh_is_valid_step_uuid($step_uuid)) {
            $step_uuid = wp_generate_uuid4();
        }

       $data['steps'][] = [
    'id'          => $step_uuid,
    'title'       => $title,
    'description' => $description,
    'duration'    => $duration,
    'difficulty'  => $difficulty,
    'resources'   => $resources,
];
    }

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    $roadmap->save($data);
}

add_action('save_post', 'mh_save_roadmap');
