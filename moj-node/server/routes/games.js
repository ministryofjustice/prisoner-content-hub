const { path } = require('ramda');
const express = require('express');

const createGamesRouter = ({ analyticsService, logger }) => {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/chess', (req, res) => {
    logger.info('GET /games/chess');
    const userDetails = path(['session', 'user'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    config.newDesigns = newDesigns;
    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/chess',
      title: 'Chess',
      sessionId,
    });

    return res.render('pages/games/chess', {
      title: 'Chess',
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');
    const userDetails = path(['session', 'user'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    config.newDesigns = newDesigns;
    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/sudoku',
      title: 'Sudoku',
      sessionId,
    });

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    logger.info('GET /games/neontroids');
    const userDetails = path(['session', 'user'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    config.newDesigns = newDesigns;
    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/neontroids',
      title: 'Neontroids',
      sessionId,
    });

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      config,
    });
  });

  router.get('/mimstris', (req, res) => {
    logger.info('GET /games/mimstris');
    const userDetails = path(['session', 'user'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    config.newDesigns = newDesigns;
    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/mimstris',
      title: 'Mimstris',
      sessionId,
    });

    return res.render('pages/games/mimstris', {
      title: 'Mimstris',
      config,
    });
  });

  router.get('/invadersfromspace', (req, res) => {
    logger.info('GET /games/invadersfromspace');
    const userDetails = path(['session', 'user'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    config.newDesigns = newDesigns;
    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/invadersfromspace',
      title: 'Invaders from Space',
      sessionId,
    });

    return res.render('pages/games/invadersfromspace', {
      title: 'Invaders from Space',
      config,
    });
  });

  return router;
};

module.exports = {
  createGamesRouter,
};
