const hubMenuRepository = require('../../server/repositories/hubMenu');

describe('hubMenuRepository', () => {
  describe('#menu', () => {
    it('returns a navigation Menu', async () => {
      const httpClient = {
        get: sinon.stub().returns([
          { title: 'Foo link', link: 'www.foo.com', id: '1' },
          { title: 'Bar link', link: 'www.bar.com', id: '2' },
        ]),
      };

      const repository = hubMenuRepository(httpClient);
      const expected = [
        { linkText: 'Foo link', href: 'www.foo.com' },
        { linkText: 'Bar link', href: 'www.bar.com' },
      ];
      const result = await repository.menu();

      expect(result).to.eql(expected);
    });

    context('When there is no data available', async () => {
      const httpClient = {
        get: sinon.stub().returns(null),
      };
      const repository = hubMenuRepository(httpClient());
      const expected = [];
      const result = await repository.menu();

      expect(result).to.eql(expected);
    });
  });
});
