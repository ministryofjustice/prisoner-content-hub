const express = require('express');
const { path } = require('ramda');
const { format, addDays } = require('date-fns');

const today = new Date();

module.exports = function Home({ logger, offenderService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET timetable');

      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const todayDateString = format(today, 'yyyy-MM-dd');
      const sevenDaysDateString = format(addDays(today, 6), 'yyyy-MM-dd');

      const startDate = todayDateString;
      const endDate = sevenDaysDateString;

      const events = await Promise.all([
        offenderService.getEventsFor(bookingId, startDate, endDate),
      ]);

      const config = {
        content: false,
        header: false,
        postscript: true,
        newDesigns: res.locals.features.newDesigns,
        detailsType: 'small',
        userName: path(['name'], userDetails),
      };

      res.render('pages/timetable', {
        notification,
        config,
        events,
      });
    } catch (exception) {
      next(exception);
    }
  });

  return router;
};
