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
  //echo '<div class="grid">';
  echo '<div class="row block-hover">';
  while ( $work_query->have_posts() ) { $work_query->the_post();
    //echo Roots\Sage\Customizer\get_project($work_query->post->ID);
    $letter = substr($work_query->post->post_title, 0, 1);
    echo '<div class="col-sm-2 block-container">';
      echo '<div class="block-container__block">';
        echo '<div class="block-container__block-title">'.$letter.'</div>';
        echo '<div class="block-container__border"></div>';
        echo '</div>';
    echo '</div>';
  }
  echo '</div>';
  wp_reset_postdata();
}
