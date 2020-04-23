const express = require('express');
const { path } = require('ramda');

const createTagRouter = ({ logger, hubTagsService, analyticsService }) => {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    try {
      const { id } = req.params;

      logger.info(`GET /tags/${id}`);

      if (!id) {
        return next();
      }

      const userName = path(['session', 'user', 'name'], req);
      const establishmentId = path(['locals', 'establishmentId'], res);
      const sessionId = path(['session', 'id'], req);
      const userAgent = path(['headers', 'user-agent'], req);
      const config = {
        content: true,
        header: false,
        postscript: false,
        detailsType: 'small',
        userName,
        returnUrl: req.originalUrl,
      };

      const data = await hubTagsService.termFor(id, establishmentId);
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: `/tags/${id}`,
        title: data.name,
        sessionId,
        userAgent,
      });

      data.secondaryTags = data.id;

      return res.render('pages/tags', {
        title: data.name,
        tagId: id,
        data: {
          ...data,
          secondaryTags: data.contentType === 'series' ? '' : data.id,
        },
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
      const establishmentId = path(['locals', 'establishmentId'], res);
      const contentType = path(['query', 'contentType'], req);

      const method =
        contentType === 'series' ? 'relatedSeriesFor' : 'relatedContentFor';

      const data = await hubTagsService[method]({
        id,
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

module.exports = {
  createTagRouter,
};
