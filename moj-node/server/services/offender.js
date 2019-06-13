const { parse, distanceInWords } = require('date-fns');

module.exports = function createOffenderService(repository) {
  async function getIEPSummaryFor(nomisId) {
    const { bookingId } = await repository.getOffenderDetailsFor(nomisId);
    const iePSummary = await repository.getIEPSummaryFor(bookingId);

    return {
      reviewDate: 'Unavailable',
      iepLevel: iePSummary.iepLevel,
      daysSinceReview: distanceInWords(parse(iePSummary.iepDate), new Date()),
    };
  }

  async function getBalancesFor(nomisId) {
    const { bookingId } = await repository.getOffenderDetailsFor(nomisId);
    const balances = await repository.getBalancesFor(bookingId);

    return balances;
  }

  async function getKeyWorkerFor(nomisId) {
    const keyWorker = await repository.getKeyWorkerFor(nomisId);

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

  return {
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
  };
};
