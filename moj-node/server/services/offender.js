const {
  parseISO,
  formatDistance,
  format,
  isValid,
  isBefore,
  addDays,
  addMonths,
} = require('date-fns');
const { propOr, prop } = require('ramda');
const { capitalize } = require('../utils');

const prettyDate = date => {
  if (!isValid(new Date(date))) return 'Unavailable';
  return format(parseISO(date), 'EEEE dd MMMM yyyy');
};

const prettyTime = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), 'h:mmaaa');
};

const isoDate = date => {
  if (!isValid(new Date(date))) return '';
  return format(parseISO(date), 'yyyy-MM-dd');
};

const getTimetableTitle = date => {
  const givenDate = new Date(date);

  if (!isValid(givenDate)) return '';

  const today = new Date();
  const tomorrow = addDays(today, 1);
  const todayDateString = format(today, 'EEEE d MMMM');
  const tomorrowDateString = format(tomorrow, 'EEEE d MMMM');
  const givenDateString = format(givenDate, 'EEEE d MMMM');

  if (givenDateString === todayDateString) {
    return 'Today';
  }

  if (givenDateString === tomorrowDateString) {
    return 'Tomorrow';
  }

  return givenDateString;
};

const getTimetableEventTime = (startTime, endTime) => {
  if (startTime === '') {
    return '';
  }

  if (endTime !== '') {
    return `${startTime} - ${endTime}`;
  }

  return startTime;
};

const getTimeOfDay = date => {
  const dateObject = new Date(date);
  if (!isValid(dateObject)) return '';

  const dateString = isoDate(date);

  if (isBefore(dateObject, parseISO(`${dateString} 12:00:00`))) {
    return 'morning';
  }

  if (isBefore(dateObject, parseISO(`${dateString} 17:00:00`))) {
    return 'afternoon';
  }

  return 'evening';
};

