const request = require('supertest');
const cheerio = require('cheerio');

const createHubTagsRouter = require('../../server/routes/tags');
const { setupBasicApp, logger } = require('../test-helpers');

describe('GET /tags', () => {
  describe('/:id', () => {
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

    it('correctly renders a tags page', () => {
      const data = {
        name: 'foo bar',
        description: {
          sanitized: 'foo description',
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
      const hubTagsService = {
        termFor: sinon.stub().returns(data),
      };
      const router = createHubTagsRouter({ logger, hubTagsService });
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
          expect($('[data-featured-id]').length).to.equal(
            1,
            'did not render the correct number of',
          );
          expect($('[data-featured-id="foo"]').text()).to.include(
            data.relatedContent.data[0].title,
            'did not render the correct related item title',
          );
          expect($('[data-featured-id="foo"]').text()).to.include(
            data.relatedContent.data[0].summary,
            'did not render the correct related item summary',
          );

          expect($('[data-featured-item-background]').attr('style')).to.include(
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
