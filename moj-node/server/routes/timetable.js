const express = require('express');
const { path } = require('ramda');
const { format, addDays, subDays } = require('date-fns');

module.exports = function Home({ logger, offenderService }) {
  const router = express.Router();

  router.get('/', async (req, res, next) => {
    try {
      logger.info('GET timetable');

      const today = new Date();
      const startDate = format(today, 'yyyy-MM-dd');
      const endDate = format(addDays(today, 6), 'yyyy-MM-dd');
      const notification = path(['session', 'notification'], req);
      const userName = path(['session', 'user', 'name'], req);
      const bookingId = path(['session', 'user', 'bookingId'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const matomoUrl = path(['app', 'locals', 'config', 'matomoUrl'], req);

      const events = await Promise.all([
        offenderService.getEventsFor(bookingId, startDate, endDate),
      ]);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: false,
        nextWeek: false,
        userName,
        newDesigns,
        matomoUrl,
      };

      res.render('pages/timetable', {
        title: 'Timetable',
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

      const today = new Date();
      const notification = path(['session', 'notification'], req);
      const yesterday = subDays(today, 1);
      const startDate = format(subDays(today, 7), 'yyyy-MM-dd');
      const endDate = format(yesterday, 'yyyy-MM-dd');
      const userName = path(['session', 'user', 'name'], req);
      const bookingId = path(['session', 'user', 'bookingId'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const matomoUrl = path(['app', 'locals', 'config', 'matomoUrl'], req);

      const events = await Promise.all([
        offenderService.getEventsFor(bookingId, startDate, endDate),
      ]);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: true,
        nextWeek: false,
        userName,
        newDesigns,
        matomoUrl,
      };

      res.render('pages/timetable', {
        title: 'Timetable',
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

      const today = new Date();
      const notification = path(['session', 'notification'], req);
      const nextWeekStart = addDays(today, 7);
      const startDate = format(nextWeekStart, 'yyyy-MM-dd');
      const endDate = format(addDays(nextWeekStart, 6), 'yyyy-MM-dd');
      const userName = path(['session', 'user', 'name'], req);
      const bookingId = path(['session', 'user', 'bookingId'], req);
      const newDesigns = path(['locals', 'features', 'newDesigns'], res);
      const matomoUrl = path(['app', 'locals', 'config', 'matomoUrl'], req);

      const events = await Promise.all([
        offenderService.getEventsFor(bookingId, startDate, endDate),
      ]);

      const config = {
        content: false,
        header: false,
        postscript: true,
        detailsType: 'small',
        lastWeek: false,
        nextWeek: true,
        userName,
        newDesigns,
        matomoUrl,
      };

      res.render('pages/timetable', {
        title: 'Timetable',
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
