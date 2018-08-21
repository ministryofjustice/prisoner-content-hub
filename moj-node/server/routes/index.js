const express = require('express');

const { hubFeaturedContent } = require('../clients/hubContent');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
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

      const featuredContent = await hubFeaturedContent();
      console.log("********************************");
      console.log(featuredContent);
      console.log("********************************");


      const config = {
        content: true,
        header: true,
        postscript: true,
      };

      // res.sendStatus(200);

      res.render('pages/index', {
        ...featuredContent,
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
        historydata,
        config,
      });
    } catch (exception) {
      logger.error(exception);
      res.sendStatus(500);
    }
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
      const landingpagesubmenudata = demoDataService.getLandingPageSubMenuData();
      const youmightlikedata = demoDataService.getYouMightLike();
      const config = {
        content: true,
        header: true,
        postscript: false,
      };
      const data = {
        headerClass: 'healthy-mind-body',
      };
      res.render('pages/landing', {
        data,
        config,
        landingpagesubmenudata,
        youmightlikedata,
      });
    } catch (exp) {
      res.status(404);
      res.send('Page not found');
    }
  });

  router.get('/video', (req, res) => {
    try {
      const watchnextdata = demoDataService.getWatchNextData();
      const youmightlikedata = demoDataService.getYouMightLike();
      const youmightlikesmalldata = demoDataService.getYouMightLikeSmallData();
      const config = {
        content: true,
        header: false,
        postscript: false,
      };
      res.render('pages/video', {
        config,
        watchnextdata,
        youmightlikedata,
        youmightlikesmalldata,
      });
    } catch (exp) {
      res.status(404);
      res.send('Page not found');
    }
  });

  router.get('/audio', (req, res) => {
    try {
      const listennextdata = demoDataService.getListenNextData();
      const youmightlikedata = demoDataService.getYouMightLike();
      const youmightlikesmalldata = demoDataService.getYouMightLikeSmallData();
      const config = {
        content: true,
        header: false,
        postscript: false,
      };
      res.render('pages/audio', {
        config,
        listennextdata,
        youmightlikedata,
        youmightlikesmalldata,
      });
    } catch (exp) {
      res.status(404);
      res.send('Page not found');
    }
  });

  return router;
};
