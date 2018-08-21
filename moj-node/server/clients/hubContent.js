const request = require('superagent');
const R = require('ramda');

const config = require('../config');

const contentTypes = {
  moj_radio_item: "radio",
  moj_pdf_item: "pdf",
  moj_video_item: "video",
  page: "page"  
}

class HubContentClient {
  constructor(client = request) {
    this.client = client;
  }

  get(endpoint, query = {}) {
    return this.client
      .get(`${config.api.hubContent}${endpoint}`)
      .query({ _format: 'json' })
      .query({ _lang: 'en' })
      .query(query)
      .then(res => res.body)
      .catch((error) => {
        // add logger
        return null;
      })
  }
}

class HubFeaturedContentResponse {
  static parse(data) {
    const idFrom = R.view(R.lensPath(['nid', 0, 'value']));
    const titleFrom = R.view(R.lensPath(['title', 0, 'value']));
    const contentTypeFrom = R.view(R.lensPath(['type', 0, 'target_id']));
    const descriptionValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'value']));
    const descriptionProcessedFrom = R.view(R.lensPath(['field_moj_description', 0, 'processed']));
    const imageAltFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'alt']));
    const imageUrlFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'url']));

    if (!data) return {};

    return Object
      .keys(data)
      .map(key => ({
        id: idFrom(data[key]),
        title: titleFrom(data[key]),
        contentType: contentTypes[contentTypeFrom(data[key])],
        description: {
          raw: descriptionValueFrom(data[key]),
          sanitized: descriptionProcessedFrom(data[key]),
        },
        image: {
          alt: imageAltFrom(data[key]),
          url: imageUrlFrom(data[key]),
        }
      }))
  }
}

function newsAndEventsFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 2,
    "_category": 664
  }})
}

function artAndCultureFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 651
  }})
}

function healthyMindAndBodyFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 648
  }})
}

function gamesFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 3,
    "_category": 647
  }})
}

function radioShowsAndPodcastsFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 646
  }})
}

function inspirationFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 649
  }})
}

function scienceAndNatureFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 650
  }})
}
function historyFn(httpClient) {
  return hubContentFor(httpClient, { query: {
    "_number": 4,
    "_category": 643
  }})
}

async function hubContentFor(httpClient, opts = { query: {}}) {
  const response = await httpClient.get("/featured", opts.query);
  return HubFeaturedContentResponse.parse(response);
}

async function hubFeaturedContent(httpClient) {
  const client = new HubContentClient(httpClient);

  const [
    newsAndEvents,
    games,
    radioShowsAndPodcasts,
    healthyMindAndBody,
    inspiration,
    scienceAndNature,
    artAndCulture,
    history
  ] = await Promise.all([
    newsAndEventsFn(client),
    gamesFn(client),
    radioShowsAndPodcastsFn(client),
    healthyMindAndBodyFn(client),
    inspirationFn(client),
    scienceAndNatureFn(client),
    artAndCultureFn(client),
    historyFn(client),
  ])

  return {
    newsAndEvents,
    games,
    radioShowsAndPodcasts,
    healthyMindAndBody,
    inspiration,
    scienceAndNature,
    artAndCulture,
    history
  }  
}

module.exports = {
  hubContentFor,
  hubFeaturedContent,
};
