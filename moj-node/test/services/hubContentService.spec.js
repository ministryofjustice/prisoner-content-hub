const { createHubContentService } = require('../../server/services/hubContent');

describe('#hubContentService', () => {
  describe('content', () => {
    it('returns content for a given ID', async () => {
      const contentRepository = {
        contentFor: sinon
          .stub()
          .returns({ title: 'foo', href: 'www.foo.com', type: 'foo' }),
      };
      const service = createHubContentService({ contentRepository });
      const result = await service.contentFor('contentId');

      expect(result).to.eql({
        title: 'foo',
        href: 'www.foo.com',
        type: 'foo',
      });
    });

    ['radio', 'video'].forEach(contentType => {
      it(`returns ${contentType} show content`, async () => {
        const contentRepository = {
          contentFor: sinon.stub().returns({
            id: 1,
            title: 'foo',
            href: 'www.foo.com',
            contentType,
            seriesId: 'seriesId',
            episodeId: 'episodeId',
            tagsId: [12],
          }),
          suggestedContentFor: sinon
            .stub()
            .returns([{ title: 'foo', href: 'www.foo.com', type: 'foo' }]),
          termFor: sinon.stub().returns({ name: 'foo series name', id: 'foo' }),
          nextEpisodesFor: sinon.stub().returns([
            { id: 1, title: 'foo episode' },
            { id: 2, title: 'bar episode' },
          ]),
        };

        const service = createHubContentService({ contentRepository });
        const result = await service.contentFor(1);

        expect(result).to.eql({
          id: 1,
          title: 'foo',
          href: 'www.foo.com',
          contentType,
          seriesId: 'seriesId',
          seriesName: 'foo series name',
          suggestedContent: [
            {
              href: 'www.foo.com',
              title: 'foo',
              type: 'foo',
            },
          ],
          episodeId: 'episodeId',
          tagsId: [12],
          season: [{ id: 2, title: 'bar episode' }], // hides the current episode from season
          tags: [{ name: 'foo series name', id: 'foo' }],
        });

        expect(contentRepository.termFor.lastCall.args[0]).to.equal(
          'seriesId',
          'The termFor method was called incorrectly',
        );
        expect(
          contentRepository.nextEpisodesFor.lastCall.args[0],
        ).to.have.property(
          'id',
          'seriesId',
          'The nextEpisodeFor method was called incorrectly',
        );

        expect(
          contentRepository.nextEpisodesFor.lastCall.args[0],
        ).to.have.property(
          'episodeId',
          'episodeId',
          'The nextEpisodeFor method was called incorrectly',
        );
      });
    });
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
      suggestedContentFor: sinon
        .stub()
        .returns({ title: 'foo', href: 'www.foo.com', type: 'foo' }),
    });

    const createMenuRepository = () => ({
      categoryMenu: sinon.stub().returns('categoryMenu'),
    });

    const createCategoryFeaturedContentRepository = () => ({
      contentFor: sinon
        .stub()
        .onFirstCall()
        .returns([content])
        .onSecondCall()
        .returns('fooBar'),
    });

    it('returns landing page content', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
      });
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
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
      });

      await service.contentFor(content.id, establishmentId);

      expect(contentRepository.contentFor.lastCall.lastArg).to.equal(
        'featuredContentId',
        `the featuredContentId was supposed to be ${content.featuredContentId}`,
      );
    });

    it('calls for the categoryFeaturedContentRepository', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
      });

      await service.contentFor(content.id, establishmentId);

      expect(
        categoryFeaturedContentRepository.contentFor.lastCall.lastArg,
      ).to.eql(
        {
          categoryId: 'categoryId',
          establishmentId: 'establishmentId',
        },
        `the categoryId was supposed to be "${content.categoryId}"`,
      );
    });

    it('call for the categoryMenu', async () => {
      const contentRepository = createContentRepository();
      const categoryFeaturedContentRepository = createCategoryFeaturedContentRepository();
      const menuRepository = createMenuRepository();
      const service = createHubContentService({
        contentRepository,
        menuRepository,
        categoryFeaturedContentRepository,
      });

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
