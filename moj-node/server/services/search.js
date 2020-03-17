const utils = require('../utils');

const createSearchService = ({
  searchRepository,
  getEstablishmentName = utils.getEstablishmentName,
}) => {
  function find({ query, limit, from, establishmentId }) {
    const prison = getEstablishmentName(establishmentId);

    if (query === '') {
      return [];
    }

    return searchRepository.find({ query, limit, from, prison });
  }

  function typeAhead({ query, limit, establishmentId }) {
    const prison = getEstablishmentName(establishmentId);

    if (query === '') {
      return [];
    }

    return searchRepository.typeAhead({ query, limit, prison });
  }

  return {
    find,
    typeAhead,
  };
};

module.exports = {
  createSearchService,
};
