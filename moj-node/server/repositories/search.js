const { pathOr } = require('ramda');
const esb = require('elastic-builder');
const config = require('../config');
const { searchResultFrom } = require('../utils/adapters');

function searchRepository(httpClient) {
  async function find({ query, from = 0, limit = 15, prison }) {
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must([
            esb
              .multiMatchQuery(
                ['title^10', 'category_name^5', 'series_name^5'],
                query,
              )
              .fuzziness('AUTO')
              .prefixLength(2)
              .operator('and'),
          ])
          .should([
            esb.termQuery('prison_name', prison),
            esb.boolQuery().mustNot([esb.existsQuery('prison_name')]),
          ])
          .minimumShouldMatch(1),
      )
      .size(limit)
      .from(from)
      .timeout('15ms')
      .toJSON();
    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['body', 'hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  async function typeAhead({ query, limit = 5, prison }) {
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must([
            esb
              .multiMatchQuery(
                ['title^10', 'category_name^5', 'series_name^5'],
                query,
              )
              .fuzziness('AUTO')
              .prefixLength(2)
              .operator('and'),
          ])
          .should([
            esb.termQuery('prison_name', prison),
            esb.boolQuery().mustNot([esb.existsQuery('prison_name')]),
          ])
          .minimumShouldMatch(1),
      )
      .size(limit)
      .timeout('15ms')
      .toJSON();

    const response = await httpClient.post(
      config.elasticsearch.search,
      JSON.stringify(esbRequest),
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
