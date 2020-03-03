const request = require('supertest');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

const createHubContentRouter = require('../../server/routes/content');
const { setupBasicApp, logger } = require('../test-helpers');

const radioShowResponse = require('../resources/radioShowServiceResponse.json');
const videoShowResponse = require('../resources/videoShowServiceResponse.json');
const flatContentResponse = require('../resources/flatContentResponse.json');

describe('GET /content/:id', () => {
  it('returns a 404 when incorrect data is returned', () => {
    const invalidService = {
      contentFor: () => ({ type: 'invalid' }),
    };
    const router = createHubContentRouter({
      logger,
      hubContentService: invalidService,
    });
    const app = setupBasicApp();

    app.use('/content', router);

    return request(app)
      .get('/content/1')
      .expect(404);
  });

  describe('Radio page', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: sinon.stub().returns(radioShowResponse),
      };

      const router = createHubContentRouter({ logger, hubContentService });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.equal(
            'Foo title',
            'Page title did not match',
          );
          expect($('#body').text()).to.equal(
            'Foo body',
            'Page body did not match',
          );
          expect($('#series').text()).to.equal(
            'Foo series',
            'Page title did not match',
          );
          expect($('#audioPlayer').attr('data-media')).to.equal(
            'foo.mp3',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).to.equal(
            'foo.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).to.equal(
            'foo Bar',
            'Page thumbnail alt did not match',
          );
        });
    });

    it('returns the correct tags for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list > li').length).to.equal(2);
        });
    });

    it('returns the correct episodes for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).to.equal(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).to.include(
            'Foo episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).to.include(
            'foo.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).to.include(
            `/content/${radioShowResponse.season[0].id}`,
            'did not render url',
          );
        });
    });

    it('returns the correct suggestions for a radio page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).to.equal(1);
          expect($('#suggested-content h3').text()).to.include(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });
  });

  describe('Video page', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: sinon.stub().returns(videoShowResponse),
      };

      const router = createHubContentRouter({ logger, hubContentService });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.equal(
            'Baz title',
            'Page title did not match',
          );
          expect($('#body').text()).to.equal(
            'Baz body',
            'Page body did not match',
          );
          expect($('#series').text()).to.equal(
            'Baz series',
            'Page title did not match',
          );
          expect($('#videoPlayerContainer').attr('data-video')).to.equal(
            'baz.mp4',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).to.equal(
            'baz.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).to.equal(
            'baz Bar',
            'Page thumbnail alt did not match',
          );

          // tags
          expect($('#tags-list li').length).to.equal(2);

          // episodes
          expect($('#next-episodes a').length).to.equal(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).to.include(
            'Baz episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).to.include(
            'baz.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).to.include(
            `/content/${videoShowResponse.season[0].id}`,
            'did not render url',
          );

          // suggestions
          expect($('#suggested-content a').length).to.equal(1);
          expect($('#suggested-content h3').text()).to.include(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });

    it('returns the correct content for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.equal(
            'Baz title',
            'Page title did not match',
          );
          expect($('#body').text()).to.equal(
            'Baz body',
            'Page body did not match',
          );
          expect($('#series').text()).to.equal(
            'Baz series',
            'Page title did not match',
          );
          expect($('#videoPlayerContainer').attr('data-video')).to.equal(
            'baz.mp4',
            'Page media did not match',
          );
          expect($('#thumbnail').attr('src')).to.equal(
            'baz.png',
            'Page thumbnail src did not match',
          );
          expect($('#thumbnail').attr('alt')).to.equal(
            'baz Bar',
            'Page thumbnail alt did not match',
          );
        });
    });

    it('returns the correct tags for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#tags-list li').length).to.equal(2);
        });
    });

    it('returns the correct episodes for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#next-episodes a').length).to.equal(
            1,
            "The number of next episodes shows don't match",
          );
          expect($('#next-episodes a').text()).to.include(
            'Baz episode',
            "The episode title doesn't match",
          );
          expect($('#episode-thumbnail').attr('style')).to.include(
            'baz.image.png',
            "The episode thumbnail doesn't match",
          );

          expect($('#next-episodes a').attr('href')).to.include(
            `/content/${videoShowResponse.season[0].id}`,
            'did not render url',
          );
        });
    });

    it('returns the correct suggestions for a video page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#suggested-content a').length).to.equal(1);
          expect($('#suggested-content h3').text()).to.include(
            'Suggested content',
            "The suggested content title doesn't match",
          );
        });
    });
  });

  describe('Flat page content', () => {
    let app;

    beforeEach(() => {
      const hubContentService = {
        contentFor: sinon.stub().returns(flatContentResponse),
      };
      const router = createHubContentRouter({ logger, hubContentService });
      app = setupBasicApp();

      app.use('/content', router);
    });

    it('returns the correct content for a flat content page', () => {
      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.include(
            'The jobs noticeboard',
            'Page title did not match',
          );
          expect($('#stand-first').text()).to.include(
            'Some incredible foo stand first',
            'Article stand first did not match',
          );
          expect($('#body').text()).to.include(
            'Foo paragraph',
            'Article body did not match',
          );
        });
    });
  });

  describe('Pdf pages', () => {
    const hubContentService = {
      contentFor: sinon.stub().returns({
        id: 1,
        title: 'foo pdf file',
        contentType: 'pdf',
        url: 'www.foo.bar/file.pdf',
      }),
    };

    const stream = {
      on: sinon.stub(),
      pipe: res =>
        fs
          .createReadStream(path.resolve(__dirname, '../resources/foo.pdf'))
          .pipe(res),
    };

    const requestClient = {
      get: sinon.stub().returns(stream),
    };

    it('returns a PDF', () => {
      const router = createHubContentRouter({
        logger,
        hubContentService,
        requestClient,
      });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(200)
        .expect('Content-Type', 'application/pdf')
        .then(() => {
          expect(requestClient.get.lastCall.args[0]).to.equal(
            'www.foo.bar/file.pdf',
          );
        });
    });
  });

  describe('Landing page', () => {
    const serviceResponse = {
      id: 1,
      title: 'Foo Landing page',
      contentType: 'landing-page',
      description: {
        sanitized: '<p>Foo landing page body</p>',
        summary: 'Some summary',
      },
      featuredContent: {
        id: 'foo-id',
        title: 'foo-feature-title',
        description: { summary: 'foo-feature-summary' },
        contentType: 'landing-page',
        graphic: {
          url: '',
        },
      },
      relatedContent: {
        contentType: 'foo',
        data: [
          {
            id: 'baz-id',
            title: 'baz-feature-title',
            description: { summary: 'baz-feature-summary' },
            contentType: 'radio-show',
            graphic: {
              url: '',
            },
            contentUrl: '/content/baz-id',
          },
          {
            id: 'bar-id',
            title: 'bar-feature-title',
            description: { summary: 'bar-feature-summary' },
            contentType: 'radio-show',
            graphic: {
              url: '',
            },
            contentUrl: '/content/bar-id',
          },
        ],
      },
      categoryMenu: [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ],
    };

    it('returns the correct content for a landing page', () => {
      const hubContentService = {
        contentFor: sinon.stub().returns(serviceResponse),
      };
      const router = createHubContentRouter({ logger, hubContentService });
      const app = setupBasicApp();

      app.use('/content', router);

      return request(app)
        .get('/content/1')
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);

          expect($('#title').text()).to.include(
            'Foo Landing page',
            'Page title did not match',
          );
          expect($('.category-content a').length).to.equal(
            2,
            'it did not render the correct number of related items',
          );
          expect($('.help-block a').length).to.equal(
            2,
            'show have rendered a category menu',
          );

          expect($('[data-featured-id="baz-id"]').attr('href')).to.include(
            `/content/baz-id`,
            'did not render url',
          );
        });
    });
  });
});
