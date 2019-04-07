const R = require('ramda');

const config = require('../config');
const logger = require('../../log');
const { HUB_CONTENT_TYPES } = require('../constants/hub');
const {
  parseHubContentResponse,
  fixUrlForProduction,
} = require('../utils/index');

const {
  idFrom,
  tagIdFrom,
  titleFrom,
  contentTypeFrom,
  descriptionValueFrom,
  descriptionProcessedFrom,
  termDescriptionValueFrom,
  termDescriptionProcessedFrom,
  summaryValueFrom,
  imageAltFrom,
  imageUrlFrom,
  featuredImageUrlFrom,
  featuredImageAltFrom,
  durationFrom,
  audioUrlFrom,
  videoUrlFrom,
  seriesIdFrom,
  episodeFrom,
  seasonFrom,
  standFirstFrom,
  nameFrom,
  landingFeaturedContentIdFrom,
  categoryIdFrom,
  pdfUrlFrom,
  vocabularyType,
  tagsIdsFrom,
  establishmentIdFrom,
} = require('../selectors/hub');

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
    return parseTermResponse(response);
  }

  async function menuFor(id) {
    const response = await httpClient.get(config.api.hubMenu, {
      _parent: id,
      _menu: 'main',
    });
    return parseMenuResponse(response);
  }

  async function seasonFor({ id, establishmentId, perPage = 8, offset = 0 }) {
    const response = await httpClient.get(`${config.api.series}/${id}`, {
      _number: perPage,
      _offset: offset,
      _prison: establishmentId,
    });

    return parseSeasonResponse(response);
  }

  async function featuredContentFor(id) {
    const response = await httpClient.get(`${config.api.hubContent}/${id}`);
    return parseHubContentResponse(response);
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

    return parseHubContentResponse(response);
  }

  function parseTermResponse(data) {
    if (data === null) return null;
    return {
      id: tagIdFrom(data),
      type: vocabularyType(data),
      name: nameFrom(data),
      description: {
        raw: termDescriptionValueFrom(data),
        sanitized: termDescriptionProcessedFrom(data),
      },
      image: {
        alt: featuredImageAltFrom(data),
        url: fixUrlForProduction(
          featuredImageUrlFrom(data),
          config.drupalAppUrl,
        ),
      },
    };
  }

  function parseLandingResponse(data) {
    if (data === null) return null;

    return {
      id: idFrom(data),
      title: titleFrom(data),
      contentType: typeFrom(data),
      featuredContentId: landingFeaturedContentIdFrom(data),
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      image: {
        alt: featuredImageAltFrom(data),
        url: fixUrlForProduction(
          featuredImageUrlFrom(data),
          config.drupalAppUrl,
        ),
      },
      categoryId: categoryIdFrom(data),
    };
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

    const contentType = typeFrom(data);

    switch (contentType) {
      case 'video':
      case 'radio':
        return parseMediaResponse(data);
      case 'page':
        return parseFlatPageContent(data);
      case 'landing-page':
        return parseLandingResponse(data);
      case 'pdf':
        return parsePDFResponse(data);
      default:
        return null;
    }
  }

  function parseMediaResponse(data) {
    if (data === null) return null;

    const contentType = typeFrom(data);

    return {
      id: idFrom(data),
      title: titleFrom(data),
      contentType,
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      media:
        contentType === 'radio'
          ? fixUrlForProduction(audioUrlFrom(data), config.drupalAppUrl)
          : fixUrlForProduction(videoUrlFrom(data), config.drupalAppUrl),
      duration: durationFrom(data),
      image: {
        alt: imageAltFrom(data),
        url: fixUrlForProduction(imageUrlFrom(data), config.drupalAppUrl),
      },
      episode: episodeFrom(data),
      season: seasonFrom(data),
      seriesId: seriesIdFrom(data),
      tagsId: tagsIdsFrom(data),
      establishmentId: establishmentIdFrom(data),
      contentUrl: `/content/${idFrom(data)}`,
    };
  }

  function parseFlatPageContent(data) {
    if (data === null) return null;

    return {
      id: idFrom(data),
      title: titleFrom(data),
      contentType: typeFrom(data),
      description: {
        raw: descriptionValueFrom(data),
        sanitized: descriptionProcessedFrom(data),
        summary: summaryValueFrom(data),
      },
      standFirst: standFirstFrom(data),
      image: {
        alt: imageAltFrom(data),
        url: fixUrlForProduction(imageUrlFrom(data), config.drupalAppUrl),
      },
      establishmentId: establishmentIdFrom(data),
      contentUrl: `/content/${idFrom(data)}`,
    };
  }

  function parsePDFResponse(data) {
    if (data === null) return null;

    return {
      id: idFrom(data),
      title: titleFrom(data),
      contentType: typeFrom(data),
      url: fixUrlForProduction(pdfUrlFrom(data)),
      establishmentId: establishmentIdFrom(data),
      contentUrl: `/content/${idFrom(data)}`,
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
    menuFor,
  };
};
