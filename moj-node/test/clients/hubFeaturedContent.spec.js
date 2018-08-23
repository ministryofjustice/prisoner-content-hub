const createHubFeaturedContentService = require('../../server/services/hubFeaturedContent');

const featuredContentService = createHubFeaturedContentService();

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

describe('Hub featured content', () => {
  describe('#hubFeaturedContent', () => {
    const contentResponse = {
      3546: {
        nid: [
          {
            value: 1,
          },
        ],
        type: [
          {
            target_id: 'page',
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

    it('returns featured content', async () => {
      const expectedResult = {
        newsAndEvents: contentFor('page'),
        games: contentFor('page'),
        radioShowsAndPodcasts: contentFor('page'),
        healthyMindAndBody: contentFor('page'),
        inspiration: contentFor('page'),
        scienceAndNature: contentFor('page'),
        artAndCulture: contentFor('page'),
        history: contentFor('page'),
      };
      const stub = sinon.stub().returns(contentResponse);
      const response = await featuredContentService.hubFeaturedContent(featuredContentClient(stub));

      expect(response).to.eql(expectedResult);
    });

    context('when some feature content are missing', () => {
      it('returns an empty null for the missing fields', async () => {
        const expectedResult = {
          newsAndEvents: {},
          games: {},
          radioShowsAndPodcasts: contentFor('page'),
          healthyMindAndBody: contentFor('page'),
          inspiration: contentFor('page'),
          scienceAndNature: contentFor('page'),
          artAndCulture: contentFor('page'),
          history: contentFor('page'),
        };

        const stub = sinon.stub();

        stub.onFirstCall().throws();
        stub.onSecondCall().throws();
        stub.returns(contentResponse);

        const response = await featuredContentService
          .hubFeaturedContent(featuredContentClient(stub));

        expect(response).to.eql(expectedResult);
      });
    });
  });

  describe('#hubContentFor', () => {
    it('returns a radio featured content', async () => {
      const content = await featuredContentService.hubContentFor(generateFeatureContentClientFor('moj_radio_item'));

      expect(content).to.eql(contentFor('radio'));
    });

    it('returns a video featured content', async () => {
      const content = await featuredContentService.hubContentFor(generateFeatureContentClientFor('moj_video_item'));

      expect(content).to.eql(contentFor('video'));
    });

    it('returns a pdf featured content', async () => {
      const content = await featuredContentService.hubContentFor(generateFeatureContentClientFor('moj_pdf_item'));

      expect(content).to.eql(contentFor('pdf'));
    });
    it('returns a page featured content', async () => {
      const content = await featuredContentService.hubContentFor(generateFeatureContentClientFor('page'));

      expect(content).to.eql(contentFor('page'));
    });

    context('When there is a summary available', () => {
      it('uses the summary text instead of the sanitized description', async () => {
        const content = await featuredContentService.hubContentFor(generateFeatureContentWithSummaryClientFor('page'));

        expect(content).to.eql(contentWithSummaryFor('page'));
      });
    });
  });
});

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

function featuredContentClient(response) {
  const httpClient = {
    get: () => httpClient,
    query: () => httpClient,
    then: () => new Promise((resolve, reject) => {
      try {
        response();
        resolve(response());
      } catch (e) {
        reject(new Error('foo'));
      }
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
