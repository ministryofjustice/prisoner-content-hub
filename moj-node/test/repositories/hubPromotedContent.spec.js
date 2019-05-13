const hubPromotedContentRepository = require('../../server/repositories/hubPromotedContent');

describe('Hub promoted content', () => {
  describe('#hubPromotedContent', () => {
    context('when promoted content is available', () => {
      it('returns promoted content ', async () => {
        const client = generateClient({ content_type: 'moj_video_item' });
        const repository = hubPromotedContentRepository(client);

        const result = await repository.hubPromotedContent();

        const expectedKeys = [
          'id',
          'title',
          'summary',
          'contentType',
          'image',
          'duration',
        ];
        const keys = Object.keys(result);

        expectedKeys.forEach(key => {
          expect(keys).to.include(key);
        });
      });
    });

    context('when promoted content is missing', () => {
      it('returns an empty null for the missing content', async () => {
        const client = generateNoContentClientFor();
        const repository = hubPromotedContentRepository(client);
        const response = await repository.hubPromotedContent();

        expect(response).to.eql([]);
      });
    });
  });
});

function generateNoContentClientFor() {
  const httpClient = {
    get: sinon.stub().returns({
      message: 'No promoted content found',
    }),
  };
  return httpClient;
}

function generateClient(data) {
  const httpClient = {
    get: sinon.stub().returns(data),
  };

  return httpClient;
}
