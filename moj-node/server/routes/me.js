const express = require('express');

module.exports = function createMeRouter({ logger, offenderService }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.get('/', async (req, res, next) => {
    logger.info('GET /me');

    if (!req.session.user) {
      return res.redirect('/');
    }

    try {
      const { offenderNo, bookingId } = req.session.user;

      const [
        iePSummary,
        balances,
        keyWorker,
        visits,
        importantDates,
      ] = await Promise.all([
        offenderService.getIEPSummaryFor(bookingId),
        offenderService.getBalancesFor(bookingId),
        offenderService.getKeyWorkerFor(offenderNo),
        offenderService.getVisitsFor(bookingId),
        offenderService.getImportantDatesFor(bookingId),
      ]);

      return res.render('pages/me', {
        data: {
          title: 'Your essential prison information',
          iePSummary,
          balances,
          keyWorker,
          visits,
          importantDates,
        },
        config,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
