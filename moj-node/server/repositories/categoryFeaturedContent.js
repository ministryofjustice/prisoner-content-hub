const R = require('ramda');

const config = require('../config');
const { parseHubFeaturedContentResponse } = require('../utils/index');

function hubCategoryFeaturedContentRepository(httpClient) {
  async function hubContentFor(opts = { query: {} }) {
    const response = await httpClient.get(
      `${config.api.hubCategory}/featured`,
      opts.query,
    );

    if (!Array.isArray(response)) return [];

    return R.map(parseHubFeaturedContentResponse, response);
  }

  return {
    hubContentFor,
  };
}

module.exports = hubCategoryFeaturedContentRepository;
