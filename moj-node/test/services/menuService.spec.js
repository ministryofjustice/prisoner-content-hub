const createMenuService = require('../../server/services/menuService');
const contentClient = require('../../server/data/contentClient');
const menuDataMock = require('../json/menuDataMock.json');

const menuService = createMenuService(contentClient);


describe('Test to ensure the getMenuElement functions as expected', () => {
  let s;
  beforeEach(() => {
    s = sinon.sandbox.create();
  });
  afterEach(() => {
    s.restore();
  });

  it('returns an object', () => {
    s.stub(contentClient, 'getMenu').resolves(menuDataMock);

    const menuElement = menuService.getMenuElement();
    return expect(menuElement).to.eventually.to.be.a('object');
  });
});


describe('Test to ensure the formatMenu functions as expected', () => {
  it('returns an array', () => {
    const formattedMenu = menuService.formatMenu(menuDataMock);
    expect(formattedMenu).to.be.a('array');
  });
});

