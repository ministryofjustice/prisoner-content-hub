const R = require('ramda');
const config = require('../config');
const { featuredNewContentResponseFrom } = require('../utils/adapters');

function hubNewFeaturedContentRepository(httpClient) {
  async function contentFor({ establishmentId } = {}) {
    const endpoint = `${config.apiV2.hubContent}/featured`;
    const query = {
      _prison: establishmentId,
    };

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) return [];

    return R.map(featuredNewContentResponseFrom, response);
  }

  return {
    contentFor,
  };
}

module.exports = hubNewFeaturedContentRepository;
