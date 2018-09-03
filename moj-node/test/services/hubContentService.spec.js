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
        id: 1,
        title: 'foo',
        href: 'www.foo.com',
        type: 'radio',
        seriesId: 'seriesId',
      }),
      termFor: sinon.stub().returns({ name: 'foo series name' }),
      seasonFor: sinon.stub().returns([{ title: 'foo episode', id: 1 }, { id: 2, title: 'bar episode' }]),
    };

    const service = createHubContentService(repository);
    const result = await service.contentFor(1);

    expect(result).to.eql({
      id: 1,
      title: 'foo',
      href: 'www.foo.com',
      type: 'radio',
      seriesId: 'seriesId',
      seriesName: 'foo series name',
      season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
    });

    expect(repository.termFor.lastCall.args[0]).to.equal('seriesId');
    expect(repository.seasonFor.lastCall.args[0]).to.equal('seriesId');
  });
});
