const fromHTML = require('from-html/lib/from-html.js');
const relatedContentLoader = require('../../assets/javascript/relatedContentLoader.js');
const renderFeaturedItem = require('../../assets/javascript/renderFeaturedItem.js');
const template = require('./templates/relatedContent.tmpl.js');

const { container, loader } = fromHTML(`
  <div ref="container">
    <span class="ajax-loader" ref="loader" hidden>
  </div>
`);

describe('relatedContentLoader', () => {
  it('calls the onUpdate method on initialization', () => {
    const spy = sinon.spy();
    relatedContentLoader({
      loader,
      endpointUrl: '/server',
      initialOffset: 8,
      perPage: 8,
      onUpdate: updateTemplate,
    });
  });
});
