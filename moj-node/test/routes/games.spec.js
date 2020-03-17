const request = require('supertest');
const cheerio = require('cheerio');

const { createGamesRouter } = require('../../server/routes/games');
const { setupBasicApp, logger } = require('../test-helpers');

describe('GET /games', () => {
  describe('/chess', () => {
    it('renders a chess game page', () => {
      const router = createGamesRouter({ logger });
      const app = setupBasicApp();

      app.use('/games', router);

      return request(app)
        .get('/games/chess')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('title').text()).to.match(/Chess/);
        });
    });
  });

  describe('/sudoku', () => {
    it('renders a sudoku game page', () => {
      const router = createGamesRouter({ logger });
      const app = setupBasicApp();

      app.use('/games', router);

      return request(app)
        .get('/games/sudoku')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('title').text()).to.match(/Sudoku/);
        });
    });
  });

  describe('/neontroids', () => {
    it('renders a neontroids game page', () => {
      const router = createGamesRouter({ logger });
      const app = setupBasicApp();

      app.use('/games', router);

      return request(app)
        .get('/games/neontroids')
        .expect('Content-Type', /text\/html/)
        .expect(200)
        .then(response => {
          const $ = cheerio.load(response.text);
          expect($('title').text()).to.match(/Neontroids/);
        });
    });
  });
});
