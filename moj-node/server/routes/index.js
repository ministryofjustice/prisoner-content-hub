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
    const radiopodcastsdata = demoDataService.getRadioPodcastsData();
    const healthymindbodydata = demoDataService.getHealthyMindBodyData();
    const sciencenaturedata = demoDataService.getScienceNatureData();
    const artculturedata = demoDataService.getArtCultureData();
    const historydata = demoDataService.getHistoryData();

    res.render('pages/index', {
      inspirationdata,
      gamedata,
      submenudata,
      newseventsData,
      promotalcontentdata,
      seriesdata,
      radiopodcastsdata,
      healthymindbodydata,
      sciencenaturedata,
      artculturedata,
      historydata
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

  router.get('/landing', (req, res) => {
    try {
      const content = 'Hello world'
      res.render('pages/landing', content);
    } catch (exp) {
      res.status(404);
      res.send('Page not found');
    }
  });
  
  return router;
};
