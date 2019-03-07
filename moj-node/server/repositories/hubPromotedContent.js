const R = require('ramda');
const stripTags = require('striptags');

const { HUB_CONTENT_TYPES } = require('../constants/hub');
const { fixUrlForProduction } = require('../utils/index');
const config = require('../config');

function hubPromotedContentRepository(httpClient) {
  async function hubPromotedContent(opts = { query: {} }) {
    const response = await httpClient.get(
      `${config.api.hubContent}/promoted`,
      opts.query,
    );
    if (R.prop('message', response) || response === null) return [];

    return parseResponse(response);
  }

  function parseResponse(response) {
    if (!response) return {};
    const image = R.view(R.lensPath(['featured_image', 0]), response);
    const description = R.view(
      R.lensPath(['description', 0, 'processed']),
      response,
    );
    const summary = R.view(R.lensPath(['description', 0, 'summary']), response);

    const imageUrl = fixUrlForProduction(image.url, config.drupalAppUrl);
    const contentUrl =
      response.type === 'series' || response.type === 'tags'
        ? `/tags/${response.id}`
        : `/content/${response.id}`;

    return {
      id: response.id,
      title: response.title,
      contentType: HUB_CONTENT_TYPES[response.type],
      summary: stripTags(summary || description),
      image: {
        ...image,
        url: imageUrl,
      },
      contentUrl,
    };
  }

  return {
    hubPromotedContent,
  };
}

module.exports = hubPromotedContentRepository;
