const hubMenuRepository = require('../../server/repositories/hubMenu');
const topicsResponse = require('../resources/tagsContent.json');
const categoryMenuResponse = require('../resources/categoryMenuResponse.json');

describe('hubMenuRepository', () => {
  describe('mainMenu', () => {
    it('returns a navigation Menu', async () => {
      const httpClient = {
        get: sinon.stub().returns([
          { title: 'Foo', link: 'www.foo.com', id: '1' },
          { title: 'Bar', link: 'www.bar.com', id: '2' },
        ]),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ];

      const result = await repository.mainMenu();

      expect(result).to.eql(expected);
    });

    it('returns and empty array when there is no data returned', async () => {
      const httpClient = {
        get: sinon.stub().returns(null),
      };
      const repository = hubMenuRepository(httpClient);
      const expected = [];
      const result = await repository.mainMenu();

      expect(result).to.eql(expected);
    });
  });

  describe('topicsMenu', () => {
    it('returns a topicsMenu', async () => {
      const httpClient = {
        get: sinon.stub().returns(topicsResponse),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        { linkText: 'Bat', href: '/tags/1', id: '1', description: undefined },
        { linkText: 'Baz', href: '/tags/0', id: '0', description: undefined },
      ];
      const result = await repository.tagsMenu();

      expect(result).to.eql(expected);
    });

    it('returns and empty array when there is no data returned', async () => {
      const httpClient = {
        get: sinon.stub().returns(null),
      };
      const repository = hubMenuRepository(httpClient);
      const expected = [];
      const result = await repository.tagsMenu();

      expect(result).to.eql(expected);
    });
  });

  describe('seriesMenu', () => {
    it('returns a series Menu', async () => {
      const httpClient = {
        get: sinon.stub().returns([
          { title: 'Foo', link: 'www.foo.com', id: '1' },
          { title: 'Bar', link: 'www.bar.com', id: '2' },
        ]),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        { linkText: 'Foo', href: '/content/1', id: '1' },
        { linkText: 'Bar', href: '/content/2', id: '2' },
      ];

      const result = await repository.seriesMenu();

      expect(result).to.eql(expected);
    });

    it('returns and empty array when there is no data returned', async () => {
      const httpClient = {
        get: sinon.stub().returns(null),
      };
      const repository = hubMenuRepository(httpClient);
      const expected = [];
      const result = await repository.seriesMenu();

      expect(result).to.eql(expected);
    });
  });

  describe('categoryMenu', () => {
    it('it returns a category menu', async () => {
      const httpClient = {
        get: sinon.stub().returns(categoryMenuResponse),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        {
          id: 798,
          linkText: 'Creative design: Way2Learn',
          href: '/tags/798',
          description: null,
        },
        {
          id: 799,
          linkText: 'Fitness for life: Way2Learn',
          href: '/tags/799',
          description: null,
        },
        {
          id: 800,
          linkText: 'Job smart: Way2Learn',
          href: '/tags/800',
          description: null,
        },
      ];

      const result = await repository.categoryMenu({
        categoryId: 1,
        prisonId: 2,
      });

      expect(result).to.eql(expected);
    });
  });
});
