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

/*----------------------------------------
 * Gravity Forms
 *---------------------------------------*/
add_filter( 'gform_confirmation_anchor_2', '__return_false' );

/*----------------------------------------
 * Email Obfuscation
 *---------------------------------------*/
 function wpcodex_hide_email_shortcode( $atts , $content = null ) {
 	if ( ! is_email( $content ) ) {
 		return;
 	}

 	return '<a href="mailto:' . antispambot( $content ) . '">' . antispambot( $content ) . '</a>';
 }
 add_shortcode( 'hide_email', __NAMESPACE__ . '\\wpcodex_hide_email_shortcode' );
