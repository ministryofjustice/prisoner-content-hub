const { path } = require('ramda');
const express = require('express');

const createFeedbackRouter = ({ feedbackService, logger }) => {
  const router = express.Router();

  router.post('/:feedbackId', (req, res) => {
    logger.info('GET /feedback');

    const sessionId = path(['session', 'id'], req);

    feedbackService.sendFeedback({
      title: path(['body', 'title'], req),
      url: path(['body', 'url'], req),
      contentType: path(['body', 'contentType'], req),
      feedbackId: path(['params', 'feedbackId'], req),
      series: path(['body', 'series'], req),
      sentiment: path(['body', 'sentiment'], req),
      comment: path(['body', 'comment'], req),
      date: new Date().toISOString(),
      establishment: path(
        ['app', 'locals', 'config', 'establishmentName'],
        req,
      ).toUpperCase(),
      sessionId,
    });

    return res.status(200).send();
  });

  return router;
};

module.exports = {
  createFeedbackRouter,
};
