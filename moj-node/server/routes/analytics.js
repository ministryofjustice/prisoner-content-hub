const { path } = require('ramda');
const express = require('express');

const createAnalyticsRouter = ({ analyticsService, logger }) => {
  const router = express.Router();

  router.post('/event', (req, res) => {
    logger.info('GET /analytics/event');

    analyticsService.sendEvent({
      category: path(['body', 'category'], req),
      action: path(['body', 'action'], req),
      label: path(['body', 'label'], req),
      value: path(['body', 'value'], req),
    });

    return res.send('OK');
  });

  router.post('/page', (req, res) => {
    logger.info('GET /analytics/page');

    analyticsService.sendPageTrack({
      hostname: path(['body', 'host'], req),
      page: path(['body', 'page'], req),
      title: path(['body', 'title'], req),
    });

    return res.send('OK');
  });

  return router;
};

module.exports = {
  createAnalyticsRouter,
};
