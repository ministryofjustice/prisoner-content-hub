const createHubContentService = require('../../server/services/hubContent');

describe('#hubContentService', () => {
  it('returns content for a given ID', async () => {
    const contentRepository = {
      contentFor: sinon
        .stub()
        .returns({ title: 'foo', href: 'www.foo.com', type: 'foo' }),
    };
    const service = createHubContentService(contentRepository);
    const result = await service.contentFor('contentId');

    expect(result).to.eql({ title: 'foo', href: 'www.foo.com', type: 'foo' });
  });

  it('returns radio show content', async () => {
    const contentRepository = {
      contentFor: sinon.stub().returns({
        id: 1,
        title: 'foo',
        href: 'www.foo.com',
        contentType: 'radio',
        seriesId: 'seriesId',
        tagsId: [12],
      }),
      termFor: sinon.stub().returns({ name: 'foo series name', id: 'foo' }),
      seasonFor: sinon
        .stub()
        .returns([
          { title: 'foo episode', id: 1 },
          { id: 2, title: 'bar episode' },
        ]),
    };

    const service = createHubContentService(contentRepository);
    const result = await service.contentFor(1);

    expect(result).to.eql({
      id: 1,
      title: 'foo',
      href: 'www.foo.com',
      contentType: 'radio',
      seriesId: 'seriesId',
      seriesName: 'foo series name',
      tagsId: [12],
      season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
      tags: [{ name: 'foo series name', id: 'foo' }],
    });

    expect(contentRepository.termFor.lastCall.args[0]).to.equal('seriesId');
    expect(contentRepository.seasonFor.lastCall.args[0]).to.equal('seriesId');
  });

  it('returns video show content', async () => {
    const contentRepository = {
      contentFor: sinon.stub().returns({
        id: 1,
        title: 'foo',
        href: 'www.foo.com',
        contentType: 'video',
        tagsId: [],
        seriesId: 'seriesId',
      }),
      termFor: sinon.stub().returns({ name: 'foo series name' }),
      seasonFor: sinon
        .stub()
        .returns([
          { title: 'foo episode', id: 1 },
          { id: 2, title: 'bar episode' },
        ]),
    };

    const service = createHubContentService(contentRepository);
    const result = await service.contentFor(1);

    expect(result).to.eql({
      id: 1,
      title: 'foo',
      href: 'www.foo.com',
      contentType: 'video',
      seriesId: 'seriesId',
      tagsId: [],
      seriesName: 'foo series name',
      season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
      tags: [],
    });

    expect(contentRepository.termFor.lastCall.args[0]).to.equal('seriesId');
    expect(contentRepository.seasonFor.lastCall.args[0]).to.equal('seriesId');
  });

  describe('landing page', () => {
    const establishmentId = 'establishmentId';
    const content = {
      id: 'foo-id',
      contentType: 'landing-page',
      featuredContentId: 'featuredContentId',
      categoryId: 'categoryId',
      establishmentId,
    };

    const createContentRepository = () => ({
      relatedContentFor: sinon.stub().returns([]),
      contentFor: sinon
        .stub()
        .onFirstCall()
        .returns(content)
        .onSecondCall()
        .returns('fooBar'),
    });

    const createMenuRepository = () => ({
      categoryMenu: sinon.stub().returns('categoryMenu'),
    });

    it('returns landing page content', async () => {
      const contentRepository = createContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService(
        contentRepository,
        menuRepository,
      );
      const result = await service.contentFor(content.id, establishmentId);

      expect(result).to.have.property('id', content.id);
      expect(result).to.have.property('contentType', content.contentType);
      expect(result).to.have.property(
        'featuredContentId',
        content.featuredContentId,
      );
      expect(result).to.have.property('featuredContent', 'fooBar');
      expect(result).to.have.property('relatedContent');
      expect(result).to.have.property('categoryMenu', 'categoryMenu');
    });

    it('calls for the featured content', async () => {
      const contentRepository = createContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService(
        contentRepository,
        menuRepository,
      );

      await service.contentFor(content.id, establishmentId);

      expect(contentRepository.contentFor.lastCall.lastArg).to.equal(
        'featuredContentId',
        `the featuredContentId was supposed to be ${content.featuredContentId}`,
      );
    });

    it('calls for the related content', async () => {
      const contentRepository = createContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService(
        contentRepository,
        menuRepository,
      );

      await service.contentFor(content.id, establishmentId);

      expect(contentRepository.relatedContentFor.lastCall.lastArg).to.eql(
        {
          id: 'categoryId',
          establishmentId: 'establishmentId',
          sortOrder: undefined,
        },
        `the categoryId was supposed to be "${content.categoryId}"`,
      );
    });

    it('call for the categoryMenu', async () => {
      const contentRepository = createContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService(
        contentRepository,
        menuRepository,
      );

      const expectedResult = {
        categoryId: content.categoryId,
        prisonId: establishmentId,
      };

      await service.contentFor(content.id, establishmentId);

      expect(menuRepository.categoryMenu.lastCall.lastArg).to.eql(
        expectedResult,
        `the call arguments were supposed to be "${JSON.stringify(
          expectedResult,
        )}"`,
      );
    });
  });
});
