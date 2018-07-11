const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const promotalcontentdata = demoDataService.getPromotalContentData();
    const submenudata = demoDataService.getSubMenuData();
    const inspirationdata = demoDataService.getInspirationData();
    const newseventsData = demoDataService.getNewsEventsData();
    const seriesdata = demoDataService.geSeriesData();

    res.render('pages/index', {
      inspirationdata,
      submenudata,
      newseventsData,
      promotalcontentdata,
      seriesdata,
    });
  });

  return router;
};
