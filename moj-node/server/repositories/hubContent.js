const R = require('ramda');

const config = require('../config');
const { HUB_CONTENT_TYPES } = require('../constants/hub');
const { parseHubContentResponse } = require('../utils/index');


const {
  idFrom,
  titleFrom,
  contentTypeFrom,
  descriptionValueFrom,
  descriptionProcessedFrom,
  termDescriptionValueFrom,
  termDescriptionProcessedFrom,
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
  landingFeaturedContentIdFrom,
  categoryIdFrom,
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

  async function featuredContentFor(id) {
    const response = await httpClient.get(`${config.api.hubContent}/${id}`);
    return parseHubContentResponse(response);
  }

  async function relatedContentFor({ id, perPage = 8, offset = 1 }) {
    const response = await httpClient.get(`${config.api.hubContent}/related`, {
      _category: id,
      _number: perPage,
      _offset: offset,
    });
    return parseHubContentResponse(response);
  }

  function parseTermResponse(data) {
    if (data === null) return null;
    return {
      name: nameFrom(data),
      description: {
        raw: termDescriptionValueFrom(data),
        sanitized: termDescriptionProcessedFrom(data),
      },
    };
  }

  function parseLandingResponse(data) {
    if (data === null) return null;

    return {
      id: idFrom(data),
      title: titleFrom(data),
      type: typeFrom(data),
      featuredContentId: landingFeaturedContentIdFrom(data),
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      categoryId: categoryIdFrom(data),
    };
  }

  function parseResponse(data) {
    if (data === null) return null;

    const type = typeFrom(data);

    switch (type) {
      case 'video':
      case 'radio':
        return parseMediaResponse(data);
      case 'page':
        return parseFlatPageContent(data);
      case 'landing-page':
        return parseLandingResponse(data);
      default:
        return null;
    }
  }

  function parseMediaResponse(data) {
    if (data === null) return null;

    const type = typeFrom(data);

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
      type: typeFrom(data),
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      standFirst: standFirstFrom(data),
      thumbnail: {
        alt: imageAltFrom(data),
        url: imageUrlFrom(data),
      },
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

  function typeFrom(data) {
    return HUB_CONTENT_TYPES[contentTypeFrom(data)];
  }

  return {
    contentFor,
    termFor,
    seasonFor,
    featuredContentFor,
    relatedContentFor,
  };
};
