const { prop } = require('ramda');
const express = require('express');
const request = require('superagent');
const appConfig = require('../config');


module.exports = function createContentRouter({
  hubContentService,
  logger,
  requestClient = request,
}) {
  const router = express.Router();

  router.get('/:id', async (req, res, next) => {
    logger.info(`GET /${req.params.id}`);

    const config = {
      content: true,
      header: false,
      postscript: false,
    };

    try {
      const data = await hubContentService.contentFor(req.params.id);
      const type = prop('type', data);

      switch (type) {
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
          let stream;

          if (appConfig.production) {
            const urlRegex = /^https?:\/\/[^/]+/;
            const url = data.url.replace(urlRegex, appConfig.hubEndpoint);
            logger.debug('PROD - Sending PDF to client from:', url);
            stream = requestClient.get(url);
          } else {
            logger.debug('Sending PDF to client from:', data.url);
            stream = requestClient.get(data.url);
          }

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
