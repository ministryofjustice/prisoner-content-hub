const hubContentRepository = require('../../server/repositories/hubContent');
const radioShowResponse = require('../resources/radioShow.json');

describe('hubContentRepository', () => {
  it('returns formated data for radio shows', async () => {
    const client = generateRadioShowClient();
    const repository = hubContentRepository(client);
    const content = await repository.contentFor('3546');

    expect(content).to.eql(radioContent());
    expect(client.get.lastCall.args[0]).to.include(3546);
  });
});


function generateRadioShowClient() {
  const httpClient = {
    get: sinon.stub().returns(radioShowResponse),
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
    series: [
      665,
      684,
    ],
    thumbnail: {
      alt: 'Foo Bar',
      url: 'http://localhost:8181/sites/default/files/2018-08/Screen%20Shot%202018-08-20%20at%2010.21.54_0.png',
    },
  };
}
