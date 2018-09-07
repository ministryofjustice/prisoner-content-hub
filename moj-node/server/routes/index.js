const express = require('express');

module.exports = function Index({
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');
      const featuredContent = await hubFeaturedContentService.hubFeaturedContent();
      const [promotionalContent] = await hubPromotedContentService.hubPromotedContent();

      const config = {
        content: true,
        header: true,
        postscript: false,
      };

      res.render('pages/index', {
        ...featuredContent,
        promotionalContent,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
