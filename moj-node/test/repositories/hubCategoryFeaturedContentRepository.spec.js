const hubCategoryFeaturedContentRepository = require('../../server/repositories/categoryFeaturedContent');

describe('hubCategoryFeaturedContentRepository', () => {
  describe('#hubContentFor', () => {
    describe('When content is returned from the endpoint', () => {
      it('returns a featured content', async () => {
        const repository = hubCategoryFeaturedContentRepository(
          generateFeatureContentClient(),
        );

        const expected = [
          {
            id: '1',
            title: 'foo title',
            contentType: 'radio',
            summary: 'foo summary',
            image: {
              alt: 'Foo image alt text',
              url: 'http://foo.bar/image.png',
            },
            duration: '40:00',
            contentUrl: '/content/1',
          },
        ];

        const content = await repository.hubContentFor(1);

        expect(content).to.eql(expected);
      });
    });

    describe('When no content is returned from the endpoint', () => {
      it('returns no data', async () => {
        const repository = hubCategoryFeaturedContentRepository(
          generateNoDataResponse(),
        );
        const content = await repository.hubContentFor(1);

        expect(content).to.eql([]);
      });
    });
  });
});

function generateFeatureContentClient() {
  const httpClient = {
    get: sinon.stub().returns([
      {
        id: '1',
        title: 'foo title',
        summary: 'foo summary',
        featured_image: [
          {
            alt: 'Foo image alt text',
            url: 'http://foo.bar/image.png',
          },
        ],
        duration: '40:00',
        type: 'moj_radio_item',
      },
    ]),
  };

  return httpClient;
}

function generateNoDataResponse() {
  const httpClient = {
    get: sinon.stub().returns({
      message: 'No featured content found',
    }),
  };

  return httpClient;
}
