const createHubPromotedContentService = require('../../../server/services/hubPromotedContent');

const promotedContentRepository = {
  hubPromotedContent: sinon.stub().returns('promotedContent'),
};

const promotedContentRepositoryWithError = {
  hubPromotedContent: sinon.stub().returns(null),
};

describe('hub promoted conntent service', () => {
  describe('#hubPromotedContent', () => {
    it('returns featured content', async () => {
      const service = createHubPromotedContentService(promotedContentRepository);
      const response = await service.hubPromotedContent();
      const expectedResult = 'promotedContent';

      expect(response).to.eql(expectedResult);
    });

    context('when some promoted content are missing', () => {
      it('fails to return content', async () => {
        const service = createHubPromotedContentService(promotedContentRepositoryWithError);
        const response = await service.hubPromotedContent();
        const expectedResult = null;

        expect(response).to.eql(expectedResult);
      });
    });
  });
});
