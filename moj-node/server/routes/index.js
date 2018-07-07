const express = require('express');

module.exports = function Index({ logger, demoDataService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const data = demoDataService.getInspirationData();

    res.render('pages/index', { data });
  });

  return router;
};
