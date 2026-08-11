<?php

if (!defined('ABSPATH')) {
    exit;
}

/*
|--------------------------------------------------------------------------
| Roadmap Helper Functions
|--------------------------------------------------------------------------
*/

/**
 * Get a lightweight roadmap summary.
 *
 * Used by:
 * - Bookmarks
 * - Dashboard
 * - Search
 * - Recommendations
 * - Continue Learning
 */
function mh_get_roadmap_summary($roadmap_id)
{
    $post = get_post($roadmap_id);

    if (
        !$post ||
        $post->post_type !== 'roadmap' ||
        $post->post_status !== 'publish'
    ) {
        return null;
    }

    /*
    |--------------------------------------------------------------------------
    | Roadmap Model
    |--------------------------------------------------------------------------
    */

    $roadmap = new Roadmap($roadmap_id);
    $data = $roadmap->get();

    /*
    |--------------------------------------------------------------------------
    | Taxonomies
    |--------------------------------------------------------------------------
    */

    $category = null;
    $difficulty = null;

    $category_terms = wp_get_post_terms(
        $roadmap_id,
        'roadmap_category'
    );

    if (
        !is_wp_error($category_terms) &&
        !empty($category_terms)
    ) {
        $term = $category_terms[0];

        $category = [
            'id'   => (int) $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }

    $difficulty_terms = wp_get_post_terms(
        $roadmap_id,
        'roadmap_difficulty'
    );

    if (
        !is_wp_error($difficulty_terms) &&
        !empty($difficulty_terms)
    ) {
        $term = $difficulty_terms[0];

        $difficulty = [
            'id'   => (int) $term->term_id,
            'name' => $term->name,
            'slug' => $term->slug,
        ];
    }

    /*
    |--------------------------------------------------------------------------
    | Metadata
    |--------------------------------------------------------------------------
    */

    $short_description =
        $data['basic']['short_description'] ?? '';

    $duration =
        $data['classification']['duration'] ?? '';

    /*
    |--------------------------------------------------------------------------
    | Steps Count
    |--------------------------------------------------------------------------
    */

    $steps_count = is_array($data['steps'] ?? null)
        ? count($data['steps'])
        : 0;

    /*
    |--------------------------------------------------------------------------
    | Featured Image
    |--------------------------------------------------------------------------
    */

    $featured_image = get_the_post_thumbnail_url(
        $roadmap_id,
        'large'
    );

    /*
    |--------------------------------------------------------------------------
    | Summary
    |--------------------------------------------------------------------------
    */

    return [

        'id' => (int) $roadmap_id,

        'title' => get_the_title($roadmap_id),

        'slug' => $post->post_name,

        'category' => $category,

        'difficulty' => $difficulty,

        'duration' => $duration,

        'steps_count' => $steps_count,

        'featured_image' => $featured_image ?: null,

        'short_description' => $short_description,

    ];
}
