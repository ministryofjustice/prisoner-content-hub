const logger = require('../../log');
const createMenuService = require('../../server/services/menuService');
const mockJson = require('./mockMenu.json');
const assert = require('assert');
const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;

describe('MenuIsFormattedAsArray', function() {
  it('Should return an array', function() {

    // var contentClientMock = sinon.mock(createMenuService);

    // contentClientMock.expects('getMenu').returns(mockJson);

    menuItems = createMenuService.formatMenu()

    expect(menuItems).to.be.a('array');

  });
});
