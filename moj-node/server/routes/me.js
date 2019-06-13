const express = require('express');

module.exports = function createMeRouter({ logger, offenderService }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/:offenderNo?', async (req, res, next) => {
    logger.info('GET /me');

    try {
      const { offenderNo = 'G0653GG' } = req.params;
      const [iePSummary, balances, keyWorker] = await Promise.all([
        offenderService.getIEPSummaryFor(offenderNo),
        offenderService.getBalancesFor(offenderNo),
        offenderService.getKeyWorkerFor(offenderNo),
      ]);

      return res.render('pages/me', {
        data: {
          title: 'Your essential prison information',
          iePSummary,
          balances,
          keyWorker,
        },
        config,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
