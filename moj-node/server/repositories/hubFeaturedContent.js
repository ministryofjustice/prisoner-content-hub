
const { parseHubContentResponse } = require('../utils/index');
const config = require('../config');


function hubFeaturedContentRepository(httpClient) {
  async function hubContentFor(opts = { query: {} }) {
    const response = await httpClient.get(`${config.api.hubContent}/featured`, opts.query);
    return parseHubContentResponse(response);
  }

  function newsAndEvents({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 644,
        _prison: establishmentId,
      },
    });
  }

  function dayToDay({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 787,
        _prison: establishmentId,
      },
    });
  }

  function artAndCulture({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 651,
        _prison: establishmentId,
      },
    });
  }

  function healthyMindAndBody({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 648,
        _prison: establishmentId,
      },
    });
  }

  function music({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 785,
        _prison: establishmentId,
      },
    });
  }

  function inspiration({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 649,
        _prison: establishmentId,
      },
    });
  }

  function scienceAndNature({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 650,
        _prison: establishmentId,
      },
    });
  }

  function history({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 643,
        _prison: establishmentId,
      },
    });
  }

  function legalAndYourRights({ establishmentId }) {
    return hubContentFor({
      query: {
        _number: 4,
        _category: 786,
        _prison: establishmentId,
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
    music,
    inspiration,
    scienceAndNature,
    history,
    legalAndYourRights,
  };
}


module.exports = hubFeaturedContentRepository;
