const express = require('express');
const { path } = require('ramda');

const fixUrls = element => {
  const { id, description, href, linkText } = element;
  switch (element.href) {
    case '/content/4201':
      return { id, description, href: '/money', linkText };
    default:
      return { id, description, href, linkText };
  }
};

const createTopicsRouter = ({ logger, hubMenuService, analyticsService }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const userName = path(['session', 'user', 'name'], req);
      const establishmentId = path(['locals', 'establishmentId'], res);
      const sessionId = path(['session', 'id'], req);
      const topics = await hubMenuService.allTopics(establishmentId);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        userName,
        returnUrl: req.originalUrl,
      };
      analyticsService.sendPageTrack({
        hostname: req.hostname,
        page: '/topics',
        title: 'Browse the Content Hub',
        sessionId,
      });

      res.render('pages/topics', {
        title: 'Browse the Content Hub',
        allTopics: topics.map(fixUrls),
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};

module.exports = {
  createTopicsRouter,
};
