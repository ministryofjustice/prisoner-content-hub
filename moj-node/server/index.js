const createApp = require('./app');
const logger = require('../log');

const contentClient = require('./data/contentClient');
const createDemoDataService = require('./services/demoDataService');
const createMenuService = require('./services/menuService');

// pass in dependencies of service
const demoDataService = createDemoDataService();
const menuService = createMenuService(contentClient);

const app = createApp({
  logger,
  demoDataService,
  menuService,
});

module.exports = app;
