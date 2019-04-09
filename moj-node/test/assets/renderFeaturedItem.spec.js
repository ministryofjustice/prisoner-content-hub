const chance = require('chance')();
const { createFeaturedItem } = require('../test-helpers');
const createRenderer = require('../../assets/javascript/renderFeaturedItem');
const template = require('./templates/relatedContent.tmpl.js');

describe('renderFeaturedItem', () => {
  it('renders featured items with data', () => {
    const container = document.createElement('DIV');
    const render = createRenderer(template, container);
    const item1 = createFeaturedItem();
    const item2 = createFeaturedItem();
    const data = [item1, item2];

    render(data);

    const children = container.children;

    expect(children.length).to.equal(2);

    data.forEach(item => {
      expect(container.innerHTML).to.include(item.title);
      expect(container.innerHTML).to.include(item.summary);
      expect(container.innerHTML).to.include(item.image.url);
      expect(container.innerHTML).to.include(item.contentUrl);
      expect(container.innerHTML).to.include(item.duration);
    });
  });
});
