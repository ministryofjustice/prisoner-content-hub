const config = require('../config');

function validateOffenderNumberFor(offenderNo) {
  const pattern = new RegExp(/[A-Z][0-9]{4}[A-Z]{2}/i);
  return pattern.test(offenderNo);
}

function offenderRepository(httpClient) {
  function getOffenderDetailsFor(offenderNo) {
    if (validateOffenderNumberFor(offenderNo)) {
      return httpClient.get(
        `${config.nomis.api.bookings}/offenderNo/${offenderNo.toUpperCase()}`,
      );
    }
    throw new Error('Invalid offender number');
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

  function getVisitsFor(bookingId, startDate) {
    const endpoint = `${config.nomis.api.bookings}/${bookingId}/visits`;
    const query = [`fromDate=${startDate}`, `toDate=${startDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
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

  function getEventsFor(bookingId, startDate, endDate) {
    const endpoint = `${config.nomis.api.bookings}/${bookingId}/events`;
    const query = [`fromDate=${startDate}`, `toDate=${endDate}`];

    return httpClient.get(`${endpoint}?${query.join('&')}`);
  }

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
    getBalancesFor,
    getKeyWorkerFor,
    getNextVisitFor,
    getLastVisitFor,
    getVisitsFor,
    sentenceDetailsFor,
    getEventsForToday,
    getEventsFor,
  };
}

module.exports = offenderRepository;
