const express = require('express');

module.exports = function createStepByStepRouter({ logger }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };
  
  //**** new page route for step by step

  router.get('/step-by-step', (req, res) => {
    logger.info('GET /step-by-step');

    return res.render('pages/step-by-step', {
      data: {
        title: 'step-by-step',
      },
    });
  });

  //****

  //**** new page route for step by step navigtion page 

  router.get('/step-by-step-side-bar', (req, res) => {
    logger.info('GET /step-by-step-side-bar');

    return res.render('pages/step-by-step-side-bar', {
      data: {
        title: 'step-by-step-side-bar',
      },
    });
  });

  //****

  return router;
};
