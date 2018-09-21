const hubContentRepository = require('../../server/repositories/hubContent');
const radioShowResponse = require('../resources/radioShow.json');
const videoShowResponse = require('../resources/videoShow.json');

const termsResponse = require('../resources/terms.json');
const flatPageContentResponse = require('../resources/flatPageContent.json');
const seasonResponse = require('../resources/season.json');

describe('hubContentRepository', () => {
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

  it('returns terms data', async () => {
    const client = generateClient(termsResponse);
    const repository = hubContentRepository(client);
    const content = await repository.termFor('id');

    expect(content).to.eql({ name: 'Foo terms' });
    expect(client.get.lastCall.args[0]).to.include('id');
  });

  it('returns formated data for flat page contents', async () => {
    const client = generateClient(flatPageContentResponse);
    const repository = hubContentRepository(client);
    const content = await repository.contentFor('id');

    expect(content).to.eql(flatPageContent());
    expect(client.get.lastCall.args[0]).to.include('id');
  });

  it('returns formated data for a season', async () => {
    const client = generateClient(seasonResponse);
    const repository = hubContentRepository(client);
    const content = await repository.seasonFor('id');

    expect(content).to.eql(seasonContent());
    expect(client.get.lastCall.args[0]).to.include('id');
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
    type: 'radio',
    media: 'http://localhost:8181/sites/default/files/audio/media.mp3',
    duration: '1:35:27',
    episode: 1,
    season: 1,
    seriesId: 665,
    thumbnail: {
      alt: 'Foo Bar',
      url: 'http://localhost:8181/sites/default/files/2018-08/Screen%20Shot%202018-08-20%20at%2010.21.54_0.png',
    },
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
    type: 'video',
    media: 'http://localhost:8181/sites/default/files/video/media.mp4',
    duration: '1:35:27',
    episode: 1,
    season: 1,
    seriesId: 665,
    thumbnail: {
      alt: 'Foo Bar',
      url: 'http://localhost:8181/sites/default/files/2018-08/Screen%20Shot%202018-08-20%20at%2010.21.54_0.png',
    },
  };
}

function flatPageContent() {
  return {
    id: 3491,
    title: 'Foo article',
    type: 'page',
    description: {
      raw: '<p>Foo article description</p>',
      sanitized: '<p>Foo article description</p>',
    },
    standFirst: 'Foo article stand first',
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
      type: 'video',
      media: 'http://foo/video/video.mp4',
      duration: '18:41',
      episode: 1,
      season: 1,
      seriesId: 694,
      thumbnail: {
        alt: '',
        url: 'foo.image.png',
      },
    },
    {
      id: 2,
      title: 'Bar episode',
      description: {
        raw: '<p>bar description</p>',
        sanitized: '<p>bar description</p>',
        summary: '',
      },
      type: 'radio',
      media: 'http://foo/audio/audio.mp3',
      duration: '19:37',
      episode: 2,
      season: 1,
      seriesId: 694,
      thumbnail: {
        alt: '',
        url: 'bar.img.png',
      },
    },
  ];
}
