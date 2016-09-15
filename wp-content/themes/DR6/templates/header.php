<header class="banner">
  <div class="container-full">
    <h1 class="banner__header"><a class="brand" href="<?= esc_url(home_url('/')); ?>">dpr</a></h1>
    <nav class="nav-primary">
      <?php
      if (has_nav_menu('primary_navigation')) :
        wp_nav_menu(['theme_location' => 'primary_navigation', 'menu_class' => 'nav']);
      endif;
      ?>
    </nav>
  </div>
</header>
