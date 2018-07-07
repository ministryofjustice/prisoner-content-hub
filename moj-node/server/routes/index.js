const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const promotalcontentdata = demoDataService.getPromotalContentData();
    const inspirationdata = demoDataService.getInspirationData();
    const newseventsData = demoDataService.getNewsEventsData();

    res.render('pages/index', { 
      inspirationdata, 
      newseventsData, 
      promotalcontentdata 
    });
  });

  return router;
};
