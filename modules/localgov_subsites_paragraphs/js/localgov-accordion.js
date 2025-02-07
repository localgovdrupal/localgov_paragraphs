/**
 * @file
 * Localgov Accordion behaviour.
 */

((Drupal) => {
    Drupal.behaviors.localgovAccordion = {
      /**
       * Attach accordion behaviour.
       *
       * @param {object} context
       *   DOM object.
       */
      attach(context) {
        const accordions = context.querySelectorAll('.accordion');
  
        for (let i = 0; i < accordions.length; i++) {
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
        const accordionPanes = accordion.querySelectorAll('.accordion-pane');
        const numberOfPanes = accordionPanes.length;
        const displayShowHide = accordion.hasAttribute(
          'data-accordion-display-show-hide',
        );
        let showHideButton;
        let showHideButtonLabel;
  
        for (let i = 0; i < numberOfPanes; i++) {
          if (displayShowHide) {
            showHideButton = accordion.querySelector('.accordion-toggle-all');
            showHideButton.hidden = false;
            showHideButton.addEventListener('click', toggleAll);
            showHideButtonLabel =
              showHideButton.querySelector('.accordion-text');
          }
        }
  
        /**
         * Toggles all accordion panes open or closed.
         *
         * Used both as an event listener callback, and called directly.
         */
        function toggleAll() {
          const nextState =
            showHideButton.getAttribute('aria-expanded') !== 'true';
  
          showHideButtonLabel.textContent =
            showHideButton.dataset[nextState ? 'hideAll' : 'showAll'];
          showHideButton.setAttribute('aria-expanded', nextState);
  
          const tabopen = nextState ? 'details:not([open]) summary' : 'details[open] summary';
  
          for (let i = 0; i < numberOfPanes; i++) {
            const accordion = accordionPanes[i].querySelector(tabopen);
            accordion?.click();
          }
        }
      },
    };
  })(Drupal);
  