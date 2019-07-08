const { pathOr } = require('ramda');
const esb = require('elastic-builder');
const config = require('../config');
const { searchResultFrom } = require('../utils/adapters');

function searchRepository(httpClient) {
  async function find({ query, from = 0, limit = 10 }) {
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .multiMatchQuery(
            ['title^10', 'category_name^5', 'series_name^5', 'summary'],
            query,
          )
          .fuzziness('AUTO')
          .prefixLength(2)
          .operator('and'),
      )
      .from(from)
      .size(limit)
      .toJSON();
    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['body', 'hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  async function typeAhead({ query, limit = 5 }) {
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .multiMatchQuery(
            ['title^10', 'category_name^5', 'series_name^5'],
            query,
          )
          .fuzziness(2)
          .prefixLength(2)
          .operator('and'),
      )
      .size(limit)
      .timeout('15ms')
      .toJSON();
    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['body', 'hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  return {
    find,
    typeAhead,
  };
}

module.exports = searchRepository;
