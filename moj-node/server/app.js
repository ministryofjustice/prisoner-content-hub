const express = require('express');
const addRequestId = require('express-request-id')();
const helmet = require('helmet');
const csurf = require('csurf');
const compression = require('compression');
const passport = require('passport');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const createIndexRouter = require('./routes/index');
const sassMiddleware = require('node-sass-middleware');
const moment = require('moment');
const path = require('path');
const log = require('bunyan-request-logger')();
const logger = require('../log.js');

const config = require('../server/config');
const version = moment.now().toString();
const production = process.env.NODE_ENV === 'production';
const testMode = process.env.NODE_ENV === 'test';

module.exports = function createApp({logger, someService}) {
    const app = express();

    app.set('json spaces', 2);

    // Configure Express for running behind proxies
    // https://expressjs.com/en/guide/behind-proxies.html
    app.set('trust proxy', true);

    // View Engine Configuration
    app.set('views', path.join(__dirname, '../server/views'));
    app.set('view engine', 'ejs');

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
        sameSite: 'lax'
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // Request Processing Configuration
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use(log.requestLogger());

    // Resource Delivery Configuration
    app.use(compression());

    // Cachebusting version string
    if (production) {
        // Version only changes on reboot
        app.locals.version = version;
    } else {
        // Version changes every request
        app.use(function(req, res, next) {
            res.locals.version = moment.now().toString();
            return next();
        });
    }

    if (!production) {
        app.use('/public', sassMiddleware({
            src: path.join(__dirname, '../assets/sass'),
            dest: path.join(__dirname, '../assets/stylesheets'),
            debug: true,
            outputStyle: 'compressed',
            prefix: '/stylesheets/',
            includePaths: [
                'node_modules/govuk_frontend_toolkit/stylesheets',
                'node_modules/govuk_template_jinja/assets/stylesheets',
                'node_modules/govuk-elements-sass/public/sass'
            ]
        }));
    }

    //  Static Resources Configuration
    const cacheControl = {maxAge: config.staticResourceCacheDuration * 1000};

    [
        '../public',
        '../assets',
        '../assets/stylesheets',
        '../node_modules/govuk_template_jinja/assets',
        '../node_modules/govuk_frontend_toolkit'
    ].forEach(dir => {
        app.use('/public', express.static(path.join(__dirname, dir), cacheControl));
    });

    [
        '../node_modules/govuk_frontend_toolkit/images'
    ].forEach(dir => {
        app.use('/public/images/icons', express.static(path.join(__dirname, dir), cacheControl));
    });

    // GovUK Template Configuration
    app.locals.asset_path = '/public/';

    function addTemplateVariables(req, res, next) {
        res.locals.user = req.user;
        next();
    }

    app.use(addTemplateVariables);

    // Don't cache dynamic resources
    app.use(helmet.noCache());

    // CSRF protection
    if (!testMode) {
        app.use(csurf());
    }

    //Routing
    app.use('/', createIndexRouter({logger, someService}));

    app.use(handleKnownErrors);
    app.use(renderErrors);

    return app;

};

function handleKnownErrors(error, req, res, next) {
    logger.error(error)
    // code to handle errors
}

function renderErrors(error, req, res, next) {
    logger.error(error);

    // code to handle unknown errors

    res.locals.error = error;
    res.locals.stack = production ? null : error.stack;
    res.locals.message = production ?
        'Something went wrong. The error has been logged. Please try again' : error.message;

    res.status(error.status || 500);

    res.render('error');
}