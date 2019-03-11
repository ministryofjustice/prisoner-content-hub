const hubPromotedContentRepository = require('../../server/repositories/hubPromotedContent');

describe('Hub promoted content', () => {
  describe('#hubPromotedContent', () => {
    context('when promoted content is available', () => {
      it('returns a radio promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('moj_radio_item'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('radio'));
      });

      it('returns a video promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('moj_video_item'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('video'));
      });

      it('returns a pdf promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('moj_pdf_item'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('pdf'));
      });
      it('returns a page promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('page'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('page'));
      });

      it('returns a series promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('series'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('series', '/tags'));
      });

      it('returns a tags promoted content', async () => {
        const repository = hubPromotedContentRepository(
          generatePromotedContentClientFor('tags'),
        );
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('tags', '/tags'));
      });
    });
    context('when promoted content is missing', () => {
      it('returns an empty null for the missing content', async () => {
        const repository = hubPromotedContentRepository(
          generateNoContentClientFor(),
        );
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

function generatePromotedContentClientFor(contentType) {
  const httpClient = {
    get: sinon.stub().returns({
      id: 1,
      title: 'foo title',
      type: contentType,
      description: [
        {
          value: '<p>foo summary</p>\r\n',
          format: 'basic_html',
          processed: '<p>foo summary</p>',
          summary: 'foo summary',
        },
      ],
      featured_image: [
        {
          alt: 'Foo image alt text',
          url: 'image.url.com',
        },
      ],
      duration: '1:00',
      summary: 'foo summary',
    }),
  };

  return httpClient;
}

function contentFor(contentType, contentUrl = '/content') {
  return {
    id: 1,
    title: 'foo title',
    contentType,
    contentUrl: `${contentUrl}/1`,
    summary: 'foo summary',
    image: {
      alt: 'Foo image alt text',
      url: 'image.url.com',
    },
    duration: '1:00',
  };
}
