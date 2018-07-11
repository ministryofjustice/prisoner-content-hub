const nock = require('nock');
const contentClient = require('../../server/data/contentClient');
const menuDataMock = require('../resources/menuDataMock.json');

describe('Tests to ensure content client works', () => {
  beforeEach(() => {
    nock('http://hub-be/api')
      .get('/menu_items/admin?_format=json')
      .reply(200, menuDataMock, { 'Content-Type': 'application/json' });
  });
  afterEach(() => {
    nock.cleanAll();
  });

  it('Content client returns a promise', () => expect(contentClient.getMenu())
    .to.eventually.to.be.an('array'));

  it('Promise returns menu array', () => expect(contentClient.getMenu())
    .to.eventually.deep.equal(menuDataMock));
});
