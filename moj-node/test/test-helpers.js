const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

function setupBasicApp() {
  const app = express();
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');

  const appViews = [
    path.join(__dirname, '../node_modules/govuk-frontend/'),
    path.join(__dirname, '../node_modules/govuk-frontend/components'),
    path.join(__dirname, '../server/views/'),
  ];

  nunjucks.configure(appViews, {
    express: app,
    autoescape: true,
  });

  app.locals.envVars = {};

  return app;
}

const logger = {
  info: sinon.stub(),
  error: sinon.stub(),
  debug: sinon.stub(),
  warn: sinon.stub(),
};

module.exports = {
  setupBasicApp,
  logger,
};
