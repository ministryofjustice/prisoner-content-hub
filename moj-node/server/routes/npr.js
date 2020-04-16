const { path } = require('ramda');
const express = require('express');

const createNprRouter = ({ analyticsService, logger }) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    logger.info(`GET /npr`);

    const userName = path(['session', 'user', 'name'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const sessionId = path(['session', 'id'], req);

    const config = {
      content: true,
      header: false,
      postscript: false,
      detailsType: 'small',
      newDesigns,
      userName,
    };

    analyticsService.sendPageTrack({
      hostname: req.hostname,
      page: '/npr',
      title: 'NPR Live Stream',
      sessionId,
    });

    return res.render('pages/npr', {
      title: 'NPR Live Stream',
      config,
      data: {
        title: 'NPR Live Stream',
        contentType: 'audio',
        series: 'none',
        description: {
          sanitized: 'Blah',
        },
        media: 'http://185.14.84.101:8000/stream.ogg',
      },
    });
  });

  return router;
};

module.exports = {
  createNprRouter,
};
