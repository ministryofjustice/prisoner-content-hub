const { path } = require('ramda');
const express = require('express');

module.exports = function createGamesRouter({ logger }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/chess', (req, res) => {
    logger.info('GET /games/chess');
    const userDetails = path(['session', 'user'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);

    return res.render('pages/games/chess', {
      title: 'Chess',
      data: {
        title: 'Chess',
      },
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');
    const userDetails = path(['session', 'user'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      data: {
        title: 'Sudoku',
      },
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    logger.info('GET /games/neontroids');
    const userDetails = path(['session', 'user'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      data: {
        title: 'Neontroids',
      },
      config,
    });
  });

  return router;
};
