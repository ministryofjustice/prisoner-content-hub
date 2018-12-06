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

function parseHubContentResponse(data) {
  if (!data) return {};

  return Object
    .keys(data)
    .map((key) => {
      const image = fixUrlForProduction(imageUrlFrom(data[key]))
        ? {
          url: fixUrlForProduction(imageUrlFrom(data[key])),
          alt: imageAltFrom(data[key]),
        }
        : {
          url: fixUrlForProduction(defaultThumbs[contentTypeFrom(data[key])]),
          alt: defaultAlt[contentTypeFrom(data[key])],
        };

      return ({
        id: idFrom(data[key]),
        title: titleFrom(data[key]),
        contentType: HUB_CONTENT_TYPES[contentTypeFrom(data[key])],
        summary: summaryValueFrom(data[key]),
        image,
        duration: durationFrom(data[key]),
      });
    });
}


function replaceURLWithDefinedEndpoint(url, alternateUrl = config.hubEndpoint) {
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
  replaceURLWithDefinedEndpoint,
  fixUrlForProduction,
};
