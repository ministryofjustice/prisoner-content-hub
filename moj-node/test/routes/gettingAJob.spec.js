const request = require('supertest');
const cheerio = require('cheerio');

const createGettingAJobRouter = require('../../server/routes/gettingAJob');
const { setupBasicApp, logger } = require('../test-helpers');

const hubContentService = {
  contentFor: sinon.stub().returns({}),
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

const setPrisonMiddleware = establishmentId => (req, res, next) => {
  req.app.locals = {
    envVars: {
      establishmentId,
    },
  };
  next();
};

xdescribe('GET /working-in-(berwyn|wayland)', () => {
  describe('/', () => {
    const router = createGettingAJobRouter({
      logger,
      hubContentService,
      hubMenuService,
    });
    describe('When in berwyn', () => {
      it('renders the correct heading', () => {
        const app = setupBasicApp();

        app.use(setPrisonMiddleware(792));
        app.use('/getting-a-job', router);

        return request(app)
          .get('/getting-a-job')
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
        app.use('/getting-a-job', router);

        return request(app)
          .get('/getting-a-job')
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
          const body = $('body').text();

          expect(body).to.include('foo-title');
          expect(body).to.include('foo-description');
          expect(body).to.include('foo-link');
          expect(body).to.include('foo-url');
        });
    });
  });

  describe('/getting-a-job/:id', () => {
    describe('when in Berwyn', () => {});
    describe('when in wayland', () => {});
  });
});
