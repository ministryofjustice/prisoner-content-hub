const express = require('express');
// const { path } = require('ramda');

module.exports = function Index({
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const { establishmentId } = req.app.locals.envVars;
      const { notification } = req.session;

      const [
        featuredContent,
        promotionalContent,
        tagsMenu,
        homepageMenu,
      ] = await Promise.all([
        hubFeaturedContentService.hubFeaturedContent({ establishmentId }),
        hubPromotedContentService.hubPromotedContent({ establishmentId }),
        hubMenuService.tagsMenu(),
        hubMenuService.homepageMenu(establishmentId),
      ]);

      const config = {
        content: true,
        header: true,
        postscript: true,
      };

      res.render('pages/index', {
        ...featuredContent,
        notification,
        promotionalContent,
        tagsMenu,
        homepageMenu,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
