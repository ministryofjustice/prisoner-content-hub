const { prop, path, propOr } = require('ramda');
const express = require('express');

const createContentRouter = ({
  hubContentService,
  analyticsService,
  logger,
}) => {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    logger.info(`GET /${id}`);

    if (!id) {
      return next();
    }

    const userName = path(['session', 'user', 'name'], req);

    const config = {
      content: true,
      header: false,
      postscript: false,
      userName,
      returnUrl: req.originalUrl,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);

    try {
      const data = await hubContentService.contentFor(id, establishmentId);
      const contentType = prop('contentType', data);
      const sessionId = path(['session', 'id'], req);
      const getCategoriesFrom = propOr([], 'categories');
      const getSecondaryTagsFrom = propOr([], 'secondaryTags');

      switch (contentType) {
        case 'radio':
          analyticsService.sendPageTrack({
            hostname: req.hostname,
            page: `/content/${id}`,
            title: `${data.title}`,
            sessionId,
          });

          return res.render('pages/audio', {
            title: data.title,
            config,
            data: {
              ...data,
              categories: getCategoriesFrom(data).join(','),
              secondaryTags: getSecondaryTagsFrom(data).join(','),
            },
          });
        case 'video':
          analyticsService.sendPageTrack({
            hostname: req.hostname,
            page: `/content/${id}`,
            title: `${data.title}`,
            sessionId,
          });

          return res.render('pages/video', {
            title: data.title,
            config,
            data: {
              ...data,
              categories: getCategoriesFrom(data).join(','),
              secondaryTags: getSecondaryTagsFrom(data).join(','),
            },
          });
        case 'page':
          config.content = false;
          analyticsService.sendPageTrack({
            hostname: req.hostname,
            page: `/content/${id}`,
            title: `${data.title}`,
            sessionId,
          });

          return res.render('pages/flat-content', {
            title: data.title,
            config,
            data: {
              ...data,
              categories: getCategoriesFrom(data).join(','),
              secondaryTags: getSecondaryTagsFrom(data).join(','),
            },
          });
        case 'landing-page':
          config.postscript = true;
          analyticsService.sendPageTrack({
            hostname: req.hostname,
            page: `/content/${id}`,
            title: `${data.title}`,
            sessionId,
          });

          return res.render('pages/category', {
            title: data.title,
            config,
            data: {
              ...data,
              categories: propOr('', 'categoryId', data),
            },
          });
        case 'pdf': {
          logger.info('PROD - Sending PDF to client from:', data.url);
          analyticsService.sendEvent({
            category: 'PDFs',
            action: `${data.title}`,
            label: 'Downloads',
            sessionId,
            value: 1,
          });
          res.writeHead(301, { Location: data.url });
          res.end();
          return false;
        }
        default:
          // send to the 404 page
          return next();
      }
    } catch (exp) {
      return next(exp);
    }
  });

  return router;
};

module.exports = {
  createContentRouter,
};
