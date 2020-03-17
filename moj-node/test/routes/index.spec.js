const request = require('supertest');
const cheerio = require('cheerio');

const { createIndexRouter } = require('../../server/routes/index');
const { setupBasicApp, logger, consoleLogError } = require('../test-helpers');

describe('GET /', () => {
  let featuredItem;
  let hubFeaturedContentService;
  let router;
  let app;

  beforeEach(() => {
    featuredItem = {
      title: 'foo title',
      contentType: 'foo',
      summary: 'foo summary',
      contentUrl: `/content/foo`,
      isSeries: false,
      image: {
        alt: 'Foo image alt text',
        url: 'image.url.com',
      },
    };

    const setIdWith = item => id => {
      return { ...item, id };
    };

    const featuredItemWithId = setIdWith(featuredItem);

    hubFeaturedContentService = {
      hubFeaturedContent: sinon.stub().returns({
        featured: [
          {
            upperFeatured: featuredItemWithId('large'),
            lowerFeatured: featuredItemWithId('large'),
            smallTiles: new Array(4).fill(featuredItemWithId('small')),
          },
        ],
      }),
    };
  });

  describe('Homepage', () => {
    beforeEach(() => {
      router = createIndexRouter({
        logger,
        hubFeaturedContentService,
      });

      app = setupBasicApp();
      app.use(
        (req, res, next) => {
          // TODO: Remove this when new designs implemented fully in template
          res.locals = {
            features: { newDesigns: true },
          };
          next();
        },
        (req, res, next) => {
          req.session = {};
          next();
        },
      );
      app.use(router);
      app.use(consoleLogError);
    });

    it('renders featured content', () => {
      return request(app)
        .get('/')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('[data-featured-tile-id="small"]').length).to.equal(
            4,
            '4 small featured items should be rendered',
          );
          expect($('[data-featured-tile-id="large"]').length).to.equal(
            2,
            '2 large featured items should be rendered',
          );
          expect(
            $('[data-featured-tile-id="small"]')
              .first()
              .find('h3')
              .text(),
          ).to.include('foo title', 'Correct title rendered (Small Tile)');
          expect(
            $('[data-featured-tile-id="large"]')
              .first()
              .find('h3')
              .text(),
          ).to.include('foo title', 'Correct title rendered (Large Tile)');
          expect(
            $('[data-featured-tile-id="large"]')
              .first()
              .find('p')
              .text(),
          ).to.include(
            'foo summary',
            'Correct description rendered (Large Tile)',
          );
          expect(
            $('[data-featured-tile-id="small"]')
              .first()
              .find('img')
              .attr('src'),
          ).to.include('image.url.com', 'Correct image rendered (Small Tile)');
          expect(
            $('[data-featured-tile-id="large"]')
              .first()
              .find('img')
              .attr('src'),
          ).to.include('image.url.com', 'Correct image rendered (Large Tile)');
        });
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

    it('renders the popular topics menu', () => {
      return request(app)
        .get('/')
        .then(response => {
          const $ = cheerio.load(response.text);

          expect(
            $('div.popular-topics')
              .first()
              .find('h3')
              .text(),
          ).to.equal('Popular topics');
          expect(
            $('div.popular-topics')
              .first()
              .find('ul li').length,
          ).to.equal(9, 'Correct number of menu items');
        });
    });
  });
});
