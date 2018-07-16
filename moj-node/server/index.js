const createApp = require('./app');
const logger = require('../log');
const config = require('./config');
const contentClient = require('./data/contentClient');
const appInfoService = require('./services/appInfo');
const createDemoDataService = require('./services/demoDataService');
const createMenuService = require('./services/menuService');

const buildInfo = config.dev ? null : require('../build-info.json'); // eslint-disable-line import/no-unresolved

// pass in dependencies of service
const demoDataService = createDemoDataService();
const menuService = createMenuService(contentClient);

const app = createApp({
  logger,
  demoDataService,
  menuService,
  appInfo: appInfoService(buildInfo),
});

module.exports = app;
