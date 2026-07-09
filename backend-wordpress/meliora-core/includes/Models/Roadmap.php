<?php

if (!defined('ABSPATH')) {
    exit;
}

class Roadmap
{
    const META_KEY = 'roadmap_data';

    private $post_id;

    public function __construct($post_id)
    {
        $this->post_id = $post_id;
    }

    /**
     * Get roadmap data
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

        return wp_parse_args(
            $saved,
            $this->defaults()
        );
    }

    /**
     * Save roadmap data
     */
    public function save($data)
    {
        update_post_meta(
            $this->post_id,
            self::META_KEY,
            $data
        );
    }

    /**
     * Default roadmap structure
     */
    private function defaults()
    {
        return [

            'basic' => [
                'short_description' => ''
            ],

            'classification' => [
                'estimated_hours' => ''
            ],

            'learning' => [
                'prerequisites' => '',
                'outcomes' => '',
                'skills' => ''
            ],

            'resources' => [
                'docs' => '',
                'roadmapsh' => '',
                'github' => '',
                'youtube' => '',
                'course' => ''
            ],

            'steps' => []

        ];
    }
}