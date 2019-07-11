const { getEventTitle } = require('../../server/utils/index');
const { getEventTitleTestData } = require('../test-data');

describe('Utils', () => {
  describe('getEventTitle()', () => {
    getEventTitleTestData.forEach(testData => {
      it(`should return the correct title when given ${
        testData.description
      }`, () => {
        expect(getEventTitle(testData.event)).to.equal(testData.output);
      });
    });
  });
});
