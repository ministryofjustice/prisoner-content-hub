const createHubContentService = require('../../server/services/hubContent');

describe('#hubContentService', () => {
  it('returns an content', async () => {
    const repository = {
      contentFor: sinon.stub().returns({ title: 'foo', href: 'www.foo.com' }),
    };
    const service = createHubContentService(repository);
    const result = await service.contentFor('id');

    return expect(result).to.eql({ title: 'foo', href: 'www.foo.com' });
  });
});
