const R = require('ramda');

const { promotedContentResponseFrom } = require('../utils/adapters');
const config = require('../config');

function hubPromotedContentRepository(httpClient) {
  async function hubPromotedContent({ establishmentId } = {}) {
    const endpoint = `${config.api.hubContent}/promoted`;
    const query = {
      _prison: establishmentId,
      _menu: 'main',
    };

    const response = await httpClient.get(endpoint, query);

    if (R.prop('message', response) || response === null) return [];

    return promotedContentResponseFrom(response);
  }

  return {
    hubPromotedContent,
  };
}

module.exports = hubPromotedContentRepository;
