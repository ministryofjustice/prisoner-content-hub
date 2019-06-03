const config = require('../config');

function NomisBookingsRepository(httpClient) {
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

  return {
    getOffenderDetailsFor,
    getIEPSummaryFor,
  };
}

module.exports = NomisBookingsRepository;
