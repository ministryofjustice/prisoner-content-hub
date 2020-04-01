const { path } = require('ramda');
const express = require('express');

const createAnalyticsRouter = ({ analyticsService, logger }) => {
  const router = express.Router();

  router.post('/', (req, res) => {
    logger.info('GET /analytics');

    analyticsService.sendEvent({
      type: path(['body', 'type'], req),
      category: path(['body', 'category'], req),
      action: path(['body', 'action'], req),
      label: path(['body', 'label'], req),
      value: path(['body', 'value'], req),
    });

    return res.send('OK');
  });

  return router;
};

module.exports = {
  createAnalyticsRouter,
};
