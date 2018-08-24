const striptags = require('striptags');
const R = require('ramda');

const contentTypes = {
  moj_radio_item: 'radio',
  moj_pdf_item: 'pdf',
  moj_video_item: 'video',
  page: 'page',
};

function sanitizeTruncateText(text, opts = { size: 100 }) {
  if (!text) return null;

  const sanitized = striptags(text);
  return `${sanitized.substring(0, opts.size)}...`;
}

function parseHubContentResponse(data) {
  const idFrom = R.view(R.lensPath(['nid', 0, 'value']));
  const titleFrom = R.view(R.lensPath(['title', 0, 'value']));
  const contentTypeFrom = R.view(R.lensPath(['type', 0, 'target_id']));
  const descriptionValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'value']));
  const descriptionProcessedFrom = R.view(R.lensPath(['field_moj_description', 0, 'processed']));
  const summaryValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'summary']));
  const imageAltFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'alt']));
  const imageUrlFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'url']));
  const durationFrom = R.view(R.lensPath(['field_moj_duration', 0, 'value']));

  if (!data) return {};

  return Object
    .keys(data)
    .map((key) => {
      const description = summaryValueFrom(data[key])
        ? { sanitized: summaryValueFrom(data[key]) }
        : {
          raw: descriptionValueFrom(data[key]),
          sanitized: sanitizeTruncateText(descriptionProcessedFrom(data[key])),
        };

      return ({
        id: idFrom(data[key]),
        title: titleFrom(data[key]),
        contentType: contentTypes[contentTypeFrom(data[key])],
        description,
        image: {
          alt: imageAltFrom(data[key]),
          url: imageUrlFrom(data[key]),
        },
        duration: durationFrom(data[key]),
      });
    });
}

module.exports = {
  sanitizeTruncateText,
  parseHubContentResponse,
};
