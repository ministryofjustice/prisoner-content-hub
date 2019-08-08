const { format } = require('date-fns');
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

  function getNextVisitFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/visits/next`,
    );
  }

  function getLastVisitFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/visits/last`,
    );
  }

  function getRemainingVisitsFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/visits?fromDate=${format(
        new Date(),
        'YYYY-MM-DD',
      )}`,
    );
  }

  function sentenceDetailsFor(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/sentenceDetail`,
    );
  }

  function getEventsForToday(bookingId) {
    return httpClient.get(
      `${config.nomis.api.bookings}/${bookingId}/events/today`,
    );
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getLastVisitFor,
    getRemainingVisitsFor,
    sentenceDetailsFor,
    getEventsForToday,
  };
}

module.exports = offenderRepository;
