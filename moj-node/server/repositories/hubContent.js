const R = require('ramda');

const config = require('../config');
const { HUB_CONTENT_TYPES } = require('../constants/hub');

const {
  idFrom,
  titleFrom,
  contentTypeFrom,
  descriptionValueFrom,
  descriptionProcessedFrom,
  summaryValueFrom,
  imageAltFrom,
  imageUrlFrom,
  durationFrom,
  audioFrom,
  seriesFrom,
  episodeFrom,
  seasonFrom,
} = require('../selectors/hub');


module.exports = function hubContentRepository(httpClient) {
  async function contentFor(id) {
    const response = await httpClient.get(`${config.api.hubContent}/${id}`);

    return parseResponse(response);
  }

  function parseResponse(data) {
    if (data === null) return null;

    const type = HUB_CONTENT_TYPES[contentTypeFrom(data)];

    switch (type) {
      case 'radio':
        return parseRadioResponse(data);
      default:
        return null;
    }
  }

  function parseRadioResponse(data) {
    const series = R.map(R.prop('target_id'));
    return {
      id: idFrom(data),
      title: titleFrom(data),
      type: HUB_CONTENT_TYPES[contentTypeFrom(data)],
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      media: audioFrom(data),
      duration: durationFrom(data),
      thumbnail: {
        alt: imageAltFrom(data),
        url: imageUrlFrom(data),
      },
      episode: episodeFrom(data),
      season: seasonFrom(data),
      series: series(seriesFrom(data)),
    };
  }

  return {
    contentFor,
  };
};
