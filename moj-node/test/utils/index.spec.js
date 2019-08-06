const { relativeUrlFrom } = require('../../server/utils/index');

describe('Utils', () => {
  describe('relativeUrlFrom', () => {
    it('should remove the scheme and host from the url', () => {
      const result = relativeUrlFrom('https://foo.bar.com/some/relative/path');
      expect(result).to.equal('/some/relative/path');
    });
    it('should not alter an already relative url', () => {
      const result = relativeUrlFrom('/some/relative/path');
      expect(result).to.equal('/some/relative/path');
    });
  });
});
