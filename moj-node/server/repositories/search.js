const { pathOr } = require('ramda');
const config = require('../config');
const { searchResultFrom } = require('../utils/adapters');

function searchRepository(httpClient) {
  async function find(query) {
    const response = await httpClient.get(config.elasticsearch.search, {
      q: query,
    });
    const results = pathOr([], ['body', 'hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  return {
    find,
  };
}

module.exports = searchRepository;
