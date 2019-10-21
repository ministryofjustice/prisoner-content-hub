const R = require('ramda');
const config = require('../config');
const { featuredContentTileResponseFrom } = require('../utils/adapters');

function hubFeaturedContentRepository(httpClient) {
  async function contentFor({ establishmentId } = {}) {
    const endpoint = `${config.apiV2.hubContent}/featured`;
    const query = {
      _prison: establishmentId,
    };

    const response = await httpClient.get(endpoint, { query });

    if (!Array.isArray(response)) return [];

    return R.map(featuredContentTileResponseFrom, response);
  }

  return {
    contentFor,
  };
}

module.exports = hubFeaturedContentRepository;
