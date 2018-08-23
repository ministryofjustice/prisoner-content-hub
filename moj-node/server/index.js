const createApp = require('./app');
const logger = require('../log');
const config = require('./config');
const appInfoService = require('./services/appInfo');
const createDemoDataService = require('./services/demoDataService');
const createMenuService = require('./services/menuService');
const createHubFeaturedContentService = require('./services/hubFeaturedContent');
const HubClient = require('./clients/hub');
const featuredContentRepository = require('./repositories/hubFeaturedContent');

const buildInfo = config.dev ? null : require('../build-info.json'); // eslint-disable-line import/no-unresolved

// pass in dependencies of service
const demoDataService = createDemoDataService();
const menuService = createMenuService({});

const hubFeaturedContentService = createHubFeaturedContentService(
  featuredContentRepository(
    new HubClient(),
  ),
);

const app = createApp({
  logger,
  demoDataService,
  menuService,
  appInfo: appInfoService(buildInfo),
  hubFeaturedContentService,
});

module.exports = app;
