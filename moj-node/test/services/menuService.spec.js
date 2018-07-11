const createMenuService = require('../../server/services/menuService');

describe('#menuService', () => {
  it('returns an menu', async () => {
    const contentClient = {
      getMenu: sinon.stub().resolves([
        { below: [{ title: 'title' }] },
      ]),
    };
    const menuService = createMenuService(contentClient);
    const menuElement = menuService.getMenuElement();

    return expect(menuElement).to.eventually.eql({
      menu: ['title'],
    });
  });
});
