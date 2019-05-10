const { parseHubFeaturedContentResponse } = require('../../server/utils/index');

describe('Utils', () => {
  describe('#parseHubFeaturedContentResponse', () => {
    it('returns a radio featured content', () => {
      const content = parseHubFeaturedContentResponse(
        generateFeatureContentFor('moj_radio_item'),
      );

      expect(content).to.eql(contentFor('radio'));
    });

    it('returns a video featured content', () => {
      const content = parseHubFeaturedContentResponse(
        generateFeatureContentFor('moj_video_item'),
      );

      expect(content).to.eql(contentFor('video'));
    });

    it('returns a pdf featured content', () => {
      const content = parseHubFeaturedContentResponse(
        generateFeatureContentFor('moj_pdf_item'),
      );

      expect(content).to.eql(contentFor('pdf'));
    });

    it('returns a page featured content', () => {
      const content = parseHubFeaturedContentResponse(
        generateFeatureContentFor('page'),
      );

      expect(content).to.eql(contentFor('page'));
    });

    describe('When there is no thumbnail available', () => {
      it('uses the default document thumbnail', () => {
        const content = parseHubFeaturedContentResponse(
          generateFeaturedContentWithNoImageFor('page'),
        );

        expect(content).to.eql(contentWithNoImageFor('page'));
      });

      it('uses the default pdf thumbnail', () => {
        const content = parseHubFeaturedContentResponse(
          generateFeaturedContentWithNoImageFor('moj_pdf_item'),
        );

        expect(content).to.eql(contentWithNoImageFor('pdf'));
      });

      it('uses the default video thumbnail', () => {
        const content = parseHubFeaturedContentResponse(
          generateFeaturedContentWithNoImageFor('moj_video_item'),
        );

        expect(content).to.eql(contentWithNoImageFor('video'));
      });

      it('uses the default audio thumbnail', () => {
        const content = parseHubFeaturedContentResponse(
          generateFeaturedContentWithNoImageFor('moj_radio_item'),
        );

        expect(content).to.eql(contentWithNoImageFor('radio'));
      });
    });
  });
});

const responseData = {
  id: '1',
  title: 'foo title',
  type: 'series',
  summary: 'foo summary',
  featured_image: [
    {
      alt: 'Foo image alt text',
      url: 'http://foo.bar/image.png',
    },
  ],
  duration: '40:00',
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
  return {
    id: '1',
    title: 'foo title',
    contentType,
    summary: 'foo summary',
    image: {
      alt: 'Foo image alt text',
      url: 'http://foo.bar/image.png',
    },
    duration: '40:00',
    contentUrl: '/content/1',
  };
}

function generateFeatureContentFor(contentType) {
  return {
    ...responseData,
    type: contentType,
  };
}

function generateFeaturedContentWithNoImageFor(contentType) {
  return {
    ...responseData,
    type: contentType,
    featured_image: [],
  };
}

function contentWithNoImageFor(contentType) {
  return {
    id: '1',
    title: 'foo title',
    contentType,
    summary: 'foo summary',
    image: {
      alt: defaultAlt[contentType],
      url: defaultThumbs[contentType],
    },
    duration: '40:00',
    contentUrl: '/content/1',
  };
}
