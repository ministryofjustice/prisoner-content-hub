const { path } = require('ramda');
const express = require('express');

module.exports = function createSearchRouter({ searchService, logger }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /search');

    const establishmentId = path(
      ['app', 'locals', 'envVars', 'establishmentId'],
      req,
    );
    let results = [];
    const query = path(['query', 'query'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const userDetails = path(['session', 'user'], req);
    const config = {
      content: false,
      header: false,
      postscript: false,
      newDesigns,
      detailsType: 'small',
      userName: path(['name'], userDetails),
    };

    try {
      results = await searchService.find({ query, establishmentId });

      return res.render('pages/search', {
        title: 'Search',
        config,
        data: results,
        query,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/suggest', async (req, res) => {
    logger.info('GET /search/suggest');

    const establishmentId = path(
      ['app', 'locals', 'envVars', 'establishmentId'],
      req,
    );
    const query = path(['query', 'query'], req);

    try {
      const results = await searchService.typeAhead({
        query,
        establishmentId,
      });

      return res.json(results);
    } catch (error) {
      return res.status(500).json([]);
    }
  });

  return router;
};
