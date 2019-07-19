const R = require('ramda');
const qs = require('querystring');

const logger = require('../../log');
const config = require('../config');

const { featuredContentResponseFrom } = require('../utils/adapters');

function hubCategoryFeaturedContentRepository(httpClient) {
  async function contentFor({ categoryId, establishmentId, number = 8 } = {}) {
    const endpoint = `${config.api.hubCategory}/featured`;
    const query = {
      _number: number,
      _category: categoryId,
      _prison: establishmentId,
    };

    if (!categoryId) {
      logger.error(`Requested ${endpoint}?${qs.stringify(query)}`);
      return [];
    }

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) {
      return [];
    }

    return R.map(featuredContentResponseFrom, response);
  }

  return {
    contentFor,
  };
}

module.exports = hubCategoryFeaturedContentRepository;
