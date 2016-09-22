<?php
/**
 * Template Name: Front Page
 */

$args = array(
  'post_type' => 'post',
  'post-status' => 'publish',
  'posts_per_page' => -1
);

$colors = array('red', 'orange', 'yellow', 'green', 'blue', 'indego', 'violet', 'pink', 'brown', 'chartreuse', 'purple');
$used_colors = array();
$used_colors2 = array();

$work_query = new WP_Query( $args );
if ( $work_query->have_posts() ) { ?>
  <div class="col-md-10 col-md-offset-1">
    <div class="grid">
      <div class="grid-sizer"></div>
  	  <div class="gutter-sizer"></div>
      <?php while ( $work_query->have_posts() ) { $work_query->the_post();
        $title = $work_query->post->post_title;
        $letter = substr($title, 0, 1);
        $new_title = substr($title, 1);
        $date = explode('-', explode(' ',$work_query->post->post_date)[0]);
        $link = get_field('link');
        $github = get_field('github');

        if ( $link ) {
          $link = '<a class="fa fa-globe" href="'.$link.'" target="_blank"></a>';
        }

        if ( $github ) {
          $github = '<a class="fa fa-github" href="'.$github.'" target="_blank"></a>';
        }

        if ( 1 <= count($colors)) {
          $color = $colors[array_rand($colors, 1)];
          $colors = array_diff($colors, array($color));
          array_push($used_colors, $color);
        } else {
          $color = $used_colors[array_rand($used_colors, 1)];
          $used_colors = array_diff($used_colors, array($color));
          array_push($used_colors2, $used_colors);
        }

        echo '<div class="grid-item grid-item--closed block-container">';
          echo '<div class="block-container__block '.$color.'">';
            echo '<div class="block-container__block-content">';
              echo '<div class="block-container__title"><span>'.$letter.'</span><span>'.$new_title.'</span></div>';
              echo '<div class="block-container__copy">'.$work_query->post->post_content.'</div>';
              echo '<div class="block-container__meta">'.$link.''.$github.'</div>';
              echo '<div class="block-container__date">'.$date[1].'-'.$date[0].'</div>';
            echo '</div>';
            echo '<div class="block-container__border"></div>';
            echo '</div>';
        echo '</div>';
      } ?>
    </div>
  </div>
  <?php wp_reset_postdata();
}
