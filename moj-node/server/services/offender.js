const {
  parseISO,
  formatDistance,
  format,
  isValid,
  isBefore,
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

const getTimeOfDay = date => {
  const dateObject = new Date(date);
  if (!isValid(dateObject)) return '';

  const todayDateString = format(dateObject, 'yyyy-MM-dd');

  if (isBefore(dateObject, parseISO(`${todayDateString} 12:00:00`))) {
    return 'morning';
  }

  if (isBefore(dateObject, parseISO(`${todayDateString} 17:00:00`))) {
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

  async function getEventsFor(bookingId, startDate, endDate) {
    try {
      const defaultEvents = {
        morning: [],
        afternoon: [],
        evening: [],
      };

      if (
        !bookingId ||
        !isValid(new Date(startDate)) ||
        !isValid(new Date(endDate))
      )
        return defaultEvents;

      const events = await repository.getEventsFor(
        bookingId,
        startDate,
        endDate,
      );

      if (!Array.isArray(events)) return defaultEvents;

      events.forEach(event => {
        const startTime = prettyTime(prop('startTime', event));
        const endTime = prettyTime(prop('endTime', event));

        defaultEvents[getTimeOfDay(event.startTime)].push({
          title: event.eventSourceDesc,
          startTime,
          endTime,
          location: event.eventLocation,
          timeString: startTime,
          eventType: event.eventType,
        });
      });

      return defaultEvents;
    } catch {
      return {
        error:
          'We are not able to show your schedule for the selected week at this time',
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
