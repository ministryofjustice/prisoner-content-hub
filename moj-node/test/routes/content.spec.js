const request = require('supertest');
const cheerio = require('cheerio');

const createHubContentRouter = require('../../server/routes/content');
const { setupBasicApp, logger } = require('../test-helpers');


describe('GET /content/:id', () => {
  describe('radio content', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns({
        type: 'radio',
        title: 'Foo title',
        description: {
          sanitized: '<p>Bar body</p>',
        },
        media: 'foo.mp3',
        thumbnail: {
          alt: 'Foo Bar',
          url: 'foo.png',
        },
      }),
    };

    it('returns the correct content for a radio page', () => {
      const router = createHubContentRouter({ logger, hubContentService });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(200)
        .then((response) => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.equal('Foo title', 'Page title did not match');
          expect($('#body').text()).to.equal('Bar body', 'Page body did not match');
          expect($('#my-player > source').attr('src')).to.equal('foo.mp3', 'Page media did not match');
          expect($('#thumbnail').attr('src')).to.equal('foo.png', 'Page thumbnail src did not match');
          expect($('#thumbnail').attr('alt')).to.equal('Foo Bar', 'Page thumbnail alt did not match');
        });
    });
  });

  describe('flat page content', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns({
        id: 3491,
        title: 'Foo article',
        type: 'page',
        body: {
          sanitized: '<p>Foo article body</p>',
        },
        standFirst: 'Foo article stand first',
      }),
    };

    it('returns the correct content for a flat content page page', () => {
      const router = createHubContentRouter({ logger, hubContentService });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(200)
        .then((response) => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.include('Foo article', 'Page title did not match');
          expect($('#stand-first').text()).to.include('Foo article stand first', 'Article stand first did not match');
          expect($('#body').text()).to.include('Foo article body', 'Article body did not match');
        });
    });

    it('returns a 404 when incorrect data is returned', () => {
      const invalidService = {
        contentFor: () => ({ type: 'invalid' }),
      };
      const router = createHubContentRouter({ logger, hubContentService: invalidService });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(404);
    });
  });
});
