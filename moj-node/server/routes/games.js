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
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/chess',
      title: 'Chess',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/chess', {
      title: 'Chess',
      config,
    });
  });

  router.get('/sudoku', (req, res) => {
    logger.info('GET /games/sudoku');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/sudoku',
      title: 'Sudoku',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/sudoku', {
      title: 'Sudoku',
      config,
    });
  });

  router.get('/neontroids', (req, res) => {
    logger.info('GET /games/neontroids');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/neontroids',
      title: 'Neontroids',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/neontroids', {
      title: 'Neontroids',
      config,
    });
  });

  router.get('/mimstris', (req, res) => {
    logger.info('GET /games/mimstris');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/mimstris',
      title: 'Mimstris',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/mimstris', {
      title: 'Mimstris',
      config,
    });
  });

  router.get('/invadersfromspace', (req, res) => {
    logger.info('GET /games/invadersfromspace');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/invadersfromspace',
      title: 'Invaders from Space',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/invadersfromspace', {
      title: 'Invaders from Space',
      config,
    });
  });

  router.get('/crossword', (req, res) => {
    logger.info('GET /games/crossword');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/crossword',
      title: 'Crossword',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/crossword', {
      title: 'Crossword',
      config,
    });
  });

  router.get('/solitaire', (req, res) => {
    logger.info('GET /games/solitaire');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/solitaire',
      title: 'Solitaire',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/solitaire', {
      title: 'Solitaire',
      config,
    });
  });

  router.get('/smashout', (req, res) => {
    logger.info('GET /games/smashout');
    const userDetails = path(['session', 'user'], req);
    const sessionId = path(['session', 'id'], req);
    const userAgent = path(['headers', 'user-agent'], req);

    config.detailsType = 'small';
    config.userName = path(['name'], userDetails);
    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/games/smashout',
      title: 'Smashout',
      sessionId,
      userAgent,
    });

    return res.render('pages/games/smashout', {
      title: 'Smashout',
      config,
    });
  });

  return router;
};

module.exports = {
  createGamesRouter,
};
