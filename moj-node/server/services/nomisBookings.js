module.exports = function createNomisBookingsService(repository) {
  async function getIEPSummaryFor(nomisId) {
    const { bookingId } = await repository.getOffenderDetailsFor(nomisId);
    const iePSummary = await repository.getIEPSummaryFor(bookingId);

    return iePSummary;
  }

  return {
    getIEPSummaryFor,
  };
};
