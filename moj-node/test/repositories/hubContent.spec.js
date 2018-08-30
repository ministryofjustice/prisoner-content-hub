const hubContentRepository = require('../../server/repositories/hubContent');
const radioShowResponse = require('../resources/radioShow.json');
const metaDataResponse = require('../resources/metadata.json');
const flatPageContentResponse = require('../resources/flatPageContent.json');

describe('hubContentRepository', () => {
  it('returns formated data for radio shows', async () => {
    const client = generateClient(radioShowResponse);
    const repository = hubContentRepository(client);
    const content = await repository.contentFor('id');

    expect(content).to.eql(radioContent());
    expect(client.get.lastCall.args[0]).to.include('id');
  });

  it('returns term meta data', async () => {
    const client = generateClient(metaDataResponse);
    const repository = hubContentRepository(client);
    const content = await repository.termFor('id');

    expect(content).to.eql({ name: 'Foo metadata' });
    expect(client.get.lastCall.args[0]).to.include('id');
  });

  it('returns formated data for flat page contents', async () => {
    const client = generateClient(flatPageContentResponse);
    const repository = hubContentRepository(client);
    const content = await repository.contentFor('id');

    expect(content).to.eql(flatPageContent());
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
    series: 665,
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
    body: {
      sanitized: '<p>Foo article description</p>',
    },
    standFirst: 'Foo article stand first',
  };
}
