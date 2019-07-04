module.exports = function createSearchService({ searchRepository }) {
  function find(query) {
    return searchRepository.find(query);
  }

  return {
    find,
  };
};
