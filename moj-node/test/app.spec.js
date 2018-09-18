const request = require('supertest');

const createApp = require('../server/app');
const config = require('../server/config');

const appInfo = {
  getBuildInfo: sinon.stub(),
};

const logger = {
  info: sinon.stub(),
  error: sinon.stub(),
  debug: sinon.stub(),
  warn: sinon.stub(),
};

const hubPromotedContentService = {
  hubPromotedContent: sinon.stub().returns([]),
};

const hubFeaturedContentService = {
  hubFeaturedContent: sinon.stub().returns({}),
};
const hubMenuService = {
  menu: sinon.stub(),
};
const hubContentService = {
  contentFor: sinon.stub().returns({}),
};

describe('App', () => {
  it('renders a 404 page correctly on invalid url', () => request(app())
    .get('/unknown-url')
    .expect(404)
    .then((res) => {
      expect(res.text).to.contain('The page you are looking for could not be found');
    }));

  it('hides the stack trace on error pages', () => {
    const error = new Error('broken kittens');
    hubMenuService.menu.rejects(error);
    config.dev = false;

    return request(app())
      .get('/')
      .expect(500)
      .then((res) => {
        expect(res.text).to.contain('Something went wrong.');
        expect(res.text).to.contain('<code></code>', 'The code block is not empty');
      });
  });

  it('shows the stack trace on error pages', () => {
    const error = new Error('Broken kittens');
    hubMenuService.menu.rejects(error);
    config.dev = true;

    return request(app())
      .get('/')
      .expect(500)
      .then((res) => {
        expect(res.text).to.contain('Broken kittens');
        expect(res.text).to.not.contain('Something went wrong.');
        expect(res.text).to.not.contain('<code></code>', 'The code block should not be empty');
        expect(res.text).to.contain('at Context.it', 'there should be an error in the code block');

        // restore stub
        hubMenuService.menu = sinon.stub();
      });
  });

  it('contains the correct security headers per request', () => request(app())
    .get('/')
    .expect(200)
    .then((res) => {
      expect(res.headers).to.have.property('x-dns-prefetch-control');
      expect(res.headers).to.have.property('x-frame-options');
      expect(res.headers).to.have.property('x-download-options');
      expect(res.headers).to.have.property('x-content-type-options');
      expect(res.headers).to.have.property('x-xss-protection');
    }));
});


function app() {
  return createApp({
    appInfo,
    logger,
    hubPromotedContentService,
    hubFeaturedContentService,
    hubMenuService,
    hubContentService,
  });
}
