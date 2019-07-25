(function() {
  document.body.addEventListener('click', function(event) {
    if (matchesAll('[data-state]', event.target)) {
      var element = getAncestorElementBySelector('[data-state]', event.target);

      if (element) {
        var state = element.getAttribute('data-state');
        var stateToggle = function() {
          element.setAttribute('data-state', 'hidden');
        };
        element.setAttribute('data-state', toggleShowing(state));

        if (state == 'hidden') {
          clearTimeout(stateToggle);
        }
        setTimeout(stateToggle, 5000);
      }
    }
  });

  function toggleShowing(state) {
    if (state === 'hidden') {
      return 'showing';
    }

    return 'hidden';
  }

  function matchesAll(selector, element) {
    return element.matches(selector) || element.matches(selector + ' *');
  }

  function getAncestorElementBySelector(selector, element) {
    if (element.matches(selector)) {
      return element;
    }

    if (element.parentNode) {
      return getAncestorElementBySelector(selector, element.parentNode);
    }

    return null;
  }
})();
