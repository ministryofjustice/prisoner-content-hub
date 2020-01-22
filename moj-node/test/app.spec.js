const request = require('supertest');

const createApp = require('../server/app');
const config = require('../server/config');
const { logger } = require('./test-helpers');

describe('App', () => {
  const originalConfig = { ...config };
  beforeEach(() => {
    config.mockAuth = 'true';
  });
  afterEach(() => {
    config.mockAuth = originalConfig.mockAuth;
  });

  it('renders a 404 page correctly on invalid url', () =>
    request(app())
      .get('/unknown-url')
      .expect(404)
      .then(res => {
        expect(res.text).to.contain(
          'The page you are looking for could not be found',
        );
      }));

  it('hides the stack trace on error pages', () => {
    const error = new Error('broken kittens');
    const copy = config.dev;

    config.dev = false;
    request(
      app({
        hubPromotedContentService: {
          hubPromotedContent: sinon.stub().returns(error),
        },
        hubMenuService: {
          tagsMenu: sinon.stub(),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(response => {
        expect(response.text).to.contain(
          'Sorry, there is a problem with this service',
        );
        expect(response.text).to.contain(
          '<code></code>',
          'The code block is not empty',
        );
        // restore config
        config.dev = copy;
      });
  });

  it('shows the stack trace on error pages', () => {
    const error = new Error('Broken kittens');
    const copy = config.dev;

    config.dev = true;

    return request(
      app({
        hubFeaturedContentService: {
          hubFeaturedContent: sinon.stub().rejects(error),
        },
        offenderService: {
          getEventsForToday: sinon.stub(),
          getEventsFor: sinon.stub(),
        },
      }),
    )
      .get('/')
      .expect(500)
      .then(res => {
        expect(res.text).to.contain('Broken kittens');
        expect(res.text).to.not.contain(
          'Sorry, there is a problem with this service',
        );
        expect(res.text).to.not.contain(
          '<code></code>',
          'The code block should not be empty',
        );
        expect(res.text).to.contain(
          'at Context.',
          'there should be an error in the code block',
        );

        // restore config
        config.dev = copy;
      });
  });

  it('contains the correct security headers per request', () =>
    request(app())
      .get('/')
      .then(res => {
        expect(res.headers).to.have.property('x-dns-prefetch-control');
        expect(res.headers).to.have.property('x-frame-options');
        expect(res.headers).to.have.property('x-download-options');
        expect(res.headers).to.have.property('x-content-type-options');
        expect(res.headers).to.have.property('x-xss-protection');
      }));
});

function app(opts) {
  const services = {
    appInfo: sinon.stub(),
    hubPromotedContentService: { hubPromotedContent: sinon.stub().returns([]) },
    hubFeaturedContentService: { hubFeaturedContent: sinon.stub().returns([]) },
    hubMenuService: {
      navigationMenu: sinon.stub().returns({ mainMenu: [], topicsMenu: [] }),
      seriesMenu: sinon.stub().returns([]),
    },
    hubContentService: { contentFor: sinon.stub().returns({}) },
    searchService: { find: sinon.stub() },
    logger,
    ...opts,
  };
  return createApp(services);
}
