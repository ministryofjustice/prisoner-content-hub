const express = require('express');

module.exports = function Tags({ logger, hubTagsService }) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      logger.info(`GET /tags/${id}`);

      if (!id) {
        return next();
      }

      const { establishmentId } = req.app.locals.envVars;
      const config = {
        content: true,
        header: false,
        postscript: false,
      };

      const data = await hubTagsService.termFor(id, establishmentId);

      return res.render('pages/tags', {
        tagId: id,
        data,
        config,
      });
    } catch (exception) {
      return next(exception);
    }
  });

  router.get('/related-content/:id', async (req, res, next) => {
    const { id } = req.params;
    logger.info(`GET /tags/${id}/related-content`);

    if (!id) {
      return next();
    }

    try {
      const { establishmentId } = req.app.locals.envVars;
      const { contentType } = req.query;
      const method =
        contentType === 'series' ? 'relatedSeriesFor' : 'relatedContentFor';

      const data = await hubTagsService[method]({
        id: req.params.id,
        establishmentId,
        ...req.query,
      });

      return res.json(data);
    } catch (exp) {
      return res.json(null);
    }
  });

  return router;
};
