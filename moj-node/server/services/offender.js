const { parse, distanceInWords, format, isValid } = require('date-fns');
const { propOr, prop } = require('ramda');

const prettyDate = date => {
  if (!isValid(new Date(date))) return 'Unavailable';
  return format(parse(date), 'dddd DD MMMM YYYY');
};

const prettyTime = date => {
  if (!isValid(new Date(date))) return '';
  return format(parse(date), 'h:mma');
};

const capitalize = (str = '') => {
  return str
    .split('')
    .map((letter, index) => {
      if (index === 0) return letter.toUpperCase();
      return letter.toLowerCase();
    })
    .join('');
};

module.exports = function createOffenderService(repository) {
  async function getOffenderDetailsFor(prisonerId) {
    const {
      bookingId,
      offenderNo,
      firstName,
      lastName,
    } = await repository.getOffenderDetailsFor(prisonerId);

    return {
      bookingId,
      offenderNo,
      name: `${capitalize(firstName)} ${capitalize(lastName)}`,
    };
  }

  async function getIEPSummaryFor(bookingId) {
    const iePSummary = await repository.getIEPSummaryFor(bookingId);

    return {
      reviewDate: 'Unavailable',
      iepLevel: iePSummary.iepLevel,
      daysSinceReview: distanceInWords(parse(iePSummary.iepDate), new Date()),
    };
  }

  async function getBalancesFor(bookingId) {
    const balances = await repository.getBalancesFor(bookingId);
    const getOrDefault = propOr('Unavailable');

    return {
      spends: getOrDefault('spends', balances),
      cash: getOrDefault('cash', balances),
      savings: getOrDefault('savings', balances),
      currency: getOrDefault('currency', balances),
    };
  }

  async function getKeyWorkerFor(prisonerId) {
    const keyWorker = await repository.getKeyWorkerFor(prisonerId);

    if (!keyWorker) {
      return {
        current: 'Unavailable',
        lastMeeting: 'Unavailable',
      };
    }

    return {
      current: `${capitalize(keyWorker.firstName)} ${capitalize(
        keyWorker.lastName,
      )}`,
      lastMeeting: 'Unavailable',
    };
  }

  async function getVisitsFor(bookingId) {
    const lastVisit = await repository.getLastVisitFor(bookingId);
    const nextVisit = await repository.getNextVisitFor(bookingId);

    return {
      lastVisit: prettyDate(prop('startTime', lastVisit)),
      nextVisit: prettyDate(prop('startTime', nextVisit)),
    };
  }

  async function getImportantDatesFor(bookingId) {
    const sentenceDetails = await repository.sentenceDetailsFor(bookingId);

    return {
      reCategorisationDate: 'Unavailable',
      hdcEligibilityDate: prettyDate(
        prop('homeDetentionCurfewEligibilityDate', sentenceDetails),
      ),
      conditionalReleaseDate: prettyDate(
        prop('conditionalReleaseDate', sentenceDetails),
      ),
      licenceExpiryDate: prettyDate(prop('licenceExpiryDate', sentenceDetails)),
    };
  }

  async function getActivitiesForToday(bookingId) {
    const activities = await repository.getActivitiesForToday(bookingId);

    if (!Array.isArray(activities)) return [];

    return activities.map(activity => {
      const startTime = prettyTime(prop('startTime', activity));
      const endTime = prettyTime(prop('endTime', activity));

      return {
        title: activity.eventSourceDesc,
        startTime,
        endTime,
        timeString: endTime === '' ? startTime : `${startTime} to ${endTime}`,
      };
    });
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitsFor,
    getImportantDatesFor,
    getActivitiesForToday,
  };
};
