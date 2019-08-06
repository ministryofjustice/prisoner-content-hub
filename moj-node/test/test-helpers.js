const express = require('express');
const path = require('path');
const nunjucks = require('nunjucks');
const chance = require('chance')();

function setupBasicApp() {
  const app = express();
  app.set('views', path.join(__dirname, '../server/views'));
  app.set('view engine', 'html');

  const appViews = [
    path.join(__dirname, '../node_modules/govuk-frontend/'),
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

function createFeaturedItem() {
  return {
    id: chance.integer({ min: 1, max: 100 }),
    title: chance.profession({ rank: true }),
    contentType: chance.pickone(['radio', 'video', 'pdf', 'article']),
    summary: chance.paragraph({ sentences: 1 }),
    image: {
      alt: chance.word(),
      url: chance.avatar({ fileExtension: 'jpg' }),
    },
    duration: `${chance.minute()}:${chance.second()}`,
    contentUrl: `/content/${chance.integer()}`,
  };
}

function consoleLogError(err, req, res) {
  console.error(err.stack); // eslint-disable-line no-console
  res.status(500).send('Something broke!');
}

module.exports = {
  setupBasicApp,
  logger,
  createFeaturedItem,
  consoleLogError,
};
