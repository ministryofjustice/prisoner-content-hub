const request = require('supertest');
const cheerio = require('cheerio');

const createHubTagsRouter = require('../../server/routes/tags');
const { setupBasicApp, logger } = require('../test-helpers');

describe('GET /tags', () => {
  describe('/:id', () => {
    describe('on error', () => {
      it('returns a 500 when incorrect data is returned', () => {
        const invalidService = {
          termFor: sinon.stub().rejects('error'),
        };
        const router = createHubTagsRouter({
          logger,
          hubTagsService: invalidService,
        });
        const app = setupBasicApp();

        app.use('/tags', router);

        return request(app)
          .get('/tags/1')
          .expect(500);
      });
    });

    describe('on success', () => {
      const data = {
        name: 'foo bar',
        description: {
          sanitized: 'foo description',
        },
        image: {
          alt: 'Foo Image',
          url: 'foo.url.com/image.png',
        },
        relatedContent: {
          contentType: 'foo',
          data: [
            {
              id: 'foo',
              type: 'radio',
              title: 'foo related content',
              summary: 'Foo body',
              image: {
                url: 'foo.png',
              },
              contentUrl: '/content/foo',
            },
          ],
        },
      };

      describe('tags page header', () => {
        it('correctly renders a page header with an image', () => {
          const hubTagsService = {
            termFor: sinon.stub().returns(data),
          };
          const router = createHubTagsRouter({
            logger,
            hubTagsService,
          });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .expect(200)
            .expect('Content-Type', /text\/html/)
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#title').text()).to.include(
                data.name,
                'did not have correct header title',
              );

              expect($('#description').text()).to.include(
                data.description.sanitized,
              );

              expect($('[data-page-featured-image]').attr('style')).to.include(
                data.image.url,
                'did not render a featured image',
              );
            });
        });

        it('correctly renders a page header with a audio', () => {
          const hubTagsService = {
            termFor: sinon.stub().returns({
              ...data,
              audio: {
                url: 'foo.bar/audio.mp3',
              },
            }),
          };
          const router = createHubTagsRouter({
            logger,
            hubTagsService,
          });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#audioPlayer').data().media).to.equal(
                'foo.bar/audio.mp3',
                'did not load audio',
              );

              expect($('#audioPlayer').data().config.media).to.have.property(
                'poster',
                data.image.url,
                'did not render a poster for the audio player',
              );
            });
        });

        it('correctly renders a page header with a video', () => {
          const hubTagsService = {
            termFor: sinon.stub().returns({
              ...data,
              video: {
                url: 'foo.bar/video.mp4',
              },
            }),
          };
          const router = createHubTagsRouter({
            logger,
            hubTagsService,
          });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('#videoPlayerScript').html()).to.include(
                'foo.bar/video.mp4',
                'did not render a video',
              );

              expect($('#videoPlayerScript').html()).to.include(
                data.image.url,
                'did not render a poster for the video',
              );
            });
        });
      });

      describe('landing page related content', () => {
        it('correctly renders a tags page related content', () => {
          const hubTagsService = {
            termFor: sinon.stub().returns(data),
          };
          const router = createHubTagsRouter({
            logger,
            hubTagsService,
          });
          const app = setupBasicApp();

          app.use('/tags', router);

          return request(app)
            .get('/tags/1')
            .then(response => {
              const $ = cheerio.load(response.text);

              expect($('[data-featured-id]').length).to.equal(
                1,
                'did not render the correct number of',
              );

              expect($('[data-featured-id="foo"]').text()).to.include(
                data.relatedContent.data[0].title,
                'did not render the correct related item title',
              );

              expect($('.tile-image').attr('src')).to.include(
                data.relatedContent.data[0].image.url,
                'did not render the correct related item image',
              );

              expect($('[data-featured-id="foo"]').attr('href')).to.include(
                `/content/${data.relatedContent.data[0].id}`,
                'did not render url',
              );
            });
        });
      });
    });
  });

  describe('/related-content/:id', () => {
    it('returns tags', () => {
      const data = [
        {
          id: 'foo',
          type: 'radio',
          title: 'foo related content',
          summary: 'Foo body',
          image: {
            url: 'foo.png',
          },
        },
      ];
      const hubTagsService = {
        relatedContentFor: sinon.stub().returns(data),
      };
      const router = createHubTagsRouter({ logger, hubTagsService });
      const app = setupBasicApp();

      app.use('/', router);

      return request(app)
        .get('/related-content/1')
        .expect(200)
        .expect('Content-Type', /application\/json/)
        .then(res => {
          const result = JSON.parse(res.text);

          expect(result).to.eql(data);
        });
    });
  });
});
