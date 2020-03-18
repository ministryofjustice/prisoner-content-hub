const { path } = require('ramda');
const express = require('express');

const createNprRouter = ({ logger }) => {
  const router = express.Router();

  router.get('/', async (req, res) => {
    logger.info(`GET /npr`);

    const userName = path(['session', 'user', 'name'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const matomoUrl = path(['app', 'locals', 'config', 'matomoUrl'], req);

    const config = {
      content: true,
      header: false,
      postscript: false,
      detailsType: 'small',
      newDesigns,
      userName,
      matomoUrl,
    };

    return res.render('pages/npr', {
      title: 'NPR',
      config,
      data: {
        title: 'NPR',
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
