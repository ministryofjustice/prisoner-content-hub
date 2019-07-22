const request = require('supertest');
const cheerio = require('cheerio');

const createSearchRouter = require('../../server/routes/search');
const { setupBasicApp, logger } = require('../test-helpers');

const searchResponse = require('../resources/searchResponse.json');

describe('GET /search', () => {
  describe('GET /search', () => {
    describe('Results page', () => {
      it('should return the correct number of search results', () => {
        const searchService = {
          find: sinon.stub().returns(searchResponse),
        };

        const router = createSearchRouter({ searchService, logger });
        const app = setupBasicApp();

        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('.results > h3').text()).to.contain(
              query,
              'The results header should contain the query',
            );

            const results = $('.results li');

            expect(results.length).to.equal(
              searchResponse.length,
              'All results should be displayed on the page',
            );

            expect(results.text()).to.contain(
              searchResponse[0].title,
              'The title of search results should be displayed',
            );

            expect(results.text()).to.contain(
              searchResponse[0].summary,
              'The summary for search results should be displayed',
            );
          });
      });

      it('should display a message when no results found', () => {
        const searchService = {
          find: sinon.stub().returns([]),
        };

        const router = createSearchRouter({ searchService, logger });
        const app = setupBasicApp();

        app.use('/search', router);

        const query = 'qwertyuiop';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(200)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect($('.results > h3').text()).to.contain(
              'No results found',
              'The results header should contain the query',
            );

            expect($('.results > h3').text()).to.contain(
              query,
              'The results header should contain the query',
            );
          });
      });

      it('should display an error page when the search fails', () => {
        const searchService = {
          find: sinon.stub().rejects('BOOM!'),
        };

        const router = createSearchRouter({ searchService, logger });
        const app = setupBasicApp();

        app.use('/search', router);

        const query = 'bob';

        return request(app)
          .get(`/search?query=${query}`)
          .expect(500)
          .then(response => {
            const $ = cheerio.load(response.text);

            expect(
              $('title')
                .text()
                .toLowerCase(),
            ).to.contain(
              'error',
              'The error page should be displayed if the search fails',
            );
          });
      });
    });
  });
});

describe('GET /suggest', () => {
  describe('Results page', () => {
    it('should return the correct number of search results', () => {
      const searchService = {
        typeAhead: sinon.stub().returns(searchResponse),
      };

      const router = createSearchRouter({ searchService, logger });
      const app = setupBasicApp();

      app.use('/search', router);

      const query = 'bob';

      return request(app)
        .get(`/search/suggest?query=${query}`)
        .expect(200)
        .then(response => {
          expect(Array.isArray(response.body)).to.equal(
            true,
            'The endpoint should return an array of results',
          );

          expect(response.body.length).to.equal(
            searchResponse.length,
            'All results should be returned in the response',
          );
        });
    });

    it('should return empty when the search fails', () => {
      const searchService = {
        find: sinon.stub().rejects('BOOM!'),
      };

      const router = createSearchRouter({ searchService, logger });
      const app = setupBasicApp();

      app.use('/search', router);

      const query = 'bob';

      return request(app)
        .get(`/search/suggest?query=${query}`)
        .expect(500)
        .then(response => {
          expect(Array.isArray(response.body)).to.equal(
            true,
            'The response should be an array',
          );

          expect(response.body.length).to.equal(
            0,
            'The response should be empty',
          );
        });
    });
  });
});
