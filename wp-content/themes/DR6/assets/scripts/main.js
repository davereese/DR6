/* ========================================================================
 * DOM-based Routing
 * Based on http://goo.gl/EUTi53 by Paul Irish
 *
 * Only fires on body classes that match. If a body class contains a dash,
 * replace the dash with an underscore when adding it to the object below.
 *
 * .noConflict()
 * The routing is enclosed within an anonymous function so that you can
 * always reference jQuery with $, even when in .noConflict() mode.
 * ======================================================================== */

(function($) {

  // Use this variable to set up the common and page specific functions. If you
  // rename this variable, you will also need to rename the namespace below.
  var Sage = {
    // All pages
    'common': {
      init: function() {
        // JavaScript to be fired on all pages
        let loader = document.querySelectorAll('.loader div');
        let degreesY = ['-65', '89', '90'];
        let degreesZ = ['50', '-60', '20'];
        let marginsOriginal = ['-190px', '-34px', '106px'];
        let marginsNew = ['-70px', '-33px', '-1px'];

        function loaderReset() {
          for(let i=0; i<loader.length; i++) {
            dynamics.animate(loader[i], {
              opacity: 0,
              scale: 4,
              rotateY: degreesY[i],
              rotateZ: degreesZ[i],
              marginLeft: marginsOriginal[i]
            }, {
              type: dynamics.linear,
              duration: 10
            });
          }
        }

        function fadeLoader() {
          dynamics.animate(loader, {
            opacity: 0,
          }, {
            type: dynamics.bezier,
            points: [{"x":0,"y":0,"cp":[{"x":0.757,"y":0.007}]},{"x":1,"y":1,"cp":[{"x":0.731,"y":0.988}]}],
            duration: 600
          });
        }

        function animateLoader() {
          for(let i=0; i<loader.length; i++) {
            dynamics.animate(loader[i], {
              opacity: 1,
              scale: 1,
              rotateY: 0,
              marginLeft: marginsNew[i]
            }, {
              type: dynamics.bezier,
              points: [{"x":0,"y":0,"cp":[{"x":0.1,"y":0}]},{"x":1,"y":1,"cp":[{"x":0.012,"y":0.997}]}],
              duration: 2200,
              delay: i * 50
            });
          }


          dynamics.setTimeout(loaderReset, 2900);
          dynamics.setTimeout(animateLoader, 3000);
          dynamics.setTimeout(fadeLoader, 5000);
        }
        animateLoader();
        dynamics.setTimeout(fadeLoader, 2000);
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
        $('.grid').isotope({
          // options
          layoutMode: 'packery',
          itemSelector: '.grid-item',
        });
      },
      finalize: function() {
        // JavaScript to be fired on the home page, after the init JS
      }
    },
    // About us page, note the change from about-us to about_us.
    'about_us': {
      init: function() {
        // JavaScript to be fired on the about us page
      }
    }
  };

  // The routing fires all common scripts, followed by the page specific scripts.
  // Add additional events for more control over timing e.g. a finalize event
  var UTIL = {
    fire: function(func, funcname, args) {
      var fire;
      var namespace = Sage;
      funcname = (funcname === undefined) ? 'init' : funcname;
      fire = func !== '';
      fire = fire && namespace[func];
      fire = fire && typeof namespace[func][funcname] === 'function';

      if (fire) {
        namespace[func][funcname](args);
      }
    },
    loadEvents: function() {
      // Fire common init JS
      UTIL.fire('common');

      // Fire page-specific init JS, and then finalize JS
      $.each(document.body.className.replace(/-/g, '_').split(/\s+/), function(i, classnm) {
        UTIL.fire(classnm);
        UTIL.fire(classnm, 'finalize');
      });

      // Fire common finalize JS
      UTIL.fire('common', 'finalize');
    }
  };

  // Load Events
  $(document).ready(UTIL.loadEvents);

})(jQuery); // Fully reference jQuery after this point.
