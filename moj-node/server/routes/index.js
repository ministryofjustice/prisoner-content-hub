const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const promotalcontentdata = demoDataService.getPromotalContentData();
    const submenudata = demoDataService.getSubMenuData();
    const inspirationdata = demoDataService.getInspirationData();
    const newseventsData = demoDataService.getNewsEventsData();

    res.render('pages/index', { 
      inspirationdata, 
      submenudata,
      newseventsData, 
      promotalcontentdata 
    });
  });

  return router;
};
