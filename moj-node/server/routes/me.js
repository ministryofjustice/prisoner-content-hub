const express = require('express');
const NomisClient = require('../clients/nomisClient');

module.exports = function createMeRouter({ logger }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/', async (req, res, next) => {
    logger.info('GET /me');

    try {
      const client = new NomisClient();
      const result = await client.get();

      return res.render('pages/me', {
        data: {
          title: JSON.stringify(result, null, 2),
        },
        config,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
