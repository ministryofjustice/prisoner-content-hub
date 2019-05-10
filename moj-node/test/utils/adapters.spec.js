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
const flatPageContentResponse = require('../resources/flatPageContent.json');
const seasonResponse = require('../resources/season.json');
const landingPageResponse = require('../resources/landingPage.json');
const relatedContentResponse = require('../resources/relatedContent.json');
const pdfContentResponse = require('../resources/pdfContentResponse.json');

describe('Adapters', () => {
  describe('.mediaResponseFrom', () => {
    it('returns formated radio shows data', () => {
      const result = mediaResponseFrom(radioShowResponse);
      expect(result).to.eql(radioContent());
    });

    it('returns formated video shows data', () => {
      const result = mediaResponseFrom(videoShowResponse);
      expect(result).to.eql(videoContent());
    });
  });

  describe('.flatContentResponseFrom', () => {
    it('return formated flat content data', () => {
      const result = flatPageContentFrom(flatPageContentResponse);
      expect(result).to.eql(flatPageContent());
    });
  });

  describe('.seasonResponseFrom', () => {
    it('returns formated data for a season', () => {
      const result = seasonResponseFrom(seasonResponse);
      expect(result).to.eql(seasonContent());
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
  };
}

function videoContent() {
  return {
    id: 3546,
    title: 'Foo video show',
    description: {
      raw: '<p>Hello world</p>\r\n',
      sanitized: '<p>Hello world</p>',
      summary: 'hello world',
    },
    contentType: 'video',
    media: 'http://foo.bar.com/video.mp4',
    duration: '1:35:27',
    episode: 1,
    season: 1,
    seriesId: 665,
    image: {
      alt: 'Foo Bar',
      url: 'http://foo.bar.com/image.png',
    },
    tagsId: [],
    establishmentId: 792,
    contentUrl: '/content/3546',
  };
}

function flatPageContent() {
  return {
    id: 3491,
    title: 'Foo article',
    contentType: 'page',
    description: {
      raw: '<p>Foo article description</p>',
      sanitized: '<p>Foo article description</p>',
      summary: '',
    },
    image: {
      alt: undefined,
      url: undefined,
    },
    standFirst: 'Foo article stand first',
    establishmentId: undefined,
    contentUrl: '/content/3491',
  };
}

function seasonContent() {
  return [
    {
      id: 98,
      title: 'Foo episode',
      description: {
        raw: '<p>foo description</p>',
        sanitized: '<p>foo description</p>',
        summary: '',
      },
      contentType: 'video',
      media: 'http://foo/video/video.mp4',
      duration: '18:41',
      episode: 1,
      season: 1,
      seriesId: 694,
      image: {
        alt: '',
        url: 'foo.image.png',
      },
      tagsId: [648, 650],
      establishmentId: undefined,
      contentUrl: '/content/98',
    },
    {
      id: 2,
      title: 'Bar episode',
      description: {
        raw: '<p>bar description</p>',
        sanitized: '<p>bar description</p>',
        summary: '',
      },
      contentType: 'radio',
      media: 'http://foo/audio/audio.mp3',
      duration: '19:37',
      episode: 2,
      season: 1,
      seriesId: 694,
      image: {
        alt: '',
        url: 'bar.img.png',
      },
      tagsId: [648, 650],
      establishmentId: undefined,
      contentUrl: '/content/2',
    },
  ];
}

function landingPageContent() {
  return {
    id: 1,
    categoryId: 655,
    title: 'Landing page title',
    contentType: 'landing-page',
    featuredContentId: 3602,
    description: {
      raw: '<p>bar description</p>',
      sanitized: '<p>bar description</p>',
      summary: 'Foo bar summary',
    },
    image: {
      url: 'http://foo.bar/image.png',
      alt: 'foo image',
    },
  };
}

function relatedContent() {
  return [
    {
      id: 3018,
      title: 'Foobar bar',
      contentType: 'radio',
      summary: '',
      image: {
        url: 'http://foo.bar.jpg',
        alt: '',
      },
      duration: '51:20',
      establishmentId: undefined,
      contentUrl: '/content/3018',
    },
    {
      id: 3341,
      title: 'Baz bar',
      contentType: 'radio',
      summary: '',
      image: {
        url: 'http://foo.bar.jpg',
        alt: '',
      },
      duration: '51:04',
      establishmentId: undefined,
      contentUrl: '/content/3341',
    },
  ];
}

function pdfContent() {
  return {
    id: 1,
    title: 'Foo pdf',
    contentType: 'pdf',
    url: 'www.foo.bar/file.pdf',
    establishmentId: 792,
    contentUrl: '/content/1',
  };
}
