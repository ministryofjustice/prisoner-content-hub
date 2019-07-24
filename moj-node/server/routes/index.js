const express = require('express');
// const { path } = require('ramda');

module.exports = function Index({
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  // offenderService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const { establishmentId } = req.app.locals.envVars;
      // const userDetails = path(['session', 'user'], req);
      // const bookingId = path(['bookingId'], userDetails);

      const [
        featuredContent,
        promotionalContent,
        tagsMenu,
        homepageMenu,
        todaysEvents,
      ] = await Promise.all([
        hubFeaturedContentService.hubFeaturedContent({ establishmentId }),
        hubPromotedContentService.hubPromotedContent({ establishmentId }),
        hubMenuService.tagsMenu(),
        hubMenuService.homepageMenu(establishmentId),
        // offenderService.getEventsForToday(bookingId),
      ]);

      const config = {
        content: true,
        header: true,
        postscript: true,
      };

      res.render('pages/index', {
        ...featuredContent,
        promotionalContent,
        tagsMenu,
        homepageMenu,
        config,
        todaysEvents,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
