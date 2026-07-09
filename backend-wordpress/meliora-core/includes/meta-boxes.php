<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Register Meta Boxes
|--------------------------------------------------------------------------
*/

function mh_add_meta_boxes()
{
    add_meta_box(
        'mh_basic_information',
        '📘 Basic Information',
        'mh_render_basic_information',
        'roadmap',
        'normal',
        'high'
    );

    add_meta_box(
        'mh_classification',
        '📊 Classification',
        'mh_render_classification',
        'roadmap',
        'normal',
        'default'
    );

    add_meta_box(
        'mh_learning',
        '📚 Learning',
        'mh_render_learning',
        'roadmap',
        'normal',
        'default'
    );

    add_meta_box(
        'mh_resources',
        '🔗 Resources',
        'mh_render_resources',
        'roadmap',
        'normal',
        'default'
    );

    add_meta_box(
        'mh_steps',
        '📖 Learning Steps',
        'mh_render_steps',
        'roadmap',
        'normal',
        'default'
    );
}

add_action('add_meta_boxes', 'mh_add_meta_boxes');

/*
|--------------------------------------------------------------------------
| Helper
|--------------------------------------------------------------------------
*/

function mh_get_roadmap_data($post)
{
    return (new Roadmap($post->ID))->get();
}

/*
|--------------------------------------------------------------------------
| 📘 Basic Information
|--------------------------------------------------------------------------
*/

function mh_render_basic_information($post)
{
    $data = mh_get_roadmap_data($post);

    // Security nonce
    wp_nonce_field('mh_save_roadmap', 'mh_roadmap_nonce');
?>

<div class="mh-field">

    <label for="mh_short_description">
        Short Description
    </label>

    <textarea
        id="mh_short_description"
        name="mh_short_description"
        rows="4"
    ><?php echo esc_textarea($data['basic']['short_description']); ?></textarea>

</div>

<?php
}

/*
|--------------------------------------------------------------------------
| 📊 Classification
|--------------------------------------------------------------------------
*/

function mh_render_classification($post)
{
    $data = mh_get_roadmap_data($post);
?>

<div class="mh-field">

    <label for="mh_estimated_hours">
        Estimated Hours
    </label>

    <input
        id="mh_estimated_hours"
        type="number"
        name="mh_estimated_hours"
        min="0"
        value="<?php echo esc_attr($data['classification']['estimated_hours']); ?>"
    >

</div>

<p class="mh-note">
    Category, Difficulty and Duration are currently managed from the WordPress sidebar.
</p>

<?php
}


/*
|--------------------------------------------------------------------------
| 📚 Learning
|--------------------------------------------------------------------------
*/

function mh_render_learning($post)
{
    $data = mh_get_roadmap_data($post);
?>

<div class="mh-field">

    <label for="mh_prerequisites">
        Prerequisites
    </label>

    <textarea
        id="mh_prerequisites"
        name="mh_prerequisites"
        rows="4"
    ><?php echo esc_textarea($data['learning']['prerequisites']); ?></textarea>

</div>

<div class="mh-field">

    <label for="mh_outcomes">
        Learning Outcomes
    </label>

    <textarea
        id="mh_outcomes"
        name="mh_outcomes"
        rows="4"
    ><?php echo esc_textarea($data['learning']['outcomes']); ?></textarea>

</div>

<div class="mh-field">

    <label for="mh_skills">
        Skills Covered
    </label>

    <textarea
        id="mh_skills"
        name="mh_skills"
        rows="4"
    ><?php echo esc_textarea($data['learning']['skills']); ?></textarea>

</div>

<?php
}


/*
|--------------------------------------------------------------------------
| 🔗 Resources
|--------------------------------------------------------------------------
*/

function mh_render_resources($post)
{
    $data = mh_get_roadmap_data($post);
?>

<div class="mh-field">

    <label for="mh_docs">
        Official Docs
    </label>

    <input
        id="mh_docs"
        type="url"
        name="mh_docs"
        value="<?php echo esc_attr($data['resources']['docs']); ?>"
    >

</div>

<div class="mh-field">

    <label for="mh_roadmapsh">
        Roadmap.sh URL
    </label>

    <input
        id="mh_roadmapsh"
        type="url"
        name="mh_roadmapsh"
        value="<?php echo esc_attr($data['resources']['roadmapsh']); ?>"
    >

</div>

<div class="mh-field">

    <label for="mh_github">
        GitHub Repository
    </label>

    <input
        id="mh_github"
        type="url"
        name="mh_github"
        value="<?php echo esc_attr($data['resources']['github']); ?>"
    >

</div>

<div class="mh-field">

    <label for="mh_youtube">
        YouTube Playlist / Video
    </label>

    <input
        id="mh_youtube"
        type="url"
        name="mh_youtube"
        value="<?php echo esc_attr($data['resources']['youtube']); ?>"
    >

</div>

<div class="mh-field">

    <label for="mh_course">
        Recommended Course
    </label>

    <input
        id="mh_course"
        type="url"
        name="mh_course"
        value="<?php echo esc_attr($data['resources']['course']); ?>"
    >

</div>

<?php
}

/*
|--------------------------------------------------------------------------
| 📖 Learning Steps
|--------------------------------------------------------------------------
*/

function mh_render_steps($post)
{
    $data = mh_get_roadmap_data($post);

    $steps = $data['steps'];

    if (empty($steps)) {
        $steps[] = [
            'title'       => '',
            'description' => '',
            'duration'    => '',
            'difficulty'  => 'Beginner'
        ];
    }

?>

<div id="mh-step-builder">

<?php foreach ($steps as $step) : ?>

<div class="mh-step-card">

    <button
        type="button"
        class="mh-step-toggle"
    >

        <span class="mh-step-title-preview">
            <?php echo esc_html($step['title'] ?: 'New Step'); ?>
        </span>

        <span>▼</span>

    </button>

    <div class="mh-step-body">

        <div class="mh-field">

            <label>Step Title</label>

            <input
                type="text"
                class="mh-step-title-input"
                name="mh_steps[title][]"
                placeholder="Example: Learn HTML"
                value="<?php echo esc_attr($step['title']); ?>"
            >

        </div>

        <div class="mh-field">

            <label>Description</label>

            <textarea
                name="mh_steps[description][]"
                rows="4"
                placeholder="Describe this learning step..."
            ><?php echo esc_textarea($step['description']); ?></textarea>

        </div>

        <div class="mh-row">

            <div class="mh-field">

                <label>Estimated Time</label>

                <input
                    type="text"
                    name="mh_steps[duration][]"
                    placeholder="2 Hours"
                    value="<?php echo esc_attr($step['duration']); ?>"
                >

            </div>

            <div class="mh-field">

                <label>Difficulty</label>

                <select name="mh_steps[difficulty][]">

                    <?php

                    $options = [
                        'Beginner',
                        'Intermediate',
                        'Advanced'
                    ];

                    foreach ($options as $option) :
                    ?>

                        <option
                            value="<?php echo esc_attr($option); ?>"
                            <?php selected($step['difficulty'], $option); ?>
                        >
                            <?php echo esc_html($option); ?>
                        </option>

                    <?php endforeach; ?>

                </select>

            </div>

        </div>

        <button
            type="button"
            class="button mh-remove-step"
        >
            Remove Step
        </button>

    </div>

</div>

<?php endforeach; ?>

</div>

<p style="margin-top:15px;">

    <button
        type="button"
        id="mh-add-step"
        class="button button-primary"
    >
        ➕ Add Step
    </button>

</p>

<?php
}