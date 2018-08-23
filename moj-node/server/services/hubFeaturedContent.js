const { HubContentClient, HubFeaturedContentResponse } = require('../clients/hubContent');

module.exports = function createHubFeaturedContentService() {
  function newsAndEventsFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 2,
        _category: 664,
      },
    });
  }

  function artAndCultureFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 651,
      },
    });
  }

  function healthyMindAndBodyFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 648,
      },
    });
  }

  function gamesFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 3,
        _category: 647,
      },
    });
  }

  function radioShowsAndPodcastsFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 646,
      },
    });
  }

  function inspirationFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 649,
      },
    });
  }

  function scienceAndNatureFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 650,
      },
    });
  }

  function historyFn(httpClient) {
    return hubContentFor(httpClient, {
      query: {
        _number: 4,
        _category: 643,
      },
    });
  }

  async function hubContentFor(httpClient, opts = { query: {} }) {
    const response = await httpClient.get('/featured', opts.query);
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
      history,
    ] = await Promise.all([
      newsAndEventsFn(client),
      gamesFn(client),
      radioShowsAndPodcastsFn(client),
      healthyMindAndBodyFn(client),
      inspirationFn(client),
      scienceAndNatureFn(client),
      artAndCultureFn(client),
      historyFn(client),
    ]);

    return {
      newsAndEvents,
      games,
      radioShowsAndPodcasts,
      healthyMindAndBody,
      inspiration,
      scienceAndNature,
      artAndCulture,
      history,
    };
  }

  return {
    hubContentFor,
    hubFeaturedContent,
  };
};
