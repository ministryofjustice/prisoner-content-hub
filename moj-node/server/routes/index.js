const express = require('express');

module.exports = function Index({
  logger,
  demoDataService,
  hubFeaturedContentService,
  hubPromotedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res) => {
    try {
      logger.info('GET index');
      const gamedata = demoDataService.getGamesData();
      const newseventsData = demoDataService.getNewsEventsData();

      const featuredContent = await hubFeaturedContentService.hubFeaturedContent();
      const [promotionalContent] = await hubPromotedContentService.hubPromotedContent();

      const config = {
        content: true,
        header: true,
        postscript: true,
      };

      res.render('pages/index', {
        ...featuredContent,
        promotionalContent,
        gamedata,
        newseventsData,
        config,
      });
    } catch (exception) {
      logger.error(exception);
      res.sendStatus(500);
    }
  });

  // router.get('/content/:contentName', (req, res) => {
  //   try {
  //     const contentPath = `../data/content/${req.params.contentName}`;
  //     const content = require(contentPath); // eslint-disable-line
  //     res.render('pages/flat-content', content);
  //   } catch (exp) {
  //     res.status(404);
  //     res.send('Page not found');
  //   }
  // });

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
