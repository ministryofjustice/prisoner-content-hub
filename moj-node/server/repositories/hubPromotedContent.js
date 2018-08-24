
const { parseHubContentResponse } = require('../utils/index');
const config = require('../config');

function hubPromotedContentRepository(httpClient) {
  async function hubPromotedContent(opts = { query: {} }) {
    const response = await httpClient.get(`${config.api.hubContent}/promoted`, opts.query);
    if (response.message) return null;
    return parseHubContentResponse(response);
  }

  return {
    hubPromotedContent,
  };
}

module.exports = hubPromotedContentRepository;
