const createHubMenuService = require('../../server/services/hubMenu');

describe('#hubMenuService', () => {
  it('returns an navigation', async () => {
    const repository = {
      mainMenu: sinon.stub().returns('A main Menu'),
      tagsMenu: sinon.stub().returns('A tags menu'),
    };
    const service = createHubMenuService(repository);
    const result = await service.navigationMenu();

    return expect(result).to.eql({
      mainMenu: 'A main Menu',
      topicsMenu: 'A tags menu',
    });
  });
});
