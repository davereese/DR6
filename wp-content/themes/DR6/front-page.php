<?php
/**
 * Template Name: Front Page
 */

$args = array(
  'post_type' => 'post',
  'post-status' => 'publish',
  'posts_per_page' => -1
);

$work_query = new WP_Query( $args );
if ( $work_query->have_posts() ) {
  echo '<div class="grid">';
  while ( $work_query->have_posts() ) { $work_query->the_post();
    echo Roots\Sage\Customizer\get_project($work_query->post->ID);
  }
  echo '</div>';
  wp_reset_postdata();
}
