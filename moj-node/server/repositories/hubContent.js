const R = require('ramda');
const qs = require('querystring');

const config = require('../config');
const logger = require('../../log');
const {
  contentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  landingResponseFrom,
  flatPageContentFrom,
  typeFrom,
  pdfResponseFrom,
} = require('../utils/adapters');

module.exports = function hubContentRepository(httpClient) {
  async function contentFor(id) {
    const endpoint = `${config.api.hubContent}/${id}`;

    if (!id) {
      logger.debug(`Requested ${endpoint}`);
      return null;
    }

    const response = await httpClient.get(endpoint);

    return parseResponse(response);
  }

  async function termFor(id) {
    const endpoint = `${config.api.hubTerm}/${id}`;

    if (!id) {
      logger.error(`Requested ${endpoint}`);
      return null;
    }

    const response = await httpClient.get(endpoint);

    return termResponseFrom(response);
  }

  async function menuFor(id) {
    const endpoint = config.api.hubMenu;
    const query = {
      _parent: id,
      _menu: 'main',
    };

    if (!id) {
      logger.error(`Requested ${endpoint}?${qs.stringify(query)}`);
      return null;
    }

    const response = await httpClient.get(endpoint, query);
    return parseMenuResponse(response);
  }

  async function seasonFor({
    id,
    establishmentId,
    perPage = 40,
    offset = 0,
  } = {}) {
    const endpoint = `${config.api.series}/${id}`;
    const query = {
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
    };

    if (!id) {
      logger.error(`Requested ${endpoint}?${qs.stringify(query)}`);
      return null;
    }

    const response = await httpClient.get(endpoint, query);

    return seasonResponseFrom(response);
  }

  async function nextEpisodesFor({
    id,
    establishmentId,
    perPage = 3,
    episodeId,
  } = {}) {
    const endpoint = `${config.api.series}/${id}/next`;
    const query = {
      _number: perPage,
      _episode_id: episodeId,
      _prison: establishmentId,
      _sort_order: 'ASC',
    };

    if (!id || !episodeId) {
      logger.debug(`Requested ${endpoint}?${qs.stringify(query)}`);
      return null;
    }

    const response = await httpClient.get(endpoint, query);

    return seasonResponseFrom(response);
  }

  async function featuredContentFor(id) {
    const endpoint = `${config.api.hubContent}/${id}`;

    if (!id) {
      logger.debug(`Requested ${endpoint}`);
      return null;
    }

    const response = await httpClient.get(endpoint);
    return contentResponseFrom(response);
  }

  async function relatedContentFor({
    id,
    establishmentId,
    perPage = 8,
    offset = 0,
    sortOrder = 'ASC',
  } = {}) {
    const endpoint = `${config.api.hubContent}/related`;
    const query = {
      _category: id,
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
      _sort_order: sortOrder,
    };

    if (!id) {
      logger.debug(`Requested ${endpoint}?${qs.stringify(query)}`);
      return null;
    }

    const response = await httpClient.get(endpoint, query);

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
