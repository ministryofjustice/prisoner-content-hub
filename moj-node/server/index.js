const createApp = require('./app');
const logger = require('../log');
const config = require('./config');

const HubClient = require('./clients/hub');
const StandardClient = require('./clients/standard');

const appInfoService = require('./services/appInfo');
const createHubMenuService = require('./services/hubMenu');
const createHubFeaturedContentService = require('./services/hubFeaturedContent');
const createHubPromotedContentService = require('./services/hubPromotedContent');
const createHubContentService = require('./services/hubContent');
const createHealthService = require('./services/health');
const createHubTagsService = require('./services/hubTags');

const featuredContentRepository = require('./repositories/hubFeaturedContent');
const categoryFeaturedContentRepository = require('./repositories/categoryFeaturedContent');
const promotedContentRepository = require('./repositories/hubPromotedContent');
const hubMenuRepository = require('./repositories/hubMenu');
const contentRepository = require('./repositories/hubContent');

const buildInfo = config.dev ? null : require('../build-info.json'); // eslint-disable-line import/no-unresolved

// pass in dependencies of service
const hubMenuService = createHubMenuService(hubMenuRepository(new HubClient()));
const hubFeaturedContentService = createHubFeaturedContentService(
  featuredContentRepository(new HubClient()),
);
const hubPromotedContentService = createHubPromotedContentService(
  promotedContentRepository(new HubClient()),
);

const hubContentService = createHubContentService({
  contentRepository: contentRepository(new HubClient()),
  menuRepository: hubMenuRepository(new HubClient()),
  categoryFeaturedContentRepository: categoryFeaturedContentRepository(
    new HubClient(),
  ),
});

const hubTagsService = createHubTagsService(contentRepository(new HubClient()));

const app = createApp({
  appInfo: appInfoService(buildInfo),
  healthService: createHealthService(new StandardClient()),
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
});

module.exports = app;
