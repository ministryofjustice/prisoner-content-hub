const config = require('../config');
const { HUB_CONTENT_TYPES } = require('../constants/hub');

const {
  idFrom,
  titleFrom,
  contentTypeFrom,
  descriptionValueFrom,
  descriptionProcessedFrom,
  bodyProcessedFrom,
  summaryValueFrom,
  imageAltFrom,
  imageUrlFrom,
  durationFrom,
  audioFrom,
  seriesFrom,
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
      case 'radio':
        return parseRadioResponse(data);
      case 'page':
        return parseFlatPageContent(data);
      default:
        return null;
    }
  }

  function parseRadioResponse(data) {
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
      series: seriesFrom(data),
    };
  }

  function parseFlatPageContent(data) {
    return {
      id: idFrom(data),
      title: titleFrom(data),
      type: HUB_CONTENT_TYPES[contentTypeFrom(data)],
      body: {
        sanitized: bodyProcessedFrom(data),
      },
      standFirst: standFirstFrom(data),
    };
  }

  return {
    contentFor,
    termFor,
  };
};
