const express = require('express');

module.exports = function Topics({ logger, hubMenuService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET index');

      const { establishmentId } = req.app.locals.envVars;
      const { notification } = req.session;

      const [tagsMenu, homepageMenu] = await Promise.all([
        hubMenuService.tagsMenu(),
        hubMenuService.homepageMenu(establishmentId),
      ]);

      const config = {
        header: true,
      };

      res.render('pages/topics', {
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
