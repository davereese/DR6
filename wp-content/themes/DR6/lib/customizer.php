<?php

namespace Roots\Sage\Customizer;

use Roots\Sage\Assets;

/**
 * Add postMessage support
 */
function customize_register($wp_customize) {
  $wp_customize->get_setting('blogname')->transport = 'postMessage';
}
add_action('customize_register', __NAMESPACE__ . '\\customize_register');

/**
 * Customizer JS
 */
function customize_preview_js() {
  wp_enqueue_script('sage/customizer', Assets\asset_path('scripts/customizer.js'), ['customize-preview'], null, true);
}
add_action('customize_preview_init', __NAMESPACE__ . '\\customize_preview_js');

function get_project($id) {
  $image_link = wp_get_attachment_image_src( get_post_thumbnail_id($event_id), 'full' );

  $proj = '<div class="grid-item">';
	$proj .= '<img src="' . $image_link[0] . '" class="img-responsive">';
  $proj .= '</div>';

  return $proj;
}
