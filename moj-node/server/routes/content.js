const { prop } = require('ramda');
const express = require('express');

module.exports = function createContentRouter({
  hubContentService,
  logger,
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
        case 'page':
          return res.render('pages/flat-content', {
            data,
            backHomeEnabled: true,
          });
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
