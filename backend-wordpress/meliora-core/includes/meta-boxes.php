<?php

if (!defined('ABSPATH')) {
    exit;
}

function mh_add_meta_boxes()
{
    add_meta_box('mh_basic_information','ðŸ“˜ Basic Information','mh_render_basic_information','roadmap','normal','high');
    add_meta_box('mh_classification','ðŸ“Š Classification','mh_render_classification','roadmap','normal','default');
    add_meta_box('mh_learning','ðŸ“š Learning','mh_render_learning','roadmap','normal','default');
    add_meta_box('mh_resources','ðŸ”— Resources','mh_render_resources','roadmap','normal','default');
    add_meta_box('mh_steps','ðŸ“– Learning Steps','mh_render_steps','roadmap','normal','default');
}
add_action('add_meta_boxes', 'mh_add_meta_boxes');

function mh_get_roadmap_data($post)
{
    return (new Roadmap($post->ID))->get();
}

function mh_render_basic_information($post)
{
    $data = mh_get_roadmap_data($post);
    wp_nonce_field('mh_save_roadmap', 'mh_roadmap_nonce');
    ?>
    <div class="mh-field">
        <label for="mh_short_description_editor">Short Description</label>
        <?php
        wp_editor(
            $data['basic']['short_description'] ?? '',
            'mh_short_description_editor',
            [
                'textarea_name' => 'mh_short_description',
                'textarea_rows' => 5,
                'media_buttons' => false,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'formatselect,bold,italic,bullist,numlist,blockquote,link,unlink,undo,redo',
                    'toolbar2' => '',
                ],
            ]
        );
        ?>
    </div>
    <?php
}

function mh_render_classification($post)
{
    $data = mh_get_roadmap_data($post);
    ?>
    <div class="mh-field">
        <label for="mh_duration">Duration</label>
        <input id="mh_duration" type="text" name="mh_duration" placeholder="e.g. 3 Months, 8 Weeks, 120 Hours" value="<?php echo esc_attr($data['classification']['duration'] ?? ''); ?>">
    </div>
    <p class="mh-note">Categories and Difficulty are managed from the WordPress sidebar.</p>
    <?php
}

function mh_render_learning($post)
{
    $data = mh_get_roadmap_data($post);
    ?>
    <div class="mh-field">
        <label for="mh_prerequisites_editor">Prerequisites</label>
        <?php
        wp_editor(
            $data['learning']['prerequisites'] ?? '',
            'mh_prerequisites_editor',
            [
                'textarea_name' => 'mh_prerequisites',
                'textarea_rows' => 6,
                'media_buttons' => false,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'formatselect,bold,italic,bullist,numlist,blockquote,link,unlink,undo,redo',
                    'toolbar2' => '',
                ],
            ]
        );
        ?>
    </div>

    <div class="mh-field">
        <label for="mh_outcomes_editor">Learning Outcomes</label>
        <?php
        wp_editor(
            $data['learning']['outcomes'] ?? '',
            'mh_outcomes_editor',
            [
                'textarea_name' => 'mh_outcomes',
                'textarea_rows' => 6,
                'media_buttons' => false,
                'teeny' => false,
                'quicktags' => true,
                'tinymce' => [
                    'toolbar1' => 'formatselect,bold,italic,bullist,numlist,blockquote,link,unlink,undo,redo',
                    'toolbar2' => '',
                ],
            ]
        );
        ?>
    </div>

    <div class="mh-field">
        <label for="mh_skills">Skills Covered</label>
        <textarea id="mh_skills" name="mh_skills" rows="4"><?php echo esc_textarea($data['learning']['skills'] ?? ''); ?></textarea>
    </div>
    <?php
}

function mh_render_resources($post)
{
    $data = mh_get_roadmap_data($post);
    ?>
    <div class="mh-field">
        <label for="mh_docs">Official Docs</label>
        <input id="mh_docs" type="url" name="mh_docs" value="<?php echo esc_attr($data['resources']['docs'] ?? ''); ?>">
    </div>
    <div class="mh-field">
        <label for="mh_roadmapsh">Roadmap.sh URL</label>
        <input id="mh_roadmapsh" type="url" name="mh_roadmapsh" value="<?php echo esc_attr($data['resources']['roadmapsh'] ?? ''); ?>">
    </div>
    <div class="mh-field">
        <label for="mh_github">GitHub Repository</label>
        <input id="mh_github" type="url" name="mh_github" value="<?php echo esc_attr($data['resources']['github'] ?? ''); ?>">
    </div>
    <div class="mh-field">
        <label for="mh_youtube">YouTube Playlist / Video</label>
        <input id="mh_youtube" type="url" name="mh_youtube" value="<?php echo esc_attr($data['resources']['youtube'] ?? ''); ?>">
    </div>
    <div class="mh-field">
        <label for="mh_course">Recommended Course</label>
        <input id="mh_course" type="url" name="mh_course" value="<?php echo esc_attr($data['resources']['course'] ?? ''); ?>">
    </div>
    <?php
}

