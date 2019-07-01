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
      return res.render('pages/search', {
        title: 'Search',
        config: viewConfig,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.post('/', async (req, res, next) => {
    logger.info('GET /search');

    try {
      const results = await searchService.find(req.body.search);

      return res.render('pages/search', {
        title: 'Search',
        config: viewConfig,
        data: results,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/suggest/:query', async (req, res, next) => {
    logger.info('GET /search/suggest');

    try {
      const results = await searchService.find(req.params.query);
      return res.json(results);
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
