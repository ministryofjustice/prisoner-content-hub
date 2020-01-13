const express = require('express');
const { path } = require('ramda');

module.exports = function Topics({ logger, hubMenuService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const notification = path(['session', 'notification'], req);
      const userDetails = path(['session', 'user'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const establishmentId = path(
        ['app', 'locals', 'envVars', 'establishmentId'],
        req,
      );

      const allTopics = await hubMenuService.allTopics(establishmentId);

      const config = {
        content: false,
        header: false,
        postscript: true,
        newDesigns,
        detailsType: 'small',
        userName: path(['name'], userDetails),
      };

      res.render('pages/topics', {
        title: 'Browse the Content Hub',
        notification,
        allTopics,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
