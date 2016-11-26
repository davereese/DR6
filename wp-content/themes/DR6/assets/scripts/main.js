/* ========================================================================
 * Public functions
 * ======================================================================== */

 /*
  * -------------------------------------------
  * 3D isotope element rotation helper functions
  * -------------------------------------------
  */
function map_range(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

function get_center(obj, type) {
  let offset = obj.offset();
  let width = obj.width();
  let height = obj.height();
  let centerX = offset.left + width / 2;
  let centerY = offset.top + height / 2;
  if ('X' === type) {
    return centerX;
  } else {
    return centerY;
  }
}

let animateFn = function(event) {
  if ( jQuery('.grid').css('margin-bottom') === '30px' ) {
    let x = event.pageX;
    let y = event.pageY;
    let WIDTH = document.body.clientWidth;

    jQuery('.block-container__block').each(function( index ) {
      let centerX = get_center(jQuery(this), 'X');
      let centerY = get_center(jQuery(this), 'Y');
      let calcY = Math.round(map_range(x, centerX, WIDTH, 0, 60));
      let calcX = Math.round(map_range(y, 0, centerY, 60, 0));

      if ( jQuery(this).parent().hasClass('grid-item--open') ) {
        calcX = 0;
        calcY = 0;
      } else {
        if ( calcX < -23 ) {
          calcX = -23;
        } else if ( calcX > 23 ) {
          calcX = 23;
        }

        if ( calcY > 26 ) {
          calcY = 26;
        } else if ( calcY < -25 ) {
          calcY = -25;
        }
      }

      jQuery.Velocity.hook(jQuery(this), "rotateX", calcX + "deg");
      jQuery.Velocity.hook(jQuery(this), "rotateY", calcY + "deg");
    });
  }
};

/*
 * -------------------------------------------
 * natural language actions
 * -------------------------------------------
 */
function dirty() {
  if ( !jQuery('.intro').hasClass('dirty') ) {
    jQuery('.intro').addClass('dirty');
  }
}

function swapOption(selectedOption) {
  let parent = selectedOption.parent().parent();
  let newType = selectedOption.text();
  let tabIndex = selectedOption.parent().parent().attr('tabindex');

  parent.removeClass('validation-error');
  parent.tooltip('destroy');

  if ( selectedOption.hasClass('custom') ) {
    parent.find('.selection').attr('contenteditable', 'true').attr('tabindex', tabIndex).focus().text('');
  } else {
    parent.find('.option').removeClass('selected');
    selectedOption.addClass('selected');
    parent.find('.selection').text(newType).attr('contenteditable', 'false');
    dirty();
  }
  selectedOption.parent().parent().blur();
}

function clearField(selectedField) {
  let target = selectedField.attr('data-target');

  if ( !selectedField.hasClass('dirty') ) {
    selectedField.addClass('dirty');
    setTimeout(function(){
      selectedField.text('');
    }, 100);
    jQuery('#'+target).attr('value', '' );
  }
}

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
      },
      finalize: function() {
        // JavaScript to be fired on all pages, after page specific JS is fired
      }
    },
    // Home page
    'home': {
      init: function() {
        // JavaScript to be fired on the home page
        $grid = $('.grid').isotope({
          itemSelector: '.grid-item',
          percentPosition: true,
          //filter: filters,
          layoutMode: 'packery',
          packery: {
            columnWidth: '.grid-sizer'
          }
        });

        $('.grid-item').on('click', function(e) {
          $(this).toggleClass('grid-item--open');
          $(this).toggleClass('grid-item--closed');
          setTimeout(function(){
            $grid.isotope('layout');
          }, 10);
          setTimeout(function(){
            requestAnimationFrame(function() {
              animateFn(e);
            });
          }, 400);
        });

        /*
         * -------------------------------------------
         * 3D isotope element rotation
         * -------------------------------------------
         */
        onmousemove = function(event) {
          requestAnimationFrame(function() {
            animateFn(event);
          });
        };

        /*
         * -------------------------------------------
         * Natural language fields
         * -------------------------------------------
         */
        $('.interactive .selection').on('click', function() {
          $(this).focus();
        }).on('blur', function() {
          $(this).attr('contenteditable', 'false').removeAttr('tabindex');
        });

        $('.interactive .option').on('click', function() {
          swapOption($(this));
        });

        $('.interactive.text-input').focus(function() {
          clearField($(this));
        });

        /*
         * -------------------------------------------
         * Hook up natural form values to a gravity form
         * -------------------------------------------
         */
        // Enter selected value into gravity forms by default
        $('.intro .interactive').each(function() {
          let target = $(this).attr('data-target');

          if ( $(this).hasClass('text-input') ) {
            $('#'+target).attr('value', $(this).text() );

            $(this).keyup(function(e) {
              let charCode = e.which || e.keyCode;

              if ( charCode !== 9 ) {
                $('#'+target).attr('value', $(this).text() );
                dirty();
                $(this).removeClass('validation-error');
                $(this).tooltip('destroy');
              }
            });
          } else if ( $(this).hasClass('select-input') ) {
            $('#'+target).attr('value', $(this).find('.selection').text());

            $(this).keyup(function() {
              $('#'+target).attr('value', $(this).find('.selection').text());
              dirty();
            });
          }
        });

        // prevent enter key from adding line breaks
        $('.intro .interactive').keypress(function(e){ return e.which !== 13; });

        $('.intro .interactive .option').click(function() {
          let target = $(this).parents('.interactive').attr('data-target');
          $('#'+target).attr('value', $(this).parents('.interactive').find('.selection').text());
        });

        // On natural language form submit with errors
        $(document).bind('gform_post_render', function(event){
          if ( $('.gform_wrapper').hasClass('gform_validation_error') ) {
            $('.intro .interactive.validation-error').each(function() {
              $(this).removeClass('validation-error');
            });

            $('.gform_fields .gfield_error').each(function() {
              let target = $(this).find('input').attr('id');
              let errorMessage = $(this).find('.validation_message').text();

              $('.intro .interactive[data-target="'+target+'"]').addClass('validation-error').tooltip({
                placement: 'top',
                title: errorMessage
              });
              $('.intro .interactive[data-target="'+target+'"]').tooltip('show');
            });

            $('.intro .interactive').each(function() {
              if ( !$(this).hasClass('validation-error') ) {
                $(this).tooltip('destroy');
              }
            });
          }
        });

        // On natural language form submit
        $(document).bind("gform_confirmation_loaded", function(event) {
          $('.intro .interactive').each(function() {
            $(this).tooltip('destroy');
          });

          $('.intro').addClass('intro--faded');
          $('.intro-completed').addClass('intro-completed--now');
          setTimeout(function() {
            $('.intro-completed__loader').addClass('intro-completed__loader--now');
          }, 10);
          setTimeout(function() {
            $('.intro-completed .intro-completed__complete').append('<svg xmlns:x="http://ns.adobe.com/Extensibility/1.0/" xmlns:i="http://ns.adobe.com/AdobeIllustrator/10.0/" xmlns:graph="http://ns.adobe.com/Graphs/1.0/" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 283.46 283.46" enable-background="new 0 0 283.46 283.46" xml:space="preserve"><switch><foreignObject requiredExtensions="http://ns.adobe.com/AdobeIllustrator/10.0/" x="0" y="0" width="1" height="1"/><g i:extraneous="self"><g><path fill="#34b236" d="M141.735-0.002C63.584-0.002-0.002,63.584-0.002,141.735s63.586,141.727,141.737,141.727     s141.727-63.575,141.727-141.727S219.887-0.002,141.735-0.002z M141.735,262.573c-66.636,0-120.848-54.213-120.848-120.838     C20.888,75.1,75.1,20.888,141.735,20.888c66.625,0,120.838,54.212,120.838,120.848     C262.573,208.36,208.36,262.573,141.735,262.573z"/><path fill="#34b236" d="M195.417,89.686l-68.318,81.517l-39.341-43.114c-3.887-4.273-10.496-4.58-14.76-0.673     c-4.264,3.886-4.559,10.485-0.673,14.749l47.389,51.938c1.979,2.172,4.783,3.406,7.711,3.406c0.071,0,0.153,0,0.225,0     c3.009-0.062,5.845-1.428,7.782-3.733l75.999-90.666c3.702-4.427,3.121-11.006-1.295-14.719     C205.709,84.677,199.13,85.289,195.417,89.686z"/></g></g></switch></svg> Got it &mdash; Looks good! We\'ll be in touch.').addClass('intro-completed__complete--on');
            $('.intro-completed__loader').addClass('intro-completed__loader--remove');
          }, 1600);
          setTimeout(function() {
            $('.intro').addClass('intro--done');
            $('.intro-completed').addClass('intro-completed--done');
            $('footer').addClass('footer--on');
          }, 3000);
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
