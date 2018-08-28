const hubPromotedContentRepository = require('../../server/repositories/hubPromotedContent');

describe('Hub promoted content', () => {
  describe('#hubPromotedContent', () => {
    context('when promoted content is available', () => {
      it('returns a radio promoted content', async () => {
        const repository = hubPromotedContentRepository(generatePromotedContentClientFor('moj_radio_item'));
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('radio'));
      });

      it('returns a video promoted content', async () => {
        const repository = hubPromotedContentRepository(generatePromotedContentClientFor('moj_video_item'));
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('video'));
      });

      it('returns a pdf promoted content', async () => {
        const repository = hubPromotedContentRepository(generatePromotedContentClientFor('moj_pdf_item'));
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('pdf'));
      });
      it('returns a page promoted content', async () => {
        const repository = hubPromotedContentRepository(generatePromotedContentClientFor('page'));
        const content = await repository.hubPromotedContent();

        expect(content).to.eql(contentFor('page'));
      });
    });
    context('when promoted content is missing', () => {
      it('returns an empty null for the missing content', async () => {
        const repository = hubPromotedContentRepository(generateNoContentClientFor());
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
      3546: {
        nid: [
          {
            value: 1,
          },
        ],
        type: [
          {
            target_id: contentType,
          },
        ],
        title: [
          {
            value: 'foo title',
          },
        ],
        field_moj_description: [
          {
            value: '<p>foo description<p>\r\n',
            processed: '<p>foo description<p>',
          },
        ],
        field_moj_thumbnail_image: [
          {
            alt: 'Foo image alt text',
            url: 'image.url.com',
          },
        ],
        field_moj_duration: [
          {
            value: '40:00',
          },
        ],
      },
    }),
  };

  return httpClient;
}

function contentFor(contentType) {
  return [{
    id: 1,
    title: 'foo title',
    contentType,
    description: {
      raw: '<p>foo description<p>\r\n',
      sanitized: 'foo description...',
    },
    image: {
      alt: 'Foo image alt text',
      url: 'image.url.com',
    },
    duration: '40:00',
  }];
}
