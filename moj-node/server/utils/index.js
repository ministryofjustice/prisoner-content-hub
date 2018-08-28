const striptags = require('striptags');

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

function sanitizeTruncateText(text, opts = { size: 100 }) {
  if (!text) return null;

  const sanitized = striptags(text);
  return `${sanitized.substring(0, opts.size)}...`;
}

function parseHubContentResponse(data) {
  if (!data) return {};

  return Object
    .keys(data)
    .map((key) => {
      const image = imageUrlFrom(data[key])
        ? {
          url: imageUrlFrom(data[key]),
          alt: imageAltFrom(data[key]),
        }
        : {
          url: defaultThumbs[contentTypeFrom(data[key])],
          alt: defaultAlt[contentTypeFrom(data[key])],
        };

      const description = summaryValueFrom(data[key])
        ? { sanitized: summaryValueFrom(data[key]) }
        : {
          raw: descriptionValueFrom(data[key]),
          sanitized: sanitizeTruncateText(descriptionProcessedFrom(data[key])),
        };

      return ({
        id: idFrom(data[key]),
        title: titleFrom(data[key]),
        contentType: HUB_CONTENT_TYPES[contentTypeFrom(data[key])],
        description,
        image,
        duration: durationFrom(data[key]),
      });
    });
}

module.exports = {
  sanitizeTruncateText,
  parseHubContentResponse,
};
