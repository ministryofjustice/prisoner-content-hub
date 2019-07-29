const express = require('express');
const { format } = require('date-fns');
const { authMiddleware, createUserSession } = require('../middleware/auth');

module.exports = function createMeRouter({ logger, offenderService }) {
  const router = express.Router();

  const config = {
    content: false,
    header: false,
    postscript: false,
  };

  router.use(authMiddleware(), createUserSession({ offenderService }));

  router.get('/', async (req, res, next) => {
    logger.info('GET /me');

    if (!req.session.user) {
      return res.redirect('/');
    }

    const today = format(new Date(), 'dddd D MMMM');

    try {
      const { offenderNo, bookingId } = req.session.user;

      const [
        iePSummary,
        balances,
        keyWorker,
        visits,
        importantDates,
        todaysEvents,
      ] = await Promise.all([
        offenderService.getIEPSummaryFor(bookingId),
        offenderService.getBalancesFor(bookingId),
        offenderService.getKeyWorkerFor(offenderNo),
        offenderService.getVisitsFor(bookingId),
        offenderService.getImportantDatesFor(bookingId),
        offenderService.getEventsForToday(bookingId),
      ]);

      return res.render('pages/me', {
        data: {
          title: 'Your essential prison information',
          iePSummary,
          balances,
          keyWorker,
          visits,
          importantDates,
          todaysEvents,
        },
        config,
        today,
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
};
