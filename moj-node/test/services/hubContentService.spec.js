const createHubContentService = require('../../server/services/hubContent');

describe('#hubContentService', () => {
  it('returns content for a given ID', async () => {
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
        tagsId: [12],
      }),
      termFor: sinon.stub().returns({ name: 'foo series name', id: 'foo' }),
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
      tagsId: [12],
      season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
      tags: [{ name: 'foo series name', id: 'foo' }],
    });

    expect(repository.termFor.lastCall.args[0]).to.equal('seriesId');
    expect(repository.seasonFor.lastCall.args[0]).to.equal('seriesId');
  });

  it('returns video show content', async () => {
    const repository = {
      contentFor: sinon.stub().returns({
        id: 1,
        title: 'foo',
        href: 'www.foo.com',
        type: 'video',
        tagsId: [],
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
      type: 'video',
      seriesId: 'seriesId',
      tagsId: [],
      seriesName: 'foo series name',
      season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
      tags: [],
    });

    expect(repository.termFor.lastCall.args[0]).to.equal('seriesId');
    expect(repository.seasonFor.lastCall.args[0]).to.equal('seriesId');
  });


  describe('landing page', () => {
    const content = {
      id: 'foo-id',
      type: 'landing-page',
      featuredContentId: 'featuredContentId',
      categoryId: 'categoryId',
    };

    const createRepository = () => ({
      relatedContentFor: sinon.stub().returns('relatedContent'),
      contentFor: sinon.stub()
        .onFirstCall()
        .returns(content)
        .onSecondCall()
        .returns('fooBar'),
      menuFor: sinon.stub().returns('fooMenu'),
    });

    it('returns landing page content', async () => {
      const repository = createRepository();
      const service = createHubContentService(repository);
      const result = await service.contentFor(content.id);

      expect(result).to.have.property('type', content.type);
      expect(result).to.have.property('featuredContentId', 'featuredContentId');
      expect(result).to.have.property('featuredContent', 'fooBar');
      expect(result).to.have.property('relatedContent', 'relatedContent');
      expect(result).to.have.property('menu', 'fooMenu');
    });

    it('calls for the featured content', async () => {
      const repository = createRepository();
      const service = createHubContentService(repository);

      await service.contentFor(content.id);

      expect(repository.contentFor.lastCall.lastArg).to.equal('featuredContentId', `the featuredContentId was supposed to be ${content.featuredContentId}`);
    });

    it('calls for the related content', async () => {
      const repository = createRepository();
      const service = createHubContentService(repository);

      await service.contentFor(content.id);

      expect(repository.relatedContentFor.lastCall.lastArg).to.eql({ id: 'categoryId' }, `the categoryId was supposed to be "${content.categoryId}"`);
    });

    it('call for a menu', async () => {
      const repository = createRepository();
      const service = createHubContentService(repository);

      await service.contentFor(content.id);

      expect(repository.menuFor.lastCall.lastArg).to.equal('foo-id', `the foo-id was supposed to be "${content.id}"`);
    });
  });
});
