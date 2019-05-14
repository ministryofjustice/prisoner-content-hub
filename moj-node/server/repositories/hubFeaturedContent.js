const R = require('ramda');
const qs = require('querystring');

const logger = require('../../log');
const config = require('../config');
const { featuredContentResponseFrom } = require('../utils/adapters');

function hubFeaturedContentRepository(httpClient) {
  async function contentFor({ categoryId, establishmentId, number = 4 } = {}) {
    const endpoint = `${config.api.hubContent}/featured`;
    const query = {
      _number: number,
      _category: categoryId,
      _prison: establishmentId,
    };

    if (!categoryId) {
      logger.error(`Requested ${endpoint}?${qs.stringify(query)}`);
      return [];
    }

    const response = await httpClient.get(endpoint, query);

    if (!Array.isArray(response)) return [];

    return R.map(featuredContentResponseFrom, response);
  }

  function newsAndEvents({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 644,
      establishmentId,
    });
  }

  function dayToDay({ establishmentId }) {
    return contentFor({
      number: 5,
      categoryId: 787,
      prison: establishmentId,
    });
  }

  function artAndCulture({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 651,
      establishmentId,
    });
  }

  function healthyMindAndBody({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 648,
      establishmentId,
    });
  }

  function music({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 785,
      establishmentId,
    });
  }

  function inspiration({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 649,
      establishmentId,
    });
  }

  function scienceAndNature({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 650,
      establishmentId,
    });
  }

  function history({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 643,
      establishmentId,
    });
  }

  function legalAndYourRights({ establishmentId }) {
    return contentFor({
      number: 4,
      categoryId: 786,
      establishmentId,
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
        contentUrl: '/games/chess',
      },
      {
        id: 'sudoku',
        title: 'Sudoku',
        contentType: 'game',
        summary: '',
        image: {
          url: '/public/images/sudoku.png',
        },
        contentUrl: '/games/sudoku',
      },
      {
        id: 'neontroids',
        title: 'Neontroids',
        contentType: 'game',
        summary: '',
        image: {
          url: '/public/images/neontroids.png',
        },
        contentUrl: '/games/neontroids',
      },
    ];
  }

  return {
    contentFor,
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
