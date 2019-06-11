const createHubMenuService = require('../../server/services/hubMenu');

describe('#hubMenuService', () => {
  it('returns an series menu', async () => {
    const repository = {
      seriesMenu: sinon.stub().returns('A Menu'),
    };
    const service = createHubMenuService(repository);
    const result = await service.seriesMenu();

    return expect(result).to.eql('A Menu');
  });
});
