const {
  contentResponseFrom,
  featuredContentResponseFrom,
  mediaResponseFrom,
  seasonResponseFrom,
  termResponseFrom,
  flatPageContentFrom,
  landingResponseFrom,
  pdfResponseFrom,
  typeFrom,
} = require('../../server/utils/adapters');

const radioShowResponse = require('../resources/radioShow.json');
const videoShowResponse = require('../resources/videoShow.json');
const termsResponse = require('../resources/terms.json');
const featuredItemResponse = require('../resources/featuredItem.json');
const featuredSeriesResponse = require('../resources/featuredSeries.json');
const flatPageContentResponse = require('../resources/flatPageContent.json');
const seasonResponse = require('../resources/season.json');
const landingPageResponse = require('../resources/landingPage.json');
const relatedContentResponse = require('../resources/relatedContent.json');
const pdfContentResponse = require('../resources/pdfContentResponse.json');

describe('Adapters', () => {
  describe('.mediaResponseFrom', () => {
    it('returns formated data for an audio item', () => {
      const result = mediaResponseFrom(radioShowResponse);
      expect(result).to.eql(radioContent());
    });

    it('returns formated data for a video item', () => {
      const result = mediaResponseFrom(videoShowResponse);
      expect(result).to.eql(videoContent());
    });
  });

  describe('.flatContentResponseFrom', () => {
    it('return formated data for flat content', () => {
      const result = flatPageContentFrom(flatPageContentResponse);
      expect(result).to.eql(flatPageContent());
    });
  });

  describe('.pdfResponseFrom', () => {
    it('returns formated data for a pdf item', () => {
      const result = pdfResponseFrom(pdfContentResponse);
      expect(result).to.eql(pdfContent());
    });
  });

  describe('.landingResponseFrom', () => {
    it('returns formated data for a landing page', () => {
      const result = landingResponseFrom(landingPageResponse);
      expect(result).to.eql(landingPageContent());
    });
  });

  describe('.seasonResponseFrom', () => {
    it('returns formated data for a season', () => {
      const result = seasonResponseFrom(seasonResponse);
      expect(result).to.eql(seasonContent());
    });

    it('returns empty when a falsy is passed', () => {
      const result = seasonResponseFrom(null);
      expect(result).to.eql([]);
    });
  });

  describe('.contentResponseFrom', () => {
    it('returns formated data for related content', () => {
      const result = contentResponseFrom(relatedContentResponse);
      expect(result).to.eql(relatedContent());
    });
  });

  describe('.termResponseFrom', () => {
    it('returns formated data for a term', () => {
      const result = termResponseFrom(termsResponse);
      expect(result).to.eql(termContent());
    });
  });

  describe('.featuredContentResponseFrom', () => {
    it('returns formated data for featured item', () => {
      const result = featuredContentResponseFrom(featuredItemResponse);
      expect(result).to.eql(featuredItem());
    });

    it('returns formated data for featured series', () => {
      const result = featuredContentResponseFrom(featuredSeriesResponse);
      expect(result).to.eql(featuredSeries());
    });
  });

  describe('.typeFrom', () => {
    it('should return the correct type for an audio item', () => {
      expect(typeFrom('moj_radio_item')).to.eql('radio');
    });
    it('should return the correct type for an video item', () => {
      expect(typeFrom('moj_video_item')).to.eql('video');
    });

    it('should return the correct type for an pdf item', () => {
      expect(typeFrom('moj_pdf_item')).to.eql('pdf');
    });

    it('should return the correct type for a landing page item', () => {
      expect(typeFrom('landing_page')).to.eql('landing-page');
    });

    it('should return the correct type for a page', () => {
      expect(typeFrom('page')).to.eql('page');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('series')).to.eql('series');
    });

    it('should return the correct type for a series', () => {
      expect(typeFrom('tags')).to.eql('tags');
    });
  });
});

function radioContent() {
  return {
    id: 3546,
    title: 'Foo radio show',
    description: {
      raw: '<p>Hello world</p>\r\n',
      sanitized: '<p>Hello world</p>',
      summary: 'hello world',
    },
    contentType: 'radio',
    media: 'http://foo.bar.com/audio.mp3',
    duration: '1:35:27',
    episode: 1,
    season: 1,
    episodeId: 1001,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: 'http://foo.bar.com/image.png',
    },
    tagsId: [646],
    establishmentId: 792,
    contentUrl: '/content/3546',
    programmeCode: 'foo code',
  };
}

