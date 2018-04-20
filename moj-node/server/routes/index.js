const express = require('express');

module.exports = function Index({ logger, someService }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET index');

    const data = someService.getSomeData();

    res.render('pages/index', { data });
  });

  return router;
};