module.exports = function createOffenderService(repository) {
  async function getOffenderDetailsFor(prisonerId) {
    const response = await repository.getOffenderDetailsFor(prisonerId);
    const { bookingId, offenderNo, firstName, lastName } = response;

    return {
      bookingId,
      offenderNo,
      name: `${capitalize(firstName)} ${capitalize(lastName)}`,
    };
  }

  async function getIEPSummaryFor(bookingId) {
    try {
      const iePSummary = await repository.getIEPSummaryFor(bookingId);
      const lastIepDate = parseISO(iePSummary.iepDate);
      const reviewDate = addMonths(lastIepDate, 3);

      return {
        reviewDate: format(reviewDate, 'EEEE d MMMM') || 'Unavailable',
        iepLevel: iePSummary.iepLevel,
        daysSinceReview: formatDistance(lastIepDate, new Date()),
      };
    } catch {
      return {
        error: 'We are not able to show your IEP summary at this time',
      };
    }
  }

  async function getBalancesFor(bookingId) {
    try {
      const balances = await repository.getBalancesFor(bookingId);
      const getOrDefault = propOr('Unavailable');

      return {
        spends: getOrDefault('spends', balances),
        cash: getOrDefault('cash', balances),
        savings: getOrDefault('savings', balances),
        currency: getOrDefault('currency', balances),
      };
    } catch {
      return {
        error: 'We are not able to show your balances at this time',
      };
    }
  }

  async function getKeyWorkerFor(prisonerId) {
    try {
      const { firstName, lastName } = await repository.getKeyWorkerFor(
        prisonerId,
      );

      return {
        current: `${capitalize(firstName)} ${capitalize(lastName)}`,
        lastMeeting: 'Unavailable',
      };
    } catch {
      return {
        error: 'We are not able to show Key Worker information at this time',
      };
    }
  }

  async function getVisitsFor(bookingId, startDate = new Date()) {
    try {
      const nextVisitData = await repository.getNextVisitFor(bookingId);
      const nextVisit = prettyDate(prop('startTime', nextVisitData));

      const visitsData = await repository.getVisitsFor(
        bookingId,
        format(startDate, 'yyyy-MM-dd'),
      );

      if (!Array.isArray(visitsData)) {
        throw new Error('Invalid data returned from API');
      }

      return {
        nextVisit,
        nextVisitDay:
          nextVisit !== 'Unavailable'
            ? format(parseISO(prop('startTime', nextVisitData)), 'EEEE')
            : 'Unavailable',
        nextVisitDate:
          nextVisit !== 'Unavailable'
            ? format(parseISO(prop('startTime', nextVisitData)), 'dd MMMM')
            : 'Unavailable',
        visitorName:
          nextVisit !== 'Unavailable'
            ? prop('leadVisitor', nextVisitData)
            : 'Unavailable',
        visitType:
          nextVisit !== 'Unavailable'
            ? prop('visitTypeDescription', nextVisitData).split(' ')[0]
            : 'Unavailable',
      };
    } catch {
      return {
        error: 'We are not able to show your visits at this time',
      };
    }
  }

  async function getImportantDatesFor(bookingId) {
    try {
      const sentenceDetails = await repository.sentenceDetailsFor(bookingId);

      return {
        reCategorisationDate: 'Unavailable',
        hdcEligibilityDate: prettyDate(
          prop('homeDetentionCurfewEligibilityDate', sentenceDetails),
        ),
        conditionalReleaseDate: prettyDate(
          prop('conditionalReleaseDate', sentenceDetails),
        ),
        licenceExpiryDate: prettyDate(
          prop('licenceExpiryDate', sentenceDetails),
        ),
      };
    } catch {
      return {
        error: 'We are not able to show your important dates at this time',
      };
    }
  }

  async function getActualHomeEvents(bookingId, time) {
    const hour = Number.parseInt(format(time, 'H'), 10);
    const tomorrowCutOffHour = 19;

    if (hour >= tomorrowCutOffHour) {
      const tomorrow = addDays(time, 1);
      const startDate = format(time, 'yyyy-MM-dd');
      const endDate = format(tomorrow, 'yyyy-MM-dd');

      return {
        events: await repository.getEventsFor(bookingId, startDate, endDate),
        isTomorrow: true,
      };
    }

    return {
      events: await repository.getEventsForToday(bookingId),
      isTomorrow: false,
    };
  }

  /*
   * Note this actually gets tomorrow's events if it's after 7pm as per this requirement:
   * https://trello.com/c/m5yt4sgm
   */
  async function getEventsForToday(bookingId, time = new Date()) {
    try {
      if (!bookingId) return [];

      const { events, isTomorrow } = await getActualHomeEvents(bookingId, time);

      return !Array.isArray(events)
        ? { todaysEvents: [], isTomorrow: false }
        : {
            todaysEvents: events
              .filter(
                event =>
                  event.eventType === 'APP' || event.eventType === 'VISIT',
              )
              .map(event => {
                const startTime = prettyTime(prop('startTime', event));
                const endTime = prettyTime(prop('endTime', event));

                return {
                  title: event.eventSourceDesc,
                  startTime,
                  endTime,
                  location: event.eventLocation,
                  timeString: startTime,
                };
              }),
            isTomorrow,
          };
    } catch {
      return {
        error: 'We are not able to show your schedule for today at this time',
      };
    }
  }

  const getInitialEvents = (startDate, endDate) => {
    let checkDateObj = new Date(startDate);
    let checkDateStr = format(checkDateObj, 'yyyy-MM-dd');
    const endDateObj = new Date(endDate);
    const endDateStr = format(endDateObj, 'yyyy-MM-dd');
    const todayObj = new Date();
    const events = {};

    while (checkDateStr !== endDateStr) {
      checkDateStr = format(checkDateObj, 'yyyy-MM-dd');

      const finished = isBefore(checkDateObj, todayObj);

      events[checkDateStr] = {
        morning: {
          finished,
          events: [],
        },
        afternoon: {
          finished,
          events: [],
        },
        evening: {
          finished,
          events: [],
        },
        title: getTimetableTitle(checkDateStr),
      };

      checkDateObj = addDays(checkDateObj, 1);
    }

    return events;
  };

  async function getEventsFor(bookingId, startDate, endDate) {
    try {
      const startDateObj = new Date(startDate);
      const endDateObj = new Date(endDate);

      if (!bookingId || !isValid(startDateObj) || !isValid(endDateObj)) {
        throw new Error('Invalid data supplied');
      }

      if (!isBefore(startDateObj, endDateObj)) {
        throw new Error('Start date is after end date');
      }

      const eventsData = await repository.getEventsFor(
        bookingId,
        startDate,
        endDate,
      );

      if (!Array.isArray(eventsData)) {
        throw new Error('Invalid data returned from API');
      }

      const events = getInitialEvents(startDate, endDate);

      eventsData.forEach(event => {
        const startTime = prettyTime(prop('startTime', event));
        const endTime = prettyTime(prop('endTime', event));
        const dateString = isoDate(prop('startTime', event));
        const timeOfDay = getTimeOfDay(prop('startTime', event));

        events[dateString][timeOfDay].events.push({
          description: event.eventSourceDesc,
          startTime,
          endTime,
          location: event.eventLocation,
          timeString: getTimetableEventTime(startTime, endTime),
          eventType: event.eventType,
          finished: event.eventStatus !== 'SCH',
          status: event.eventStatus,
          paid: event.paid,
        });

        if (event.eventStatus === 'SCH') {
          events[dateString][timeOfDay].finished = false;
        }
      });

      return setDayBlocks(events);
    } catch {
      return {
        error: `We are not able to show your schedule for the selected week at this time`,
      };
    }
  }

  function setDayBlocks(events) {
    /* eslint-disable no-param-reassign */
    const nowDateString = format(new Date(), 'yyyy-MM-dd');

    if (events[nowDateString]) {
      const nowString = format(new Date(), 'yyyy-MM-dd HH:mm');
      const currentTimeOfDay = getTimeOfDay(nowString);

      events[nowDateString].morning.finished = false;
      events[nowDateString].afternoon.finished = false;
      events[nowDateString].evening.finished = false;

      if (currentTimeOfDay === 'afternoon') {
        events[nowDateString].morning.finished = true;
      } else if (currentTimeOfDay === 'evening') {
        events[nowDateString].morning.finished = true;
        events[nowDateString].afternoon.finished = true;
      }
    }

    return events;
    /* eslint-enable no-param-reassign */
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitsFor,
    getImportantDatesFor,
    getEventsForToday,
    getEventsFor,
  };
};
