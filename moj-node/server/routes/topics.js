const express = require('express');
const { path } = require('ramda');

module.exports = function Topics({ logger, hubMenuService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const { establishmentId } = req.app.locals.envVars;
      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);

      const [tagsMenu, homepageMenu] = await Promise.all([
        hubMenuService.tagsMenu(),
        hubMenuService.homepageMenu(establishmentId),
      ]);

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
        tagsMenu,
        homepageMenu,
        config,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