function mh_render_steps($post)
{
    $data = mh_get_roadmap_data($post);
    $steps = $data['steps'] ?? [];

    if (!$steps) {
        $steps[] = [
            'id' => '',
            'title' => '',
            'description' => '',
            'duration' => '',
            'difficulty' => 'Beginner',
            'resources' => [],
        ];
    }
    ?>
    <div id="mh-step-builder">
        <?php foreach ($steps as $index => $step) : ?>
            <div class="mh-step-card">
                <button type="button" class="mh-step-toggle">
                    <span class="mh-step-preview">
                        <span class="mh-step-number-preview">
                            STEP <?php echo esc_html(str_pad((string) ($index + 1), 2, '0', STR_PAD_LEFT)); ?>
                        </span>
                        <span class="mh-step-title-preview"><?php echo esc_html(!empty($step['title']) ? $step['title'] : 'New Step'); ?></span>
                    </span>
                    <span aria-hidden="true">&#9660;</span>
                </button>

                <div class="mh-step-body">
                    <input type="hidden" name="mh_steps[id][]" value="<?php echo esc_attr($step['id'] ?? ''); ?>">

                    <div class="mh-field">
                        <label>Step Title</label>
                        <input type="text" class="mh-step-title-input" name="mh_steps[title][]" placeholder="Example: Learn HTML" value="<?php echo esc_attr($step['title'] ?? ''); ?>">
                    </div>

                    <div class="mh-field">
                        <label>Description</label>
                        <textarea name="mh_steps[description][]" rows="6" placeholder="Describe this learning step..."><?php echo esc_textarea($step['description'] ?? ''); ?></textarea>
                        <p class="description">Supports multiple paragraphs and copy/paste. Line breaks are preserved automatically.</p>
                    </div>

                    <div class="mh-row">
                        <div class="mh-field">
                            <label>Estimated Time</label>
                            <input type="text" name="mh_steps[duration][]" placeholder="2 Hours" value="<?php echo esc_attr($step['duration'] ?? ''); ?>">
                        </div>

                        <div class="mh-field">
                            <label>Difficulty</label>
                            <select name="mh_steps[difficulty][]">
                                <?php
                                $difficulty_options = ['Beginner', 'Intermediate', 'Advanced'];
                                $selected_difficulty = $step['difficulty'] ?? 'Beginner';
                                foreach ($difficulty_options as $option) :
                                    ?>
                                    <option value="<?php echo esc_attr($option); ?>" <?php selected($selected_difficulty, $option); ?>><?php echo esc_html($option); ?></option>
                                <?php endforeach; ?>
                            </select>
                        </div>
                    </div>

                    <div class="mh-field">
                        <label>Resources</label>
                        <textarea name="mh_steps[resources][]" rows="5" placeholder="Official Docs | https://developer.mozilla.org | docs&#10;HTML Crash Course | https://youtube.com/... | youtube"><?php
                            if (!empty($step['resources']) && is_array($step['resources'])) {
                                $lines = [];
                                foreach ($step['resources'] as $resource) {
                                    if (!is_array($resource)) {
                                        continue;
                                    }
                                    $lines[] = sprintf(
                                        '%s | %s | %s',
                                        $resource['title'] ?? '',
                                        $resource['url'] ?? '',
                                        $resource['type'] ?? 'other'
                                    );
                                }
                                echo esc_textarea(implode("\n", $lines));
                            }
                        ?></textarea>
                        <p class="description">
                            One resource per line.<br>
                            Format: <code>Title | URL | Type</code><br>
                            Types:
                            <strong>docs</strong>,
                            <strong>youtube</strong>,
                            <strong>github</strong>,
                            <strong>course</strong>,
                            <strong>article</strong>,
                            <strong>playground</strong>,
                            <strong>download</strong>,
                            <strong>other</strong>
                        </p>
                    </div>

                    <div class="mh-step-card-actions">
                        <button type="button" class="button mh-insert-step">Insert Step Below</button>
                        <button type="button" class="button mh-remove-step">Remove Step</button>
                    </div>
                </div>
            </div>
        <?php endforeach; ?>
    </div>

    <p class="mh-step-actions">
        <button type="button" id="mh-add-step" class="button button-primary">+ Add Step</button>
    </p>
    <?php
}
