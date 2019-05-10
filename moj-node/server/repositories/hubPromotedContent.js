const R = require('ramda');

const { featuredContentResponseFrom } = require('../utils/index');
const config = require('../config');

function hubPromotedContentRepository(httpClient) {
  async function hubPromotedContent(opts = { query: {} }) {
    const response = await httpClient.get(
      `${config.api.hubContent}/promoted`,
      opts.query,
    );
    if (R.prop('message', response) || response === null) return [];

    return featuredContentResponseFrom(response);
  }

  return {
    hubPromotedContent,
  };
}

module.exports = hubPromotedContentRepository;
