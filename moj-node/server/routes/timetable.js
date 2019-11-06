const express = require('express');
const { path } = require('ramda');
const { format, addDays, subDays } = require('date-fns');

module.exports = function Home({ logger, offenderService }) {
  const today = new Date();
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET timetable');

      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(addDays(today, 6), 'yyyy-MM-dd');

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
        lastWeek: false,
        nextWeek: false,
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

  router.get('/lastweek', async (req, res, next) => {
    try {
      logger.info('GET timetable/lastweek');

      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const yesterday = subDays(today, 1);
      const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      const endDate = format(yesterday, 'yyyy-MM-dd');

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
        lastWeek: true,
        nextWeek: false,
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

  router.get('/nextweek', async (req, res, next) => {
    try {
      logger.info('GET timetable/nextweek');

      const { notification } = req.session;
      const userDetails = path(['session', 'user'], req);
      const bookingId = path(['bookingId'], userDetails);
      const nextWeekStart = addDays(today, 7);
      const startDate = format(nextWeekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(nextWeekStart, 6), 'yyyy-MM-dd');

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
        lastWeek: false,
        nextWeek: true,
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
