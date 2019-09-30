// eslint-disable-next-line import/order
const config = require('../server/config');

const express = require('express');
const addRequestId = require('express-request-id')();
const compression = require('compression');
const helmet = require('helmet');
const log = require('bunyan-request-logger')({ name: config.appName });
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');
const session = require('cookie-session');

const createIndexRouter = require('./routes/index');
const createHomeRouter = require('./routes/home');
const createHealthRouter = require('./routes/health');
const createContentRouter = require('./routes/content');
const createTagRouter = require('./routes/tags');
const createGamesRouter = require('./routes/games');
const createGettingAJobRouter = require('./routes/gettingAJob');
const createMeRouter = require('./routes/me');
const createSearchRouter = require('./routes/search');

const featureToggleMiddleware = require('./middleware/featureToggle');
const establishmentToggle = require('./middleware/establishmentToggle');
const { authMiddleware, createUserSession } = require('./middleware/auth');

const { getEstablishmentId } = require('./utils');

const version = Date.now().toString();

module.exports = function createApp({
  appInfo,
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
  healthService,
  offenderService,
  searchService,
}) {
  const app = express();

  const appViews = [
    path.join(__dirname, '../node_modules/govuk-frontend/'),
    path.join(__dirname, '/views/'),
  ];

  // View Engine Configuration
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');
  nunjucks.configure(appViews, {
    express: app,
    autoescape: true,
  });

  app.set('json spaces', 2);

  // Configure Express for running behind proxies
  // https://expressjs.com/en/guide/behind-proxies.html
  app.set('trust proxy', true);

  // Server Configuration
  app.set('port', process.env.PORT || 3000);

  // Secure code best practice - see:
  // 1. https://expressjs.com/en/advanced/best-practice-security.html,
  // 2. https://www.npmjs.com/package/helmet
  app.use(helmet());

  app.use(addRequestId);

  app.use(log.requestLogger());

  // Resource Delivery Configuration
  app.use(compression());

  // Cachebusting version string
  if (config.production) {
    // Version only changes on reboot
    app.locals.version = version;
  } else {
    // Version changes every request
    app.use((req, res, next) => {
      res.locals.version = Date.now().toString();
      return next();
    });
  }

  if (!config.production) {
    app.use(
      '/public',
      sassMiddleware({
        src: path.join(__dirname, '../assets/sass'),
        dest: path.join(__dirname, '../assets/stylesheets'),
        debug: true,
        outputStyle: 'compressed',
        prefix: '/stylesheets/',
      }),
    );
  }

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 };

  app.use(
    session({
      secret: config.cookieSecret,
      resave: false,
      saveUninitialized: true,
      maxAge: 4.32e7, // 12 Hours
    }),
  );

  [
    '../public',
    '../assets',
    '../assets/stylesheets',
    '../node_modules/govuk-frontend/govuk/',
    '../node_modules/jplayer/dist',
    '../node_modules/jquery/dist',
    '../node_modules/mustache',
  ].forEach(dir => {
    app.use('/public', express.static(path.join(__dirname, dir), cacheControl));
  });

  app.use(
    '/assets',
    express.static(
      path.join(__dirname, '../node_modules/govuk-frontend/govuk/assets'),
      cacheControl,
    ),
  );

  // GovUK Template Configuration
  app.locals.asset_path = '/public/';
  app.locals.envVars = {
    MATOMO_URL: config.matomoUrl,
    APP_NAME: config.appName,
    backendUrl: config.backendUrl,
    establishmentId: getEstablishmentId(config.establishmentName),
  };

  // Don't cache dynamic resources
  app.use(helmet.noCache());

  // feature toggles
  app.use(featureToggleMiddleware(config.features));

  // establishment toggle
  if (config.features.prisonSwitch === 'true') {
    app.use(establishmentToggle);
  }

  // Health end point
  app.use('/health', createHealthRouter({ appInfo, healthService }));

  // Routing

  // Authentication
  if (config.features.newDesigns) {
    app.use(authMiddleware(), createUserSession({ offenderService }));
  }

  app.use(
    '/',
    createIndexRouter({
      logger,
      hubFeaturedContentService,
      hubPromotedContentService,
      hubMenuService,
    }),
  );

  if (config.features.newDesigns) {
    app.use(
      '/home',
      createHomeRouter({
        logger,
        hubFeaturedContentService,
        hubPromotedContentService,
        hubMenuService,
        offenderService,
      }),
    );
  }

  app.use(
    '/content',
    createContentRouter({
      logger,
      hubContentService,
    }),
  );

  app.use(
    '/tags',
    createTagRouter({
      logger,
      hubTagsService,
    }),
  );

  app.use('/games', createGamesRouter({ logger }));
  app.use(
    ['/working-in-wayland', '/working-in-berwyn'],
    createGettingAJobRouter({ logger, hubContentService, hubMenuService }),
  );

  app.use('/me', createMeRouter({ logger, offenderService }));
  app.use('/search', createSearchRouter({ logger, searchService }));

  app.use('*', (req, res) => {
    res.status(404);
    res.render('pages/404');
  });

  app.use(renderErrors);

  // eslint-disable-next-line no-unused-vars
  function renderErrors(error, req, res, next) {
    logger.error(error, 'Unhandled error');

    res.status(error.status || 500);

    const locals = {
      message: 'Sorry, there is a problem with this service',
      stack: '',
    };
    if (error.expose || config.dev) {
      locals.message = error.message;
    }
    if (config.dev) {
      locals.stack = error.stack;
      locals.req_id = req.id;
    }

    res.render('pages/error', locals);
  }

  return app;
};
