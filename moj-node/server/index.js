const createApp = require('./app');
const logger = require('../log');
const config = require('./config');

const HubClient = require('./clients/hub');
const StandardClient = require('./clients/standard');
const NomisClient = require('./clients/nomisClient');

// Services
const appInfoService = require('./services/appInfo');
const createHubMenuService = require('./services/hubMenu');
const createHubFeaturedContentService = require('./services/hubFeaturedContent');
const createHubPromotedContentService = require('./services/hubPromotedContent');
const createHubContentService = require('./services/hubContent');
const createHealthService = require('./services/health');
const createHubTagsService = require('./services/hubTags');
const createNomisOffenderService = require('./services/offender');

// Repositories
const featuredContentRepository = require('./repositories/hubFeaturedContent');
const categoryFeaturedContentRepository = require('./repositories/categoryFeaturedContent');
const promotedContentRepository = require('./repositories/hubPromotedContent');
const hubMenuRepository = require('./repositories/hubMenu');
const contentRepository = require('./repositories/hubContent');
const offenderRepository = require('./repositories/offender');

const buildInfo = config.dev ? null : require('../build-info.json'); // eslint-disable-line import/no-unresolved

// Connect services with repositories
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
const offenderService = createNomisOffenderService(
  offenderRepository(new NomisClient()),
);

const app = createApp({
  appInfo: appInfoService(buildInfo),
  healthService: createHealthService(new StandardClient()),
  logger,
  hubFeaturedContentService,
  hubPromotedContentService,
  hubMenuService,
  hubContentService,
  hubTagsService,
  offenderService,
});

module.exports = app;
