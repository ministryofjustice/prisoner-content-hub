const request = require('supertest');
const cheerio = require('cheerio');

const { createGettingAJobRouter } = require('../../server/routes/gettingAJob');
const { setupBasicApp, logger } = require('../test-helpers');

const flatContentResponse = require('../resources/flatContentResponse.json');

const hubContentService = {
  contentFor: sinon.stub().returns(flatContentResponse),
};
const hubMenuService = {
  gettingAJobMenu: sinon.stub().returns([
    {
      title: 'foo-title',
      description: 'foo-description',
      links: [
        {
          title: 'foo-link',
          href: 'foo-url',
        },
      ],
    },
  ]),
};

const analyticsService = {
  sendPageTrack: sinon.stub(),
  sendEvent: sinon.stub(),
};

const setPrisonMiddleware = establishmentId => (req, res, next) => {
  res.locals = { establishmentId };
  next();
};

describe('GET /working-in-(berwyn|wayland)', () => {
  const router = createGettingAJobRouter({
    logger,
    hubContentService,
    hubMenuService,
    analyticsService,
  });

  describe('/', () => {
    describe('When in berwyn', () => {
      it('renders the correct heading', () => {
        const app = setupBasicApp();

        app.use(setPrisonMiddleware(792));
        app.use('/working-in-berwyn', router);

        return request(app)
          .get('/working-in-berwyn')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('h1').text()).to.include(
              'Working in Berwyn',
              'Correct title rendered',
            );
          });
      });
    });

    describe('When in wayland', () => {
      it('renders the correct heading', () => {
        const app = setupBasicApp();

        app.use(setPrisonMiddleware(793));
        app.use('/working-in-wayland', router);

        return request(app)
          .get('/working-in-wayland')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('h1').text()).to.include(
              'Working in Wayland',
              'Correct title rendered',
            );
          });
      });
    });
    it('renders a menu on the page', () => {
      const app = setupBasicApp();

      app.use(setPrisonMiddleware(792));
      app.use('/getting-a-job', router);

      return request(app)
        .get('/getting-a-job')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          const body = $('body').html();

          expect(body).to.include('foo-title');
          expect(body).to.include('foo-description');
          expect(body).to.include('foo-link');
          expect(body).to.include('foo-url');
        });
    });
  });

  describe('/:id', () => {
    it('renders content on the page', () => {
      const app = setupBasicApp();

      app.use(setPrisonMiddleware(793));
      app.use('/', router);

      return request(app)
        .get('/some-content-id')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          const content = $('#main-content').text();
          expect(content).to.include('Foo paragraph');
          expect(content).to.include('Some incredible foo stand first');
        });
    });
    describe('when in Berwyn', () => {
      it('renders a sidebar navigation', () => {
        const app = setupBasicApp();

        app.use(setPrisonMiddleware(792));
        app.use('/', router);

        return request(app)
          .get('/some-content-id')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            const sidebar = $('#side-bar').text();
            expect(sidebar).to.include('Working in Berwyn');

            expect(sidebar).to.include('foo-title');
            expect(sidebar).to.include('foo-description');
            expect(sidebar).to.include('foo-link');
          });
      });
    });
    describe('when in wayland', () => {
      it('renders a sidebar navigation', () => {
        const app = setupBasicApp();

        app.use(setPrisonMiddleware(793));
        app.use('/', router);

        return request(app)
          .get('/some-content-id')
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            const sidebar = $('#side-bar').text();
            expect(sidebar).to.include('Working in Wayland');
            expect(sidebar).to.include('foo-title');
            expect(sidebar).to.include('foo-description');
            expect(sidebar).to.include('foo-link');
          });
      });
    });
  });
});
