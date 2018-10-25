const express = require('express');

module.exports = function Tags({
  logger,
  hubTagsService,
}) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      logger.info(`GET /tags/${req.params.id}`);

      const data = await hubTagsService.termFor(req.params.id);

      const config = {
        content: true,
        header: false,
        postscript: false,
      };

      res.render('pages/tags', {
        data,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
