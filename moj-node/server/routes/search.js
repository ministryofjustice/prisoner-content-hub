const express = require('express');
const bodyParser = require('body-parser');

module.exports = function createSearchRouter({ searchService, logger }) {
  const router = express.Router();

  const viewConfig = {
    content: false,
    header: false,
    postscript: false,
  };

  router.use(bodyParser());

  router.get('/', async (req, res, next) => {
    logger.info('GET /search');

    try {
      let results = [];
      const query = req.query.search;

      if (query) {
        results = await searchService.find({ query, limit: 15 });
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

    try {
      const results = await searchService.typeAhead({
        query: req.params.query,
        limit: 5,
      });
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
