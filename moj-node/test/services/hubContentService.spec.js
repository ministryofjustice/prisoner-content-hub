const createHubContentService = require('../../server/services/hubContent');

describe('#hubContentService', () => {
  it('returns an content', async () => {
    const repository = {
      contentFor: sinon.stub().returns({ title: 'foo', href: 'www.foo.com', type: 'foo' }),
    };
    const service = createHubContentService(repository);
    const result = await service.contentFor('contentId');

    expect(result).to.eql({ title: 'foo', href: 'www.foo.com', type: 'foo' });
  });

  it('returns radio show content', async () => {
    const repository = {
      contentFor: sinon.stub().returns({
        id: 'radioContentId',
        title: 'foo',
        href: 'www.foo.com',
        type: 'radio',
        series: 'seriesId',
      }),
      termFor: sinon.stub().returns({ name: 'foo series name' }),
    };

    const service = createHubContentService(repository);
    const result = await service.contentFor('radioContentId');

    expect(result).to.eql({
      id: 'radioContentId',
      title: 'foo',
      href: 'www.foo.com',
      type: 'radio',
      series: 'foo series name',
    });

    expect(repository.termFor.lastCall.args[0]).to.equal('seriesId');
  });
});
