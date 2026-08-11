<?php

if (!defined('ABSPATH')) {
    exit;
}

class Roadmap
{
    const META_KEY = 'roadmap_data';

    /**
     * Roadmap post ID.
     *
     * @var int
     */
    private $post_id;

    /**
     * Constructor.
     */
    public function __construct($post_id)
    {
        $this->post_id = absint($post_id);
    }

    /**
     * Return roadmap data.
     */
    public function get()
    {
        $saved = get_post_meta(
            $this->post_id,
            self::META_KEY,
            true
        );

        if (!is_array($saved)) {
            $saved = [];
        }

        $data = wp_parse_args(
            $saved,
            $this->defaults()
        );

        /*
        |--------------------------------------------------------------------------
        | Compatibility Migration
        |--------------------------------------------------------------------------
        */

        if (
            !isset($data['classification']) ||
            !is_array($data['classification'])
        ) {
            $data['classification'] = [];
        }

        if (!isset($data['classification']['duration'])) {

            if (!empty($data['classification']['estimated_hours'])) {
                $data['classification']['duration']
                    = $data['classification']['estimated_hours'];
            } else {
                $data['classification']['duration'] = '';
            }
        }

        return $data;
    }

    /**
     * Save roadmap data.
     */
    public function save(array $data)
    {
        $defaults = $this->defaults();

        $data = wp_parse_args(
            $data,
            $defaults
        );

        /*
        |--------------------------------------------------------------------------
        | Basic
        |--------------------------------------------------------------------------
        */

       $data['basic']['short_description']
    = wp_kses_post(
        $data['basic']['short_description']
    );

        /*
        |--------------------------------------------------------------------------
        | Classification
        |--------------------------------------------------------------------------
        */

        $data['classification']['duration']
            = sanitize_text_field(
                $data['classification']['duration']
            );

        /*
        |--------------------------------------------------------------------------
        | Learning
        |--------------------------------------------------------------------------
        */

        $data['learning']['prerequisites']
    = wp_kses_post(
        $data['learning']['prerequisites']
    );

$data['learning']['outcomes']
    = wp_kses_post(
        $data['learning']['outcomes']
    );

        $data['learning']['skills']
            = sanitize_textarea_field(
                $data['learning']['skills']
            );

        /*
        |--------------------------------------------------------------------------
        | Resources
        |--------------------------------------------------------------------------
        */

        foreach ($data['resources'] as $key => $value) {
            $data['resources'][$key] = esc_url_raw($value);
        }

        if (
    isset($data['steps']) &&
    is_array($data['steps'])
) {
    foreach ($data['steps'] as $index => $step) {

        if (!is_array($step)) {
            continue;
        }

        $data['steps'][$index]['description'] =
            wp_kses_post(
                $step['description'] ?? ''
            );
    }
}

        update_post_meta(
            $this->post_id,
            self::META_KEY,
            $data
        );

        return true;
    }

    /**
     * Return only the duration.
     */
    public function get_duration()
    {
        $data = $this->get();

        return $data['classification']['duration'] ?? '';
    }

    /**
     * Return short description.
     */
    public function get_short_description()
    {
        $data = $this->get();

        return $data['basic']['short_description'] ?? '';
    }

    /**
     * Return all learning data.
     */
    public function get_learning()
    {
        $data = $this->get();

        return $data['learning'] ?? [];
    }

    /**
     * Return resources.
     */
    public function get_resources()
    {
        $data = $this->get();

        return $data['resources'] ?? [];
    }

    /**
     * Return roadmap steps.
     */
    public function get_steps()
    {
        $data = $this->get();

        return $data['steps'] ?? [];
    }

    /**
     * Default roadmap structure.
     */
    private function defaults()
    {
        return [

            'basic' => [

                'short_description' => ''

            ],

            'classification' => [

                'duration' => ''

            ],

            'learning' => [

                'prerequisites' => '',
                'outcomes' => '',
                'skills' => ''

            ],

            'resources' => [

                'docs'      => '',
                'roadmapsh' => '',
                'github'    => '',
                'youtube'   => '',
                'course'    => ''

            ],

            'steps' => []

        ];
    }
}
