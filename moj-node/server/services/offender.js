const {
  parseISO,
  formatDistance,
  format,
  isValid,
  isBefore,
  addDays,
  isEqual,
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

      return {
        reviewDate: 'Unavailable',
        iepLevel: iePSummary.iepLevel,
        daysSinceReview: formatDistance(
          parseISO(iePSummary.iepDate),
          new Date(),
        ),
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

  async function getVisitsFor(bookingId) {
    try {
      const lastVisit = await repository.getLastVisitFor(bookingId);
      const nextVisit = await repository.getNextVisitFor(bookingId);

      return {
        lastVisit: prettyDate(prop('startTime', lastVisit)),
        nextVisit: prettyDate(prop('startTime', nextVisit)),
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

  async function getEventsForToday(bookingId) {
    try {
      if (!bookingId) return [];

      const events = await repository.getEventsForToday(bookingId);

      return !Array.isArray(events)
        ? []
        : events
            .filter(
              event => event.eventType === 'APP' || event.eventType === 'VISIT',
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
            });
    } catch {
      return {
        error: 'We are not able to show your schedule for today at this time',
      };
    }
  }

  const getInitialEvents = (startDate, endDate) => {
    let checkDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const events = {};

    while (!isEqual(checkDateObj, endDateObj)) {
      const checkDateStr = format(checkDateObj, 'yyyy-MM-dd');

      events[checkDateStr] = {
        morning: [],
        afternoon: [],
        evening: [],
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

        events[dateString][timeOfDay].push({
          description: event.eventSourceDesc,
          startTime,
          endTime,
          location: event.eventLocation,
          timeString: getTimetableEventTime(startTime, endTime),
          eventType: event.eventType,
        });
      });

      return events;
    } catch {
      return {
        error: `We are not able to show your schedule for the selected week at this time`,
      };
    }
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
