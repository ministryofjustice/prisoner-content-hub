/* eslint-env browser */

const navMenu = document.getElementById('nav-menu');
const todaysDate = document.querySelector('[data-target-id="todays-date"]');
const todaysTime = document.querySelector('[data-target-id="todays-time"]');
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

// Navigation menu
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

// update the time
if(todaysTime) {
  setInterval(() => {
    const date = new Date();
    const currentTime = todaysTime.textContent.trim();
    const minutes = date.getMinutes();
    const hours = date.getHours();
    const nextTime =  formateTime(hours) + ":" + formateTime(minutes);
    if (currentTime !== nextTime) {
      todaysTime.textContent = nextTime;
    }
  }, 1000);
}

// update the date
if(todaysDate) {
  setInterval(() => {
    const date = new Date();
    const currentDate = todaysDate.textContent.trim();
    const nextDate = days[date.getDay()] + " " + date.getDate() + " " + months[date.getMonth()];
    if (currentDate !== nextDate) {
      todaysDate.textContent = nextDate
    }
  }, 1000);
}


function matchesSelectorAll(target, selector) {
  return target.matches(selector) || target.matches(`${selector} *`);
}

function formateTime(time) {
  return (time < 10) ? "0" + time : time
}
