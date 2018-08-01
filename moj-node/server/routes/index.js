const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const promotalcontentdata = demoDataService.getPromotalContentData();
    const submenudata = demoDataService.getSubMenuData();
    const inspirationdata = demoDataService.getInspirationData();
    const gamedata = demoDataService.getGamesData();
    const newseventsData = demoDataService.getNewsEventsData();
    const seriesdata = demoDataService.geSeriesData();

    res.render('pages/index', {
      inspirationdata,
      gamedata,
      submenudata,
      newseventsData,
      promotalcontentdata,
      seriesdata,
    });
  });

  router.get('/content/:contentName', (req, res) => {
    try {
      const contentPath = `../data/content/${req.params.contentName}`;
      const content = require(contentPath); // eslint-disable-line
      res.render('pages/flat-content', content);
    } catch (exp) {
      res.status(404);
      res.send('Page not found');
    }
  });

  return router;
};
