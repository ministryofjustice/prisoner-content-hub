const { path } = require('ramda');
const express = require('express');

const createSearchRouter = ({ searchService, analyticsService, logger }) => {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    logger.info('GET /search');

    const establishmentId = path(['locals', 'establishmentId'], res);

    let results = [];
    const query = path(['query', 'query'], req);
    const newDesigns = path(['locals', 'features', 'newDesigns'], res);
    const userName = path(['session', 'user', 'name'], req);
    const sessionId = path(['session', 'id'], req);
    const config = {
      content: false,
      header: false,
      postscript: false,
      detailsType: 'small',
      newDesigns,
      userName,
    };

    try {
      results = await searchService.find({ query, establishmentId });
      analyticsService.sendEvent({
        category: 'Search',
        action: query,
        label: JSON.stringify(results),
        value: results.length,
        sessionId,
      });

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

    const establishmentId = path(['locals', 'establishmentId'], res);
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

module.exports = {
  createSearchRouter,
};
