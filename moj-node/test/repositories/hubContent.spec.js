const hubContentRepository = require('../../server/repositories/hubContent');
const radioShowResponse = require('../resources/radioShow.json');
const videoShowResponse = require('../resources/videoShow.json');

const termsResponse = require('../resources/terms.json');
const flatPageContentResponse = require('../resources/flatPageContent.json');
const seasonResponse = require('../resources/season.json');
const landingPageResponse = require('../resources/landingPage.json');
const relatedContentResponse = require('../resources/relatedContent.json');
const pdfContentResponse = require('../resources/pdfContentResponse.json');

describe('hubContentRepository', () => {
  describe('#contentFor', () => {
    it('returns formated data for radio shows', async () => {
      const client = generateClient(radioShowResponse);
      const repository = hubContentRepository(client);
      const content = await repository.contentFor('id');

      expect(content).to.eql(radioContent());
      expect(client.get.lastCall.args[0]).to.include('id');
    });

    it('returns formated data for video shows', async () => {
      const client = generateClient(videoShowResponse);
      const repository = hubContentRepository(client);
      const content = await repository.contentFor('id');

      expect(content).to.eql(videoContent());
      expect(client.get.lastCall.args[0]).to.include('id');
    });

    it('returns formated data for flat page contents', async () => {
      const client = generateClient(flatPageContentResponse);
      const repository = hubContentRepository(client);
      const content = await repository.contentFor('id');

      expect(content).to.eql(flatPageContent());
      expect(client.get.lastCall.args[0]).to.include('id');
    });

    it('returns formated data for a landing page', async () => {
      const client = generateClient(landingPageResponse);
      const repository = hubContentRepository(client);
      const content = await repository.contentFor('id');

      expect(content).to.eql(landingPageContent());
      expect(client.get.lastCall.args[0]).to.include('id');
    });

    it('returns formated data for pdf', async () => {
      const client = generateClient(pdfContentResponse);
      const repository = hubContentRepository(client);
      const content = await repository.contentFor('id');

      expect(content).to.eql(pdfContent());
      expect(JSON.stringify(client.get.lastCall.args[0])).to.include('id');
    });
  });

  describe('#termFor', () => {
    it('returns formated data for terms', async () => {
      const client = generateClient(termsResponse);
      const repository = hubContentRepository(client);
      const content = await repository.termFor('id');

      expect(content).to.eql({
        id: 1,
        type: 'foo_type',
        name: 'Foo terms',
        description: {
          raw: '<p>foo description</p>',
          sanitized: '<p>foo description</p>',
        },
        image: {
          url: 'http://foo.bar/image.png',
          alt: 'foo image',
        },
      });
      expect(client.get.lastCall.args[0]).to.include('id');
    });
  });

  describe('#seasonFor', () => {
    it('returns formated data for a season', async () => {
      const client = generateClient(seasonResponse);
      const repository = hubContentRepository(client);
      const content = await repository.seasonFor('id');

      expect(content).to.eql(seasonContent());
      expect(client.get.lastCall.args[0]).to.include('id');
    });
  });

  describe('#relatedContentFor', () => {
    it('returns formated data for related content', async () => {
      const client = generateClient(relatedContentResponse);
      const repository = hubContentRepository(client);
      const content = await repository.relatedContentFor({ id: 'id' });

      expect(content).to.eql(relatedContent());
      expect(JSON.stringify(client.get.lastCall.args[1])).to.include('id');
    });
  });

  describe('#menuFor', () => {
    it('returns formated menu for a given category id', async () => {
      const client = generateClient([
        { title: 'Foo', link: 'www.foo.com', id: '1' },
        { title: 'Bar', link: 'www.bar.com', id: '2' },
      ]);
      const repository = hubContentRepository(client);
      const content = await repository.menuFor('id');

      const expected = [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ];

      expect(content).to.eql(expected);
      expect(JSON.stringify(client.get.lastCall.args[1])).to.eql(
        JSON.stringify({ _parent: 'id', _menu: 'main' }),
      );
    });
  });
});

function generateClient(response) {
  const httpClient = {
    get: sinon.stub().returns(response),
  };

  return httpClient;
}

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
