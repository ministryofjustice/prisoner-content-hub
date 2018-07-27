/* eslint-env browser */

const navMenu = document.getElementById('nav-menu');

if (navMenu) {
  document.body.addEventListener('click', (event) => {
    // handle navigation hide
    if (matchesSelectorAll(event.target, '#nav-hide')) {
      event.preventDefault();
      navMenu.classList.remove('is-open');
      return false;
    }

    // handle navigation menu btn
    if (matchesSelectorAll(event.target, '#menu-btn')) {
      event.preventDefault();
      navMenu.classList.toggle('is-open');
      return false;
    }

    // if nav is open ignore clicks to the navigation
    if (matchesSelectorAll(event.target, '#nav-menu')) {
      return false;
    }

    // close navigation menu if body is clicked and nav is open
    if (navMenu.classList.contains('is-open')) {
      return navMenu.classList.remove('is-open');
    }

    return false;
  });
}


function matchesSelectorAll(target, selector) {
  return target.matches(selector) || target.matches(`${selector} *`);
}
