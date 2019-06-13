const config = require('../config');

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    return httpClient.get(
      `${config.nomis.api.bookings}/offenderNo/${offenderNo}`,
    );
  }

  function getIEPSummaryFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/iepSummary`,
    );
  }

  function getBalancesFor(bookingId) {
    return httpClient.get(`${config.nomis.api.bookings}/${bookingId}/balances`);
  }

  function getKeyWorkerFor(offenderNo) {
    return httpClient.get(
      `${config.nomis.api.bookings}/offenderNo/${offenderNo}/key-worker`,
    );
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
  };
}

module.exports = offenderRepository;
