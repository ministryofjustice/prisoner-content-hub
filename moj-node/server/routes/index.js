const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const inspirationdata = demoDataService.getInspirationData();
    const newseventsData = demoDataService.getNewsEventsData();

    res.render('pages/index', { inspirationdata, newseventsData });
  });

  return router;
};
