function sendEvent(data) {
  $.ajax({
    type: "POST",
    url: '/analytics/event',
    data: data
  });
}

function sendPageTrack(data) {
  $.ajax({
    type: "POST",
    url: '/analytics/page',
    data: data
  });
}

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

    if (event.target.matches('#go-back')) {
      event.preventDefault();
      window.history.go(-1);
    }

    if (event.target.matches('#go-forwards')) {
      event.preventDefault();
      window.history.go(1);
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

function showHiddenBlock(block) {
  const button = document.getElementById('show-' + block);
  const hiddenData = document.getElementById(block);

  button.style.display = 'none';
  hiddenData.style.display = 'block';

  window.setTimeout(function() {
    button.style.display = 'block';
    hiddenData.style.display = 'none';
  }, 3000);
}
