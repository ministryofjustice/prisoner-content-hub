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

    return res.render('pages/chess', {
      data: {
        title: 'Chess',
      },
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');

    return res.render('pages/sudoku', {
      data: {
        title: 'Sudoku',
      },
      config,
    });
  });

  return router;
};
