const { prop } = require('ramda');
const express = require('express');
const { relativeUrlFrom } = require('../utils');

const StandardClient = require('../clients/standard');

module.exports = function createContentRouter({
  hubContentService,
  logger,
  requestClient = new StandardClient(),
}) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    const { id } = req.params;

    logger.info(`GET /${id}`);

    if (!id) {
      return next();
    }

    const config = {
      content: true,
      header: false,
      postscript: false,
    };

    const { establishmentId, backendUrl } = req.app.locals.envVars;

    try {
      const data = await hubContentService.contentFor(id, establishmentId);
      const contentType = prop('contentType', data);

      switch (contentType) {
        case 'radio':
          return res.render('pages/audio', {
            config,
            data,
          });
        case 'video':
          return res.render('pages/video', {
            config,
            data,
          });
        case 'page':
          return res.render('pages/flat-content', {
            data,
            backHomeEnabled: true,
          });
        case 'landing-page':
          return res.render('pages/landing', {
            config,
            data,
            backHomeEnabled: true,
          });
        case 'pdf': {
          const url = relativeUrlFrom(data.url, backendUrl);
          logger.info('PROD - Sending PDF to client from:', url);
          const stream = await requestClient.get(url, {
            responseType: 'stream',
          });

          // X-Download-Options prevents Internet Explorer from executing downloads
          // in your site’s context. We don't want that
          res.removeHeader('X-Download-Options');
          res.type('application/pdf');

          stream.on('error', next);

          return stream.pipe(res);
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
