const express = require('express');
const { path } = require('ramda');

module.exports = function Home({
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  offenderService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET home');

      const { establishmentId } = req.app.locals.envVars;
      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);

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
        offenderService.getEventsForToday(bookingId),
      ]);

      const config = {
        content: true,
        header: true,
        postscript: true,
        newDesigns: res.locals.features.newDesigns,
        detailsType: 'large',
        userName: path(['name'], userDetails),
      };

      res.render('pages/home', {
        ...featuredContent,
        notification,
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
