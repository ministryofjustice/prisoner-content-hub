const hubCategoryFeaturedContentRepository = require('../../server/repositories/categoryFeaturedContent');

describe('hubCategoryFeaturedContentRepository', () => {
  describe('#contentFor', () => {
    describe('When content is returned from the endpoint', () => {
      it('returns a featured content', async () => {
        const client = generateFeatureContentClient([
          { contentType: 'moj_radio_item' },
        ]);
        const repository = hubCategoryFeaturedContentRepository(client);

        const expectedKeys = [
          'id',
          'title',
          'contentType',
          'summary',
          'image',
          'duration',
          'contentUrl',
        ];

        const result = await repository.contentFor({
          categoryId: 'fooCategoryId',
        });

        const requestQueryString = JSON.stringify(client.get.lastCall.args[1]);

        expect(requestQueryString).to.include('fooCategoryId');

        expect(result.length).to.equal(1);

        const keys = Object.keys(result[0]);

        expectedKeys.forEach(key => {
          expect(keys).to.include(key);
        });
      });
    });

    describe('When no content is returned from the endpoint', () => {
      it('returns no data', async () => {
        const repository = hubCategoryFeaturedContentRepository(
          generateNoDataResponse(),
        );
        const content = await repository.contentFor(1);

        expect(content).to.eql([]);
      });
    });
  });
});

function generateFeatureContentClient(data) {
  const httpClient = {
    get: sinon.stub().returns(data),
  };

  return httpClient;
}

function generateNoDataResponse() {
  const httpClient = {
    get: sinon.stub().returns([]),
  };

  return httpClient;
}
