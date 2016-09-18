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
if ( $work_query->have_posts() ) { ?>
  <div class="grid">
    <div class="grid-sizer"></div>
	  <div class="gutter-sizer"></div>
    <?php while ( $work_query->have_posts() ) { $work_query->the_post();
      $title = str_replace('The ', '', $work_query->post->post_title);
      $letter = substr($title, 0, 1);
      echo '<div class="grid-item block-container">';
        echo '<div class="block-container__block">';
          echo '<div class="block-container__block-title">'.$letter.'</div>';
          echo '<div class="block-container__border"></div>';
          echo '</div>';
      echo '</div>';
    } ?>
    </div>
  <?php wp_reset_postdata();
}
