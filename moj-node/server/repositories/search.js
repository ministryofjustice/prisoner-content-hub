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
          .must(
            esb
              .multiMatchQuery(
                [
                  'title^5',
                  'title.keyword^5',
                  'stand_first^4',
                  'stand_first.keyword^4',
                  'series_name^3',
                  'series_name.keyword^3',
                  'category_name^3',
                  'category_name.keyword^3',
                  'secondary_tag^3',
                  'secondary_tag.keyword^3',
                  'summary^1',
                  'summary.keyword^1',
                ],
                query,
              )
              .type('best_fields')
              .prefixLength(1)
              .fuzziness(3)
              .operator('and'),
          )
          .should([
            esb.termQuery('prison_name', prison),
            esb.boolQuery().mustNot([esb.existsQuery('prison_name')]),
          ])
          .minimumShouldMatch(1),
      )
      .size(limit)
      .from(from)
      .toJSON();
    const response = await httpClient.post(
      config.elasticsearch.search,
      esbRequest,
    );

    const results = pathOr([], ['hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  async function typeAhead({ query, limit = 5, prison }) {
    const esbRequest = esb
      .requestBodySearch()
      .query(
        esb
          .boolQuery()
          .must(
            esb
              .boolQuery()
              .should([
                esb
                  .multiMatchQuery(
                    [
                      'title^5',
                      'title.keyword^5',
                      'stand_first^4',
                      'stand_first.keyword^4',
                      'series_name^3',
                      'series_name.keyword^3',
                      'category_name^3',
                      'category_name.keyword^3',
                      'secondary_tag^3',
                      'secondary_tag.keyword^3',
                      'summary^1',
                      'summary.keyword^1',
                    ],
                    query,
                  )
                  .type('cross_fields')
                  .operator('and'),
                esb
                  .multiMatchQuery(
                    [
                      'title^5',
                      'title.keyword^5',
                      'stand_first^4',
                      'stand_first.keyword^4',
                      'series_name^3',
                      'series_name.keyword^3',
                      'category_name^3',
                      'category_name.keyword^3',
                      'secondary_tag^3',
                      'secondary_tag.keyword^3',
                      'summary^1',
                      'summary.keyword^1',
                    ],
                    query,
                  )
                  .type('best_fields')
                  .prefixLength(1)
                  .fuzziness(3)
                  .operator('and'),
              ])
              .minimumShouldMatch(1),
          )
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
      esbRequest,
    );

    const results = pathOr([], ['hits', 'hits'], response);
    return results.map(searchResultFrom);
  }

  return {
    find,
    typeAhead,
  };
}

module.exports = {
  searchRepository,
};
