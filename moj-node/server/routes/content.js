const { prop, path } = require('ramda');
const express = require('express');
const { relativeUrlFrom } = require('../utils');

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

    const notification = path(['session', 'notification'], req);
    const userName = path(['session', 'user', 'name'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);

    const config = {
      content: true,
      header: false,
      postscript: false,
      newDesigns,
      userName,
    };

    const establishmentId = path(['locals', 'establishmentId'], res);
    const backendUrl = path(['app', 'locals', 'config', 'backendUrl'], req);

    try {
      const data = await hubContentService.contentFor(id, establishmentId);
      const contentType = prop('contentType', data);
      const sessionId = path(['session', 'id'], req);

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
            data,
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
            data,
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
            data,
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
            data,
            notification,
          });
        case 'pdf': {
          const url = relativeUrlFrom(data.url, backendUrl);
          logger.info('PROD - Sending PDF to client from:', url);

          analyticsService.sendEvent({
            category: 'PDFs',
            action: `${data.title}`,
            label: 'Downloads',
            sessionId,
            value: 1,
          });

          const stream = await hubContentService.streamFor(url);

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

module.exports = {
  createContentRouter,
};
