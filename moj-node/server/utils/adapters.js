const R = require('ramda');

const config = require('../config');
const { HUB_CONTENT_TYPES } = require('../constants/hub');
const { fixUrlForProduction } = require('./index');

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

function imageFor(image) {
  return image
    ? {
        url: fixUrlForProduction(image.url, config.drupalAppUrl),
        alt: image.alt,
      }
    : null;
}

function imageOrDefaultFor(image, contentType) {
  return image
    ? {
        url: fixUrlForProduction(image.url, config.drupalAppUrl),
        alt: image.alt,
      }
    : {
        url: defaultThumbs(contentType),
        alt: defaultAlt(contentType),
      };
}

function featuredContentResponseFrom(response) {
  const type = R.prop('content_type', response);
  const id = R.prop('id', response);
  const contentUrl =
    type === 'series' || type === 'tags' ? `/tags/${id}` : `/content/${id}`;

  return {
    id,
    title: response.title,
    contentType: HUB_CONTENT_TYPES[type],
    summary: response.summary,
    image: imageOrDefaultFor(response.image, type),
    contentUrl,
    duration: response.duration,
  };
}

function contentResponseFrom(data = []) {
  return data.map(item => {
    return {
      id: item.id,
      title: item.title,
      contentType: HUB_CONTENT_TYPES[item.content_type],
      summary: item.summary,
      image: imageFor(item.image),
      duration: item.duration,
      contentUrl: `/content/${item.id}`,
    };
  });
}

function mediaResponseFrom(data) {
  return {
    id: data.id,
    episodeId: data.episode_id,
    programmeCode: data.programme_code,
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
    image: imageOrDefaultFor(data.image),
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
    image: imageOrDefaultFor(data.image),
    establishmentId: R.view(R.lensPath(['prisons', 0, 'target_id']))(data),
    contentUrl: `/content/${data.id}`,
  };
}

function termResponseFrom(data) {
  return {
    id: data.id,
    contentType: data.content_type,
    name: data.title,
    description: {
      raw: R.path(['description', 'value'], data),
      sanitized: R.path(['description', 'sanitized'], data),
      summary: data.summary,
    },
    image: imageFor(data.image),
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
      programmeCode: data.programme_code,
    },
  };
}

function landingResponseFrom(data) {
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
    image: imageFor(data.image),
    categoryId: data.category_id,
  };
}

function pdfResponseFrom(data) {
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

function seasonResponseFrom(data = []) {
  return R.map(mediaResponseFrom, data);
}

function searchResultFrom({ _id, _source }) {
  const idFrom = text => text.match(/\d+/)[0];
  const titleFrom = R.view(R.lensPath(['title', 0]));
  return {
    title: titleFrom(_source),
    url: `/content/${idFrom(_id)}`,
  };
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
  searchResultFrom,
};
