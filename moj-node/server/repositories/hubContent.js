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
  videoFrom,
  seriesIdFrom,
  episodeFrom,
  seasonFrom,
  standFirstFrom,
  nameFrom,
} = require('../selectors/hub');


module.exports = function hubContentRepository(httpClient) {
  async function contentFor(id) {
    const response = await httpClient.get(`${config.api.hubContent}/${id}`);

    return parseResponse(response);
  }

  async function termFor(id) {
    const response = await httpClient.get(`${config.api.hubTerm}/${id}`);

    return parseTermResponse(response);
  }

  async function seasonFor(id) {
    const response = await httpClient.get(`${config.api.series}/${id}`);

    return parseSeasonResponse(response);
  }

  function parseTermResponse(data) {
    if (data === null) return null;
    return {
      name: nameFrom(data),
    };
  }

  function parseResponse(data) {
    if (data === null) return null;

    const type = HUB_CONTENT_TYPES[contentTypeFrom(data)];

    switch (type) {
      case 'video':
      case 'radio':
        return parseMediaResponse(data);
      case 'page':
        return parseFlatPageContent(data);
      default:
        return null;
    }
  }

  function parseMediaResponse(data) {
    if (data === null) return null;

    const type = HUB_CONTENT_TYPES[contentTypeFrom(data)];

    return {
      id: idFrom(data),
      title: titleFrom(data),
      type,
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      media: type === 'radio' ? audioFrom(data) : videoFrom(data),
      duration: durationFrom(data),
      thumbnail: {
        alt: imageAltFrom(data),
        url: imageUrlFrom(data),
      },
      episode: episodeFrom(data),
      season: seasonFrom(data),
      seriesId: seriesIdFrom(data),
    };
  }

  function parseFlatPageContent(data) {
    if (data === null) return null;

    return {
      id: idFrom(data),
      title: titleFrom(data),
      type: HUB_CONTENT_TYPES[contentTypeFrom(data)],
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
      },
      standFirst: standFirstFrom(data),
    };
  }

  function parseSeasonResponse(data) {
    if (data === null) return null;

    const transform = R.map(key => parseMediaResponse(data[key]));

    const season = R.pipe(
      R.keys,
      transform,
    );

    return season(data);
  }

  return {
    contentFor,
    termFor,
    seasonFor,
  };
};
