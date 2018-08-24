
const { parseHubContentResponse } = require('../utils/index');
const config = require('../config');


function hubFeaturedContentRepository(httpClient) {
  async function hubContentFor(opts = { query: {} }) {
    const response = await httpClient.get(`${config.api.hubContent}/featured`, opts.query);
    return parseHubContentResponse(response);
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
