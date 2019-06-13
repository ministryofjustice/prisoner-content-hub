document.body.addEventListener('click', event => {
  if (matchesAll('[data-state]', event.target)) {
    var element = getAncestorElementBySelector('[data-state]', event.target);

    if (element) {
      element.setAttribute(
        'data-state',
        toggleShowing(element.getAttribute('data-state')),
      );

      setTimeout(function() {
        element.setAttribute(
          'data-state',
          toggleShowing(element.getAttribute('data-state')),
        );
      }, 5000);
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
