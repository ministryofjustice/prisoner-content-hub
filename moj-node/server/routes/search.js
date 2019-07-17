const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createSearchRouter({ searchService, logger }) {
  const router = express.Router();

  const viewConfig = {
    content: false,
    header: false,
    postscript: false,
  };

  router.use(bodyParser.json());

  router.get('/', async (req, res, next) => {
    logger.info('GET /search');

    const { establishmentId } = req.app.locals.envVars;

    try {
      let results = [];
      const { query } = req.query;

      if (query) {
        results = await searchService.find({ query, establishmentId });
      }

      return res.render('pages/search', {
        title: 'Search',
        config: viewConfig,
        data: results,
        query,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/suggest/:query', async (req, res, next) => {
    logger.info('GET /search/suggest');

    const { establishmentId } = req.app.locals.envVars;

    try {
      const results = await searchService.typeAhead({
        query: req.params.query,
        establishmentId,
      });
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