function videoContent() {
  return {
    id: 3546,
    episodeId: 1002,
    title: 'Foo video show',
    description: {
      raw: '<p>Hello world</p>\r\n',
      sanitized: '<p>Hello world</p>',
      summary: 'hello world',
    },
    contentType: 'video',
    media: 'http://foo.bar.com/video.mp4',
    duration: '1:35:27',
    episode: 2,
    season: 1,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: 'http://foo.bar.com/image.png',
    },
    tagsId: [],
    establishmentId: 792,
    contentUrl: '/content/3546',
    programmeCode: 'foo code',
  };
}

function flatPageContent() {
  return {
    id: 3456,
    title: 'foo title',
    contentType: 'page',
    description: {
      raw: '<h2>foo text</h2>',
      sanitized: '<h2>foo text</h2>',
      summary: 'foo text',
    },
    image: {
      alt: 'foo alt',
      url: 'http://foo.image.png',
    },
    standFirst: 'foo stand first',
    establishmentId: undefined,
    contentUrl: '/content/3456',
  };
}

function seasonContent() {
  return [
    {
      contentType: 'radio',
      contentUrl: '/content/3456',
      description: {
        raw: '<p>Series radio item</p>\r\n',
        sanitized: '<p>Series radio item</p>',
        summary: 'Series radio item summary',
      },
      duration: '12:34',
      episode: '1',
      episodeId: 1001,
      id: '3456',
      image: {
        alt: '',
        url: 'http://foo.bar/images/foo.jpg',
      },
      media: 'http://foo.bar/audio/foo.mp3',
      season: '1',
      seriesId: 660,
      tagsId: [646],
      title: 'Radio Item 1',
      establishmentId: undefined,
      programmeCode: undefined,
    },
    {
      contentType: 'radio',
      contentUrl: '/content/3457',
      description: {
        raw: '<p>Series radio item</p>\r\n',
        sanitized: '<p>Series radio item</p>',
        summary: 'Series radio item summary',
      },
      duration: '45:12',
      episode: '2',
      episodeId: 1002,
      id: '3457',
      image: {
        alt: '',
        url: 'http://foo.bar/images/bar.jpg',
      },
      media: 'http://foo.bar/audio/bar.mp3',
      season: '1',
      seriesId: 660,
      tagsId: [785],
      title: 'Radio Item 2',
      establishmentId: undefined,
      programmeCode: undefined,
    },
  ];
}

function landingPageContent() {
  return {
    id: '3456',
    categoryId: '678',
    title: 'Music',
    contentType: 'landing-page',
    featuredContentId: '3456',
    description: {
      raw: '<p>Landing page item</p>\r\n',
      sanitized: '<p>Landing page item</p>',
      summary: 'Landing page item summary',
    },
    image: {
      url: 'http://foo.bar/image/foo.jpg',
      alt: 'foo image',
    },
  };
}

function relatedContent() {
  return [
    {
      id: '3456',
      title: 'Video Item 1',
      contentType: 'video',
      summary: 'Item summary 1',
      image: {
        url: 'http://foo.bar/image/foo.jpg',
        alt: 'Video Item 1 alt',
      },
      duration: '12:34',
      contentUrl: '/content/3456',
    },
    {
      id: '3457',
      title: 'Video Item 2',
      contentType: 'video',
      summary: 'Item summary 2',
      image: {
        url: 'http://foo.bar/image/bar.jpg',
        alt: 'Video Item 2 alt',
      },
      duration: '45:12',
      contentUrl: '/content/3457',
    },
  ];
}

function pdfContent() {
  return {
    id: '3456',
    title: 'Food and catering',
    contentType: 'pdf',
    url: 'http://foo.bar/content/foo.pdf',
    establishmentId: undefined,
    contentUrl: '/content/3456',
  };
}

function featuredItem() {
  return {
    id: '3456',
    title: 'Featured Video 1',
    summary: 'Featured video summary',
    image: {
      alt: 'Featured Video 1',
      url: 'http://foo.bar/images/foo.jpg',
    },
    duration: null,
    contentType: 'video',
    contentUrl: '/content/3456',
  };
}

function featuredSeries() {
  return {
    id: '678',
    title: 'Featured Item 1',
    summary: 'Featured item summary',
    image: {
      alt: 'Featured Item 1',
      url: 'http://foo.bar/images/foo.jpg',
    },
    duration: null,
    contentType: 'series',
    contentUrl: '/tags/678',
  };
}

function termContent() {
  return {
    audio: {
      url: 'http://foo.bar/audio/foo.mp3',
    },
    description: {
      raw: '<p>Foo Term</p>\r\n',
      sanitized: undefined,
      summary: 'Foo Term summary',
    },
    id: '678',
    image: {
      alt: 'Foo Term',
      url: 'http://foo.bar/term/',
    },
    name: 'Foo term',
    contentType: 'series',
    video: {
      url: undefined,
    },
  };
}
