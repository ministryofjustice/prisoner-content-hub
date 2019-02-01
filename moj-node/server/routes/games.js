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

    return res.render('pages/games/chess', {
      data: {
        title: 'Chess',
      },
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');

    return res.render('pages/games/sudoku', {
      data: {
        title: 'Sudoku',
      },
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    logger.info('GET /games/neontroids');

    return res.render('pages/games/neontroids', {
      data: {
        title: 'Neontroids',
      },
      config,
    });
  });

  router.get('/neontroids-game', (req, res) => {
    logger.info('GET /games/neontroids');

    return res.render('pages/games/neontroids-full');
  });

  return router;
};
