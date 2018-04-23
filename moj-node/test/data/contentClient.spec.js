const contentClient = require('../../server/data/contentClient');
const menuDataMock = require('../json/menuDataMock.json');

describe('Test to ensure content client works', () => {
  it('Content client returns an array', () => {
    const contentClientMock = sinon.mock(contentClient);
    contentClientMock.expects('getMenu').returns(menuDataMock);
  });
});
