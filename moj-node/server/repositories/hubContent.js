const R = require('ramda');

const config = require('../config');
const logger = require('../../log');
const {
<<<<<<< HEAD
  contentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  landingResponseFrom,
  flatPageContentFrom,
  typeFrom,
  pdfResponseFrom,
} = require('../utils/adapters');
=======
  parseHubContentResponse,
  parseMediaResponse,
  parseSeasonResponse,
  parseTermResponse,
  parseLandingResponse,
  parseFlatPageContent,
  typeFrom,
  parsePDFResponse,
} = require('../utils/index');
>>>>>>> WIP: Add support for next episodes

module.exports = function hubContentRepository(httpClient) {
  async function contentFor(id) {
    const endpoint = `${config.api.hubContent}/${id}`;
    if (!id) {
      logger.debug(`Requested ${endpoint} and got back`);
      return null;
    }
    const response = await httpClient.get(endpoint);

    return parseResponse(response);
  }

  async function termFor(id) {
    const response = await httpClient.get(`${config.api.hubTerm}/${id}`);
    return termResponseFrom(response);
  }

  async function menuFor(id) {
    const response = await httpClient.get(config.api.hubMenu, {
      _parent: id,
      _menu: 'main',
    });
    return parseMenuResponse(response);
  }

  async function seasonFor({ id, establishmentId, perPage = 40, offset = 0 }) {
    const response = await httpClient.get(`${config.api.series}/${id}`, {
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
    });

    return seasonResponseFrom(response);
  }

  async function nextEpisodesFor({
    id,
    establishmentId,
    perPage = 3,
    episodeId,
  }) {
    const response = await httpClient.get(`${config.api.series}/${id}/next`, {
      _number: perPage,
      _episode_id: episodeId,
      _prison: establishmentId,
    });

    return seasonResponseFrom(response);
  }

  async function nextEpisodesFor({
    id,
    establishmentId,
    perPage = 3,
    episodeId,
  }) {
    const response = await httpClient.get(`${config.api.series}/${id}/next`, {
      _number: perPage,
      _episode_id: episodeId,
      _prison: establishmentId,
    });

    return parseSeasonResponse(response);
  }

  async function featuredContentFor(id) {
    const response = await httpClient.get(`${config.api.hubContent}/${id}`);
    return contentResponseFrom(response);
  }

  async function relatedContentFor({
    id,
    establishmentId,
    perPage = 8,
    offset = 0,
    sortOrder = 'ASC',
  }) {
    const response = await httpClient.get(`${config.api.hubContent}/related`, {
      _category: id,
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
      _sort_order: sortOrder,
    });

    return contentResponseFrom(response);
  }

  function parseMenuResponse(data = []) {
    if (data === null) return [];

    return data.map(menuItem => ({
      linkText: R.prop('title', menuItem),
      href: `/content/${R.prop('id', menuItem)}`,
      id: R.prop('id', menuItem),
    }));
  }

  function parseResponse(data) {
    if (data === null) return null;

    const contentType = typeFrom(data.content_type);

    switch (contentType) {
      case 'video':
      case 'radio':
        return mediaResponseFrom(data);
      case 'page':
        return flatPageContentFrom(data);
      case 'landing-page':
        return landingResponseFrom(data);
      case 'pdf':
        return pdfResponseFrom(data);
      default:
        return null;
    }
  }

  return {
    contentFor,
    termFor,
    seasonFor,
    nextEpisodesFor,
    featuredContentFor,
    relatedContentFor,
    menuFor,
  };
};
