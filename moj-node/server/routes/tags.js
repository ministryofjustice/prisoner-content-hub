const express = require('express');

module.exports = function Tags({
  logger,
  hubTagsService,
}) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      logger.info(`GET /tags/${id}`);
      const { establishmentId } = req.app.locals.envVars;
      const data = await hubTagsService.termFor(id, establishmentId);

      const config = {
        content: true,
        header: false,
        postscript: false,
      };

      res.render('pages/tags', {
        tagId: id,
        data,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  router.get('/related-content/:id', async (req, res) => {
    try {
      logger.info(`GET /tags/${req.params.id}/related-content`);
      const { establishmentId } = req.app.locals.envVars;
      const data = await hubTagsService.relatedContentFor({
        id: req.params.id,
        establishmentId,
        ...req.query,
      });

      res.json(data);
    } catch (exp) {
      res.json(null);
    }
  });

  return router;
};
