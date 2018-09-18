const hubFeaturedContentRepository = require('../../../server/repositories/hubFeaturedContent');

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
    context('When there is no thumbnail available', () => {
      it('uses the default document thumbnail', async () => {
        const repository = hubFeaturedContentRepository(generateFeaturedContnetWithNoImageClientFor('page'));
        const content = await repository.hubContentFor();

        expect(content).to.eql(contentWithNoImageFor('page'));
      });
      it('uses the default pdf thumbnail', async () => {
        const repository = hubFeaturedContentRepository(generateFeaturedContnetWithNoImageClientFor('moj_pdf_item'));
        const content = await repository.hubContentFor();

        expect(content).to.eql(contentWithNoImageFor('pdf'));
      });
      it('uses the default video thumbnail', async () => {
        const repository = hubFeaturedContentRepository(generateFeaturedContnetWithNoImageClientFor('moj_video_item'));
        const content = await repository.hubContentFor();

        expect(content).to.eql(contentWithNoImageFor('video'));
      });
      it('uses the default audio thumbnail', async () => {
        const repository = hubFeaturedContentRepository(generateFeaturedContnetWithNoImageClientFor('moj_radio_item'));
        const content = await repository.hubContentFor();

        expect(content).to.eql(contentWithNoImageFor('radio'));
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
        summary: 'foo summary',
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

const defaultThumbs = {
  radio: '/public/images/default_audio.png',
  pdf: '/public/images/default_document.png',
  video: '/public/images/default_video.png',
  page: '/public/images/default_document.png',
};

const defaultAlt = {
  radio: 'Audio file',
  pdf: 'Document file',
  video: 'Video file',
  page: 'Document file',
};

function contentFor(contentType) {
  return [{
    id: 1,
    title: 'foo title',
    contentType,
    summary: 'foo summary',
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

function generateFeaturedContnetWithNoImageClientFor(contentType) {
  const httpClient = {
    get: sinon.stub().returns({
      3546: {
        ...responseData['3546'],
        type: [
          {
            target_id: contentType,
          },
        ],
        field_moj_thumbnail_image: [
          {
            alt: '',
            url: '',
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
    summary: 'foo summary',
    image: {
      alt: 'Foo image alt text',
      url: 'image.url.com',
    },
    duration: '40:00',
  }];
}

function contentWithNoImageFor(contentType) {
  return [{
    id: 1,
    title: 'foo title',
    contentType,
    summary: 'foo summary',
    image: {
      alt: defaultAlt[contentType],
      url: defaultThumbs[contentType],
    },
    duration: '40:00',
  }];
}
