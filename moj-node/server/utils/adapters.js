const R = require('ramda');

const config = require('../config');
const { HUB_CONTENT_TYPES } = require('../constants/hub');
const { fixUrlForProduction } = require('./index');

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

const defaultThumbs = type => {
  const thumbs = {
    moj_radio_item: '/public/images/default_audio.png',
    moj_pdf_item: '/public/images/default_document.png',
    moj_video_item: '/public/images/default_video.png',
    page: '/public/images/default_document.png',
  };

  return thumbs[type] || thumbs.page;
};

const defaultAlt = type => {
  const alt = {
    moj_radio_item: 'Audio file',
    moj_pdf_item: 'Document file',
    moj_video_item: 'Video file',
    page: 'Document file',
  };
  return alt[type] || alt.page;
};

function featuredContentResponseFrom(response) {
  const type = R.prop('type', response);
  const id = R.prop('id', response);
  const contentUrl =
    type === 'series' || type === 'tags' ? `/tags/${id}` : `/content/${id}`;

  const imageObj = R.view(R.lensPath(['featured_image', 0]), response);
  const image = imageObj
    ? {
        url: fixUrlForProduction(R.prop('url', imageObj), config.drupalAppUrl),
        alt: R.prop('alt', imageObj),
      }
    : {
        url: defaultThumbs(type),
        alt: defaultAlt(type),
      };

  return {
    id,
    title: response.title,
    contentType: HUB_CONTENT_TYPES[type],
    summary: response.summary,
    image,
    contentUrl,
    duration: response.duration,
  };
}

function contentResponseFrom(data) {
  if (!data) return {};

  return Object.keys(data).map(key => {
    const image = imageUrlFrom(data[key])
      ? {
          url: fixUrlForProduction(
            imageUrlFrom(data[key]),
            config.drupalAppUrl,
          ),
          alt: imageAltFrom(data[key]),
        }
      : {
          url: defaultThumbs(contentTypeFrom(data[key])),
          alt: defaultAlt(contentTypeFrom(data[key])),
        };

    return {
      id: idFrom(data[key]),
      title: titleFrom(data[key]),
      contentType: HUB_CONTENT_TYPES[contentTypeFrom(data[key])],
      summary: summaryValueFrom(data[key]),
      image,
      duration: durationFrom(data[key]),
      establishmentId: establishmentIdFrom(data[key]),
      contentUrl: `/content/${idFrom(data[key])}`,
    };
  });
}

function mediaResponseFrom(data) {
  return {
    id: data.id,
    episodeId: data.episode_id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    description: {
      raw: R.path(['description', 'value'], data),
      sanitized: R.path(['description', 'processed'], data),
      summary: R.path(['description', 'summary'], data),
    },
    media: fixUrlForProduction(
      R.path(['media', 'url'], data),
      config.drupalAppUrl,
    ),
    duration: data.duration,
    image: {
      alt: R.path(['image', 'alt'], data),
      url: fixUrlForProduction(
        R.path(['image', 'url'], data),
        config.drupalAppUrl,
      ),
    },
    episode: data.episode,
    season: data.season,
    seriesId: data.series_id,
    tagsId: R.map(R.prop('target_id'), R.propOr([], 'categories', data)),
    establishmentId: R.view(R.lensPath(['prisons', 0, 'target_id']))(data),
    contentUrl: `/content/${data.id}`,
  };
}

function flatPageContentFrom(data) {
  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    description: {
      raw: R.path(['description', 'value'], data),
      sanitized: R.path(['description', 'processed'], data),
      summary: R.path(['description', 'summary'], data),
    },
    standFirst: data.stand_first,
    image: {
      alt: R.path(['image', 'alt'], data),
      url: fixUrlForProduction(
        R.path(['image', 'url'], data),
        config.drupalAppUrl,
      ),
    },
    establishmentId: R.view(R.lensPath(['prisons', 0, 'target_id']))(data),
    contentUrl: `/content/${data.id}`,
  };
}

function termResponseFrom(data) {
  return {
    id: data.id,
    type: data.content_type,
    name: data.title,
    description: {
      raw: R.path(['description', 'value'], data),
      sanitized: R.path(['description', 'sanitized'], data),
      summary: data.summary,
    },
    image: {
      alt: R.path(['image', 'alt'], data),
      url: fixUrlForProduction(
        R.path(['image', 'url'], data),
        config.drupalAppUrl,
      ),
    },
    video: {
      url: fixUrlForProduction(
        R.path(['video', 'url'], data),
        config.drupalAppUrl,
      ),
    },
    audio: {
      url: fixUrlForProduction(
        R.path(['audio', 'url'], data),
        config.drupalAppUrl,
      ),
    },
  };
}

function landingResponseFrom(data) {
  if (data === null) return null;

  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    featuredContentId: data.featured_content_id,
    description: {
      raw: R.path(['description', 'value'], data),
      sanitized: R.path(['description', 'processed'], data),
      summary: R.path(['description', 'summary'], data),
    },
    image: {
      alt: R.path(['image', 'alt'], data),
      url: fixUrlForProduction(
        R.path(['image', 'url'], data),
        config.drupalAppUrl,
      ),
    },
    categoryId: data.category_id,
  };
}

function pdfResponseFrom(data) {
  if (data === null) return null;

  return {
    id: data.id,
    title: data.title,
    contentType: typeFrom(data.content_type),
    url: fixUrlForProduction(R.path(['media', 'url'], data)),
    establishmentId: R.view(R.lensPath(['prisons', 0, 'target_id']))(data),
    contentUrl: `/content/${data.id}`,
  };
}

function typeFrom(type) {
  return HUB_CONTENT_TYPES[type];
}

function seasonResponseFrom(data) {
  return R.map(mediaResponseFrom, data);
}

module.exports = {
  contentResponseFrom,
  featuredContentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  flatPageContentFrom,
  landingResponseFrom,
  pdfResponseFrom,
  typeFrom,
};
