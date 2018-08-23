const hubFeaturedContentRepository = require('../../server/repositories/hubFeaturedContent');

describe('hubFeaturedRepository', () => {
  describe('#hubContentFor', () => {
    it('returns a radio featured content', async () => {
      const repository = hubFeaturedContentRepository(generateFeatureContentClientFor('moj_radio_item'));
      const content = await repository.hubContentFor();

      expect(content).to.eql(contentFor('radio'));
    });

    it('returns a video featured content', async () => {
      const repository = hubFeaturedContentRepository(generateFeatureContentClientFor('moj_video_item'));
      const content = await repository.hubContentFor();

      expect(content).to.eql(contentFor('video'));
    });

    it('returns a pdf featured content', async () => {
      const repository = hubFeaturedContentRepository(generateFeatureContentClientFor('moj_pdf_item'));
      const content = await repository.hubContentFor();

      expect(content).to.eql(contentFor('pdf'));
    });
    it('returns a page featured content', async () => {
      const repository = hubFeaturedContentRepository(generateFeatureContentClientFor('page'));
      const content = await repository.hubContentFor();

      expect(content).to.eql(contentFor('page'));
    });

    context('When there is a summary available', () => {
      it('uses the summary text instead of the sanitized description', async () => {
        const repository = hubFeaturedContentRepository(generateFeatureContentWithSummaryClientFor('page'));
        const content = await repository.hubContentFor();

        expect(content).to.eql(contentWithSummaryFor('page'));
      });
    });
  });
});

const responseData = {
  3546: {
    nid: [
      {
        value: 1,
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
};

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


function generateFeatureContentClientFor(contentType) {
  const httpClient = {
    get: sinon.stub().returns({
      3546: {
        ...responseData['3546'],
        type: [
          {
            target_id: contentType,
          },
        ],
      },

    }),
  };

  return httpClient;
}

function generateFeatureContentWithSummaryClientFor(contentType) {
  const httpClient = {
    get: sinon.stub().returns({
      3546: {
        ...responseData['3546'],
        type: [
          {
            target_id: contentType,
          },
        ],
        field_moj_description: [
          {
            value: '<p>foo description<p>\r\n',
            processed: '<p>foo description<p>',
            summary: 'foo summary',
          },
        ],
      },
    }),
  };

  return httpClient;
}

function contentWithSummaryFor(contentType) {
  return [{
    id: 1,
    title: 'foo title',
    contentType,
    description: {
      sanitized: 'foo summary',
    },
    image: {
      alt: 'Foo image alt text',
      url: 'image.url.com',
    },
    duration: '40:00',
  }];
}
