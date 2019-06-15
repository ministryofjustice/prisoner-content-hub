const { parse, distanceInWords, format, isValid } = require('date-fns');
const { propOr, prop } = require('ramda');

const prettyDate = date => {
  if (!isValid(new Date(date))) return 'Unavailable';
  return format(parse(date), 'dddd, MMMM YYYY');
};

module.exports = function createOffenderService(repository) {
  function getOffenderDetailsFor(prisonerId) {
    return repository.getOffenderDetailsFor(prisonerId);
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
      current: `${keyWorker.firstName} ${keyWorker.lastName}`,
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
      licenceExpiresDate: prettyDate(
        prop('licenceExpiryDate', sentenceDetails),
      ),
    };
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getVisitsFor,
    getImportantDatesFor,
  };
};
