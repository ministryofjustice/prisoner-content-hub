const createHubFeaturedContentService = require('../../server/services/hubFeaturedContent');


const hubRepository = {
  newsAndEvents: sinon.stub().returns({ newsAndEvents: 'newsAndEvents' }),
  // games: sinon.stub().returns({ games: 'games' }),
  radioShowsAndPodcasts: sinon.stub().returns({ radioShowsAndPodcasts: 'radioShowsAndPodcasts' }),
  // healthyMindAndBody: sinon.stub().returns({ healthyMindAndBody: 'healthyMindAndBody' }),
  // inspiration: sinon.stub().returns({ inspiration: 'inspiration' }),
  // scienceAndNature: sinon.stub().returns({ scienceAndNature: 'scienceAndNature' }),
  // artAndCulture: sinon.stub().returns({ artAndCulture: 'artAndCulture' }),
  // history: sinon.stub().returns({ history: 'history' }),
};


describe('hubFeaturedService', () => {
  describe('#hubFeaturedContent', () => {
    it('returns featured content', async () => {
      const service = createHubFeaturedContentService(hubRepository);
      const response = await service.hubFeaturedContent();
      const expectedResult = {
        newsAndEvents: { newsAndEvents: 'newsAndEvents' },
        // games: { games: 'games' },
        radioShowsAndPodcasts: { radioShowsAndPodcasts: 'radioShowsAndPodcasts' },
        // healthyMindAndBody: { healthyMindAndBody: 'healthyMindAndBody' },
        // inspiration: { inspiration: 'inspiration' },
        // scienceAndNature: { scienceAndNature: 'scienceAndNature' },
        // artAndCulture: { artAndCulture: 'artAndCulture' },
        // history: { history: 'history' },
      };

      expect(response).to.eql(expectedResult);
    });

    context('when some feature content are missing', () => {
      it('fails to return content', async () => {
        const hubRepositoryWithError = {
          newsAndEvents: sinon.stub().returns({}),
          // games: sinon.stub().returns({}),
          radioShowsAndPodcasts: sinon.stub().throws(new Error('error')),
          // healthyMindAndBody: sinon.stub().returns({}),
          // inspiration: sinon.stub().returns({}),
          // scienceAndNature: sinon.stub().returns({}),
          // artAndCulture: sinon.stub().returns({}),
          // history: sinon.stub().throws(new Error('error')),
        };

        const service = createHubFeaturedContentService(hubRepositoryWithError);
        const response = await service.hubFeaturedContent();
        const expectedResult = null;

        expect(response).to.eql(expectedResult);
      });
    });
  });
});
