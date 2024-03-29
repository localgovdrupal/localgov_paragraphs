/**
 * @file
 * Localgov Accordion behaviour.
 *
 * DO NOT EDIT THIS FILE.
 * Any changes need to be made in localgov-accordion.es6.js file and compiled into
 * this file.
 */

(function (Drupal) {
  Drupal.behaviors.localgovAccordion = {
    /**
     * Attach accordion behaviour.
     *
     * @param {object} context
     *   DOM object.
     */
    attach: function attach(context) {
      var accordions = context.querySelectorAll('.accordion');

      for (var i = 0; i < accordions.length; i++) {
        this.init(accordions[i], i);
      }
    },


    /**
     * Initialise accordion.
     *
     * @param {HTMLElement} accordion
     *   Accordion element.
     * @param {number} index
     *   Accordion element index.
     */
    init: function init(accordion, index) {
      var accordionPanes = accordion.querySelectorAll('.accordion-pane');
      var numberOfPanes = accordionPanes.length;
      var initClass = 'accordion--initialised';
      var openClass = 'accordion-pane__content--open';
      var breakpoint = accordion.dataset.accordionTabsSwitch || null;
      var mq = window.matchMedia('(max-width: \'' + breakpoint + '\')');

      var create = function create() {
        // Only initialise accordion if it hasn't already been done.
        if (accordion.classList.contains(initClass)) {
          return;
        }

        for (var i = 0; i < numberOfPanes; i++) {
          var pane = accordionPanes[i];
          var content = pane.querySelectorAll('.accordion-pane__content');
          var title = pane.querySelectorAll('.accordion-pane__title');
          var titleText = title[0].textContent;
          var button = document.createElement('button');
          var text = document.createTextNode(titleText);
          var id = 'accordion-content-' + index + '-' + i;

          // Add id attribute to all pane content elements.
          content[0].setAttribute('id', id);

          // Add show/hide button to each accordion title.
          button.appendChild(text);
          // Add an initially hidden icon which can be used if required to make accordions fit GDS standard
          button.innerHTML += "<span class='accordion-icon' aria-hidden='true'></span>";
          button.setAttribute('aria-expanded', 'false');
          button.setAttribute('aria-controls', id);

          // Add click event listener to the show/hide button.
          button.addEventListener('click', function (e) {
            var targetPaneId = e.target.getAttribute('aria-controls');
            var targetPane = accordion.querySelectorAll('#' + targetPaneId);
            var openPane = accordion.querySelectorAll('.' + openClass);

            // Check the current state of the button and the content it controls.
            if (e.target.getAttribute('aria-expanded') === 'false') {
              // Close currently open pane.
              if (openPane.length) {
                var openPaneId = openPane[0].getAttribute('id');
                var openPaneButton = accordion.querySelectorAll('[aria-controls="' + openPaneId + '"]');
                openPane[0].classList.remove(openClass);
                openPaneButton[0].setAttribute('aria-expanded', 'false');
              }

              // Show new pane.
              e.target.setAttribute('aria-expanded', 'true');
              targetPane[0].classList.add(openClass);
            } else {
              // If target pane is currently open, close it.
              e.target.setAttribute('aria-expanded', 'false');
              targetPane[0].classList.remove(openClass);
            }
          });

          // Add show/hide button to each accordion pane title element.
          title[0].children[0].innerHTML = '';
          title[0].children[0].appendChild(button);
        }

        // Add init class.
        accordion.classList.add(initClass);
      };

      var destroy = function destroy() {
        for (var i = 0; i < numberOfPanes; i++) {
          // Remove buttons from accordion pane titles.
          var button = accordion.querySelectorAll('.accordion-pane__title')[i].querySelectorAll('button');
          if (button.length > 0) {
            button[0].outerHTML = button[0].innerHTML;
          }

          // Remove id attributes from pane content elements.
          accordionPanes[i].querySelectorAll('.accordion-pane__content')[0].removeAttribute('id');

          // Remove open class from accordion pane's content elements.
          if (accordionPanes[i].querySelectorAll('.accordion-pane__content')[0].classList.contains(openClass)) {
            accordionPanes[i].querySelectorAll('.accordion-pane__content')[0].classList.remove(openClass);
          }
        }
        // Remove accordion init class.
        accordion.classList.remove(initClass);
      };

      var breakpointCheck = function breakpointCheck() {
        if (mq.matches || breakpoint === null) {
          create();
        } else {
          destroy();
        }
      };

      // Trigger create/destroy functions at different screen widths
      // based on the value of data-accordion-tabs-switch attribute.
      if (window.matchMedia) {
        mq.addListener(function () {
          breakpointCheck();
        });
        breakpointCheck();
      }
    }
  };
})(Drupal);
