const request = require('supertest');
const cheerio = require('cheerio');

const createHubContentRouter = require('../../server/routes/content');
const { setupBasicApp, logger } = require('../test-helpers');

const radioShowResponse = require('../resources/radioShowServiceResponse.json');
const videoShowResponse = require('../resources/videoShowServiceResponse.json');


describe('GET /content/:id', () => {
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

  describe('radio content', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns(radioShowResponse),
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
          expect($('#body').text()).to.equal('Foo body', 'Page body did not match');
          expect($('#series').text()).to.equal('Foo series', 'Page title did not match');
          expect($('#audioPlayerContainer').attr('data-audio')).to.equal('foo.mp3', 'Page media did not match');
          expect($('#thumbnail').attr('src')).to.equal('foo.png', 'Page thumbnail src did not match');
          expect($('#thumbnail').attr('alt')).to.equal('foo Bar', 'Page thumbnail alt did not match');

          // episodes
          expect($('#next-episodes a').length).to.equal(1, 'The number of next episodes shows don\'t match');
          expect($('#next-episodes a').text()).to.include('Foo episode', 'The episode title doesn\'t match');
          expect($('#episode-thumbnail').attr('style')).to.include('foo.image.png', 'The episode thumbnail doesn\'t match');
        });
    });
  });

  describe('video content', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns(videoShowResponse),
    };

    it('returns the correct content for a video page', () => {
      const router = createHubContentRouter({ logger, hubContentService });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(200)
        .then((response) => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.equal('Baz title', 'Page title did not match');
          expect($('#body').text()).to.equal('Baz body', 'Page body did not match');
          expect($('#series').text()).to.equal('Baz series', 'Page title did not match');
          expect($('#my-player > source').attr('src')).to.equal('baz.mp4', 'Page media did not match');
          expect($('#thumbnail').attr('src')).to.equal('baz.png', 'Page thumbnail src did not match');
          expect($('#thumbnail').attr('alt')).to.equal('baz Bar', 'Page thumbnail alt did not match');

          // episodes
          expect($('#next-episodes a').length).to.equal(1, 'The number of next episodes shows don\'t match');
          expect($('#next-episodes a').text()).to.include('Baz episode', 'The episode title doesn\'t match');
          expect($('#episode-thumbnail').attr('style')).to.include('baz.image.png', 'The episode thumbnail doesn\'t match');
        });
    });
  });

  describe('flat page content', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns({
        id: 3491,
        title: 'Foo article',
        type: 'page',
        description: {
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
  });
});
