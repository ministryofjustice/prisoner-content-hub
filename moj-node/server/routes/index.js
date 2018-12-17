const express = require('express');

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

      const [
        featuredContent,
        [promotionalContent],
        seriesMenu,
      ] = await Promise.all([
        hubFeaturedContentService.hubFeaturedContent({
          establishmentId: res.locals.establishmentId,
        }),
        hubPromotedContentService.hubPromotedContent({
          establishmentId: res.locals.establishmentId,
        }),
        hubMenuService.seriesMenu(),
      ]);

      const config = {
        content: true,
        header: true,
        postscript: true,
      };

      res.render('pages/index', {
        ...featuredContent,
        promotionalContent,
        seriesMenu,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
