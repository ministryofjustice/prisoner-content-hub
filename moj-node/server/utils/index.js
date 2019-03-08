const R = require('ramda');
const { HUB_CONTENT_TYPES } = require('../constants/hub');
const config = require('../config');

const {
  idFrom,
  titleFrom,
  contentTypeFrom,
  summaryValueFrom,
  imageAltFrom,
  imageUrlFrom,
  durationFrom,
  establishmentIdFrom,
} = require('../selectors/hub');

const defaultThumbs = {
  moj_radio_item: '/public/images/default_audio.png',
  moj_pdf_item: '/public/images/default_document.png',
  moj_video_item: '/public/images/default_video.png',
  page: '/public/images/default_document.png',
};

const defaultAlt = {
  moj_radio_item: 'Audio file',
  moj_pdf_item: 'Document file',
  moj_video_item: 'Video file',
  page: 'Document file',
};

function getEstablishmentId(name) {
  if (typeof name === 'number') return name;

  const prisons = {
    berwyn: 792,
    wayland: 793,
  };

  return prisons[name] || 0;
}

function getEstablishmentName(id) {
  const establishmentName = {
    792: 'HMP Berwyn',
    793: 'HMP Wayland',
  };
  return establishmentName[id];
}

function parseHubFeaturedContentResponse(response) {
  if (!response) return {};
  const image = R.view(R.lensPath(['featured_image', 0]), response);

  const imageUrl = fixUrlForProduction(image.url, config.drupalAppUrl);
  const contentUrl =
    response.type === 'series' || response.type === 'tags'
      ? `/tags/${response.id}`
      : `/content/${response.id}`;

  return {
    id: response.id,
    title: response.title,
    contentType: HUB_CONTENT_TYPES[response.type],
    summary: response.summary,
    image: {
      ...image,
      url: imageUrl,
    },
    contentUrl,
    duration: response.duration,
  };
}

function parseHubContentResponse(data) {
  if (!data) return {};

  return Object.keys(data).map(key => {
    const image = fixUrlForProduction(
      imageUrlFrom(data[key]),
      config.drupalAppUrl,
    )
      ? {
          url: fixUrlForProduction(
            imageUrlFrom(data[key]),
            config.drupalAppUrl,
          ),
          alt: imageAltFrom(data[key]),
        }
      : {
          url: defaultThumbs[contentTypeFrom(data[key])],
          alt: defaultAlt[contentTypeFrom(data[key])],
        };

    return {
      id: idFrom(data[key]),
      title: titleFrom(data[key]),
      contentType: HUB_CONTENT_TYPES[contentTypeFrom(data[key])],
      summary: summaryValueFrom(data[key]),
      image,
      duration: durationFrom(data[key]),
      establishmentId: establishmentIdFrom(data[key]),
    };
  });
}

function replaceURLWithDefinedEndpoint(
  url = '',
  alternateUrl = config.hubEndpoint,
) {
  const urlSchemeAndAuthorityRegex = /^https?:\/\/[^/]+/;
  const updatedUrl = url.replace(urlSchemeAndAuthorityRegex, alternateUrl);

  return updatedUrl;
}

function fixUrlForProduction(url, alternateUrl = config.hubEndpoint) {
  if (config.production) {
    return replaceURLWithDefinedEndpoint(url, alternateUrl);
  }
  return url;
}

module.exports = {
  parseHubContentResponse,
  parseHubFeaturedContentResponse,
  replaceURLWithDefinedEndpoint,
  fixUrlForProduction,
  getEstablishmentId,
  getEstablishmentName,
};
