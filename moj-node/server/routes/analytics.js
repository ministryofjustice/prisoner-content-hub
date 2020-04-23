const { path } = require('ramda');
const express = require('express');

const createAnalyticsRouter = ({ analyticsService, logger }) => {
  const router = express.Router();

  router.post('/event', (req, res) => {
    logger.info('GET /analytics/event');

    const sessionId = path(['session', 'id'], req);

    analyticsService.sendEvent({
      category: path(['body', 'category'], req),
      action: path(['body', 'action'], req),
      label: path(['body', 'label'], req),
      value: path(['body', 'value'], req),
      sessionId,
      userAgent: path(['body', 'userAgent'], req),
    });

    return res.send('OK');
  });

  router.post('/page', (req, res) => {
    logger.info('GET /analytics/page');

    const sessionId = path(['session', 'id'], req);

    analyticsService.sendPageTrack({
      hostname: path(['body', 'host'], req),
      page: path(['body', 'page'], req),
      title: path(['body', 'title'], req),
      sessionId,
      userAgent: path(['body', 'userAgent'], req),
    });

    return res.send('OK');
  });

  return router;
};

module.exports = {
  createAnalyticsRouter,
};
