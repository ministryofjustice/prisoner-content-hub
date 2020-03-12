const request = require('supertest');
const cheerio = require('cheerio');

const createTopicsRouter = require('../../server/routes/topics');
const { setupBasicApp, logger, consoleLogError } = require('../test-helpers');

describe('GET /topics', () => {
  let hubMenuService;
  let router;
  let app;

  beforeEach(() => {
    hubMenuService = {
      allTopics: sinon.stub().returns([
        { linkText: 'foo', href: '/content/foo' },
        { linkText: 'bar', href: '/content/bar' },
      ]),
    };
  });

  describe('Topics', () => {
    beforeEach(() => {
      router = createTopicsRouter({
        logger,
        hubMenuService,
      });

      app = setupBasicApp();
      app.use((req, res, next) => {
        req.session = {};
        next();
      });
      app.use(router);
      app.use(consoleLogError);
    });

    it('has a search bar', () => {
      return request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('#search-wrapper').length).to.equal(1);
        });
    });

    it('renders a list of tags', () => {
      return request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const topics = $('.hub-topics dl dt');
          expect(topics.length).to.equal(
            2,
            'The full list of topics should be rendered to the page',
          );
          expect(
            topics
              .first()
              .find('a')
              .text(),
          ).to.contain('foo', 'The correct topic label should be rendered');
          expect(
            topics
              .first()
              .find('a')
              .attr('href'),
          ).to.contain(
            '/content/foo',
            'The correct topic link should be rendered',
          );
        });
    });
  });
});
