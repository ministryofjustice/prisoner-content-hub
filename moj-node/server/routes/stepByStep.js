const express = require('express');

module.exports = function createStepByStepRouter({ logger }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET /step-by-step');

    return res.render('pages/step-by-step', {
      data: {
        title: 'step-by-step',
      },
    });
  });

  router.get('/side-bar', (req, res) => {
    logger.info('GET /step-by-step-side-bar');

    return res.render('pages/step-by-step-side-bar', {
      data: {
        title: 'step-by-step-side-bar',
      },
    });
  });

  return router;
};
