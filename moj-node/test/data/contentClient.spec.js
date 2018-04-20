const contentClient = require('../../server/data/contentClient');

describe('Test to ensure content client works', () => {
  it('Content client returns an array', () => {

    const menuDataMock = require('../json/menuDataMock.json');
    const contentClientMock = sinon.mock(contentClient);
    
    contentClientMock.expects('getMenu').returns(menuDataMock);
  });
});
  