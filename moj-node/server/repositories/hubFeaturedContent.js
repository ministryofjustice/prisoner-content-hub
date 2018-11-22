
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
        _number: 4,
        _category: 644,
      },
    });
  }

  function dayToDay() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 787,
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

  function musicAndGames() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 785,
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

  function legalAndYourRights() {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 786,
      },
    });
  }

  function games() {
    return [
      {
        id: 'chess',
        title: 'Chess',
        contentType: 'game',
        summary: '',
        image: {
          url: '/public/images/chessboard.png',
        },
      },
      {
        id: 'sudoku',
        title: 'Sudoku',
        contentType: 'game',
        summary: '',
        image: {
          url: '/public/images/sudoku.png',
        },
      },
      {
        id: 'neontroids',
        title: 'Neontroids',
        contentType: 'game',
        summary: '',
        image: {
          url: '/public/images/neontroids.png',
        },
      },
    ];
  }


  return {
    hubContentFor,
    newsAndEvents,
    dayToDay,
    artAndCulture,
    healthyMindAndBody,
    games,
    musicAndGames,
    inspiration,
    scienceAndNature,
    history,
    legalAndYourRights,
  };
}


module.exports = hubFeaturedContentRepository;
