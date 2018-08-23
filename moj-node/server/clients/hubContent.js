const request = require('superagent');
const R = require('ramda');

const { sanitizeTruncateText } = require('../utils/index');
const config = require('../config');

const contentTypes = {
  moj_radio_item: 'radio',
  moj_pdf_item: 'pdf',
  moj_video_item: 'video',
  page: 'page',
};

class HubContentClient {
  constructor(client = request) {
    this.client = client;
  }

  get(endpoint, query = {}) {
    return this.client
      .get(`${config.api.hubContent}${endpoint}`)
      .query({ _format: 'json' })
      .query({ _lang: 'en' })
      .query(query)
      .then(res => res.body)
      .catch(() => null);
  }
}

class HubFeaturedContentResponse {
  static parse(data) {
    const idFrom = R.view(R.lensPath(['nid', 0, 'value']));
    const titleFrom = R.view(R.lensPath(['title', 0, 'value']));
    const contentTypeFrom = R.view(R.lensPath(['type', 0, 'target_id']));
    const descriptionValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'value']));
    const descriptionProcessedFrom = R.view(R.lensPath(['field_moj_description', 0, 'processed']));
    const summaryValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'summary']));
    const imageAltFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'alt']));
    const imageUrlFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'url']));
    const durationFrom = R.view(R.lensPath(['field_moj_duration', 0, 'value']));

    if (!data) return {};

    return Object
      .keys(data)
      .map((key) => {
        const description = summaryValueFrom(data[key])
          ? { sanitized: summaryValueFrom(data[key]) }
          : {
            raw: descriptionValueFrom(data[key]),
            sanitized: sanitizeTruncateText(descriptionProcessedFrom(data[key])),
          };

        return ({
          id: idFrom(data[key]),
          title: titleFrom(data[key]),
          contentType: contentTypes[contentTypeFrom(data[key])],
          description,
          image: {
            alt: imageAltFrom(data[key]),
            url: imageUrlFrom(data[key]),
          },
          duration: durationFrom(data[key]),
        });
      });
  }
}

module.exports = {
  HubContentClient,
  HubFeaturedContentResponse,
};
