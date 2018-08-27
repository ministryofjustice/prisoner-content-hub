const createHubMenuService = require('../../server/services/hubMenu');

describe('#hubMenuService', () => {
  it('returns an menu', async () => {
    const repository = {
      menu: sinon.stub().returns([{ title: 'foo', href: 'www.foo.com' }]),
    };
    const service = createHubMenuService(repository);
    const result = await service.menu();

    return expect(result).to.eql([{ title: 'foo', href: 'www.foo.com' }]);
  });
});
