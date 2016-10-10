<?php
/**
 * Template Name: Front Page
 */
?>

<div class="row">
  <div class="col-sm-12">
    <div class="intro intro--fadable">
      Hi, I'm <span contenteditable="true" class="interactive text-input name-input" data-target="input_2_1" tabindex="5">Dave Reese</span>, a <span contenteditable="true" class="interactive text-input position-input" data-target="input_2_2" tabindex="6">web developer</span> from <span contenteditable="true" class="interactive text-input location-input" data-target="input_2_3" tabindex="7">the great PNW</span>. I'm interested in
      <span tabindex="8" class="interactive select-input job-type-select" data-target="input_2_4">
        <span class="selection">creating</span>
        <span class="options">
          <span class="option">your work</span>
          <span class="option">website design &amp; dev</span>
          <span class="option">web app design &amp; dev</span>
          <span class="option">motion graphics</span>
          <span class="option custom">-- write your own --</span>
        </span>
      </span>. From
      <span tabindex="9" class="interactive select-input thing1-select" data-target="input_2_5">
        <span class="selection">web apps</span>
        <span class="options">
          <span class="option">web accessibility</span>
          <span class="option">wordpress</span>
          <span class="option">angularJS</span>
          <span class="option">mobile/responsive</span>
          <span class="option custom">-- write your own --</span>
        </span>
      </span>, to
      <span tabindex="10" class="interactive select-input thing2-select" data-target="input_2_6">
        <span class="selection">drawings</span>
        <span class="options">
          <span class="option">eCommerce</span>
          <span class="option">interactive storytelling</span>
          <span class="option">UI/UX design &amp; dev</span>
          <span class="option">brand development</span>
          <span class="option custom">-- write your own --</span>
        </span>
      </span>, to
      <span tabindex="11" class="interactive select-input thing3-select" data-target="input_2_7">
        <span class="selection">beer</span>
        <span class="options">
          <span class="option">staying active</span>
          <span class="option">elegant solutions</span>
          <span class="option">the cutting edge</span>
          <span class="option">other cool stuff</span>
          <span class="option custom">-- write your own --</span>
        </span>
      </span>
      - <span contenteditable="true" class="interactive text-input location-input" data-target="input_2_8" tabindex="12">making things</span> is what I am all about. Contact me at <span contenteditable="true" class="interactive text-input email-input" data-target="input_2_9" tabindex="13">dave.p.reese@gmail.com</span>.
      <?= do_shortcode( '[gravityform id="2" title="false" description="false" ajax="true" tabindex="34"]' ); ?>
    </div>
    <div class="intro-completed">
      <div class="intro-completed__complete"></div>
      <div class="intro-completed__loader">
        <div class="intro-completed__loader__loaded"></div>
      </div>
    </div>
  </div>
</div>

<?php
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
  <div class="row projects">
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
  </div>
  <?php wp_reset_postdata();
}
