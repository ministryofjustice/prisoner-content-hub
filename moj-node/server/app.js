const express = require('express');
const addRequestId = require('express-request-id')();
const csurf = require('csurf');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const log = require('bunyan-request-logger')();
const nunjucks = require('nunjucks');
const path = require('path');
const sassMiddleware = require('node-sass-middleware');

const config = require('../server/config');
const logger = require('../log.js');

const createMenuRouter = require('./routes/menu');
const createIndexRouter = require('./routes/index');
const createHealthRouter = require('./routes/health');

const topicLinks = require('./data/topic-link.json');

const version = Date.now().toString();

module.exports = function createApp({
  appInfo,
  demoDataService,
  menuService,
}) { // eslint-disable-line no-shadow
  const app = express();

  // View Engine Configuration
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');
  nunjucks.configure('server/views', {
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

  app.use(cookieSession({
    name: 'session',
    keys: [config.sessionSecret],
    maxAge: 60 * 60 * 1000,
    secure: config.https,
    httpOnly: true,
    signed: true,
    overwrite: true,
    sameSite: 'lax',
  }));

  // Request Processing Configuration
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

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

  if (config.production) {
    app.use('/public', sassMiddleware({
      src: path.join(__dirname, '../assets/sass'),
      dest: path.join(__dirname, '../assets/stylesheets'),
      debug: true,
      outputStyle: 'compressed',
      prefix: '/stylesheets/',
      includePaths: [
        'node_modules/govuk_frontend_toolkit/stylesheets',
        'node_modules/govuk_template_jinja/assets/stylesheets',
        'node_modules/govuk-elements-sass/public/sass',
      ],
    }));
  }

  //  Static Resources Configuration
  const cacheControl = { maxAge: config.staticResourceCacheDuration * 1000 };

  [
    '../public',
    '../assets',
    '../assets/stylesheets',
    '../node_modules/govuk_template_jinja/assets',
    '../node_modules/govuk_frontend_toolkit',
    '../node_modules/govuk-frontend/',
  ].forEach((dir) => {
    app.use('/public', express.static(path.join(__dirname, dir), cacheControl));
  });


  app.use('/assets', express.static(path.join(__dirname, '../node_modules/govuk-frontend/assets'), cacheControl));

  [
    '../node_modules/govuk_frontend_toolkit/images',
  ].forEach((dir) => {
    app.use('/public/images/icons', express.static(path.join(__dirname, dir), cacheControl));
  });

  // GovUK Template Configuration
  app.locals.asset_path = '/public/';

  // Temporary menu
  app.use((req, res, next) => {
    res.locals.navMenu = topicLinks;
    next();
  });

  function addTemplateVariables(req, res, next) {
    res.locals.user = req.user;
    next();
  }

  app.use(addTemplateVariables);

  // Don't cache dynamic resources
  app.use(helmet.noCache());


  // CSRF protection
  app.use(cookieParser());
  app.use(csurf({ cookie: true }));

  // Routing
  app.use('/', createIndexRouter({ logger, demoDataService }));
  app.use('/menu', createMenuRouter({ logger, menuService }));
  app.use('/health', createHealthRouter({ appInfo }));

  app.use(handleKnownErrors);
  app.use(renderErrors);

  return app;
};

// eslint-disable-next-line no-unused-vars
function handleKnownErrors(err, req, res, next) {
  logger.error(err);
  // code to handle errors
}

// eslint-disable-next-line no-unused-vars
function renderErrors(err, req, res, next) {
  logger.error(err);

  // code to handle unknown errors

  res.locals.error = err;
  res.locals.stack = config.production ? null : err.stack;
  res.locals.message = config.production
    ? 'Something went wrong. The error has been logged. Please try again' : err.message;

  res.status(err.status || 500);

  res.render('pages/error');
}
