const express = require('express');

module.exports = function Index({
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
}) {
  const router = express.Router();

  router.get('/', async (req, res) => {
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
      logger.error(exception);
      res.sendStatus(500);
    }
  });

  return router;
};
