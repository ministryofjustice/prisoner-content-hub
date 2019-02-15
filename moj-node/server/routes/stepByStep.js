const express = require('express');
const brewynSbSMenu = require('../data/berwyn-step-by-step.json');

module.exports = function createStepByStepRouter({ logger }) {
  const router = express.Router();

  router.get('/', (req, res) => {
    logger.info('GET /step-by-step');

    return res.render('pages/step-by-step', {
      data: {
        title: 'Working in Berwyn',
        menu: brewynSbSMenu,
      },
    });
  });

  router.get('/:id', (req, res) => {
    logger.info(`GET /step-by-step/${req.params.id}`);

    return res.render('pages/step-by-step-content', {
      data: {
        title: 'step-by-step-side-bar',
        menu: brewynSbSMenu,
      },
    });
  });

  return router;
};
