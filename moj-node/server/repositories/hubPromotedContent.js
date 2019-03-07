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
    const image = response.featured_image[0];
    const imageUrl = fixUrlForProduction(image.url, config.drupalAppUrl);
    const contentUrl =
      response.type === 'series' || response.type === 'tags'
        ? `/tags/${response.id}`
        : `/content/${response.id}`;

    return {
      id: response.id,
      title: response.title,
      contentType: HUB_CONTENT_TYPES[response.type],
      summary: stripTags(response.description[0].processed),
      image: {
        ...response.featured_image[0],
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
