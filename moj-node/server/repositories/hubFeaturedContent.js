const R = require('ramda');

const { sanitizeTruncateText } = require('../utils/index');
const config = require('../config');


function hubFeaturedContentRepository(httpClient) {
  const contentTypes = {
    moj_radio_item: 'radio',
    moj_pdf_item: 'pdf',
    moj_video_item: 'video',
    page: 'page',
  };

  async function hubContentFor(opts = { query: {} }) {
    const response = await httpClient.get(`${config.api.hubContent}/featured`, opts.query);
    return parseResponse(response);
  }

  function parseResponse(data) {
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

  function newsAndEvents() {
    return hubContentFor({
      query: {
        _number: 2,
        _category: 664,
      },
    });
  }

  function artAndCulture() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 651,
      },
    });
  }

  function healthyMindAndBody() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 648,
      },
    });
  }

  function games() {
    return hubContentFor({
      query: {
        _number: 3,
        _category: 647,
      },
    });
  }

  function radioShowsAndPodcasts() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 646,
      },
    });
  }

  function inspiration() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 649,
      },
    });
  }

  function scienceAndNature() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 650,
      },
    });
  }

  function history() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 643,
      },
    });
  }


  return {
    hubContentFor,
    newsAndEvents,
    artAndCulture,
    healthyMindAndBody,
    games,
    radioShowsAndPodcasts,
    inspiration,
    scienceAndNature,
    history,
  };
}


module.exports = hubFeaturedContentRepository;
