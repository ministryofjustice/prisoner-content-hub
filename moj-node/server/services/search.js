module.exports = function createSearchService({ searchRepository }) {
  function find({ query, limit, from }) {
    return searchRepository.find({ query, limit, from });
  }

  function typeAhead({ query, limit }) {
    return searchRepository.typeAhead({ query, limit });
  }

  return {
    find,
    typeAhead,
  };
};
