require('dotenv').config({ path: '.env-test' });

const jsdom = require('jsdom');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const chaiString = require('chai-string');
const expect = require('chai').expect;
const sinonChai = require('sinon-chai');

const { JSDOM } = jsdom;
// Test Assertion libraries
chai.use(chaiAsPromised);
chai.use(chaiString);
chai.use(sinonChai);

// JSDOM
const exposedProperties = [
  'window',
  'navigator',
  'document',
  'localStorage',
  'sessionStorage',
];
const { document } = new JSDOM(``, {
  url: 'http://example.org/',
  referrer: 'http://example.com/',
  contentType: 'text/html',
  includeNodeLocations: true,
  storageQuota: 10000000,
}).window;

global.document = document;
global.window = document.defaultView;
global.window.printJSON = obj => console.log(JSON.stringify(obj, null, 2));
global.window.scrollTo = () => {};

Object.keys(document.defaultView).forEach(property => {
  if (typeof global[property] === 'undefined') {
    exposedProperties.push(property);
    global[property] = document.defaultView[property];
  }
});

// Document createRange Polyfill
document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
  createContextualFragment: html => {
    const fromHTML = require('from-html/lib/from-html.js');

    const frag = document.createDocumentFragment();
    const decoratedHTML = `<div ref="container">${html}</div>`;
    const { container } = fromHTML(decoratedHTML);

    for (const child of [...container.children]) {
      frag.appendChild(child);
    }

    return frag;
  },
});

global.navigator = {
  userAgent: 'node.js',
};

global.expect = chai.expect;
global.sinon = sinon;
global.expect = expect;
