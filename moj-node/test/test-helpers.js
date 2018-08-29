const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');

function setupBasicApp() {
  const app = express();
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');
  nunjucks.configure('server/views', {
    express: app,
    autoescape: true,
  });

  return app;
}


const logger = {
  info: sinon.stub(),
  error: sinon.stub(),
};

module.exports = {
  setupBasicApp,
  logger,
};
