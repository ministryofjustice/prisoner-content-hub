const { sanitizeTruncateText } = require('../../server/utils');

describe('Utils', () => {
  describe('sanitizeTruncateText', () => {
    context('when the truncation size is within character limit', () => {
      it('Strips html and truncate text/html', () => {
        const text = '<p>foo bar</p> <a href="/foobar">Baz Bar Bat</a> foobar barbaz ay caramba testing pickles crash';
        const expected = 'foo bar Baz Bar Bat foobar barbaz ay caramba...';

        expect(sanitizeTruncateText(text, { size: 44 })).to.equal(expected);
      });
    });

    context('when the truncation size is 0', () => {
      it('strips all content', () => {
        const text = '<p>foo bar Zed Bar</p> <a href="/foobar">Baz Bar Bat Baz Baz Bazzy</a> foobar barbaz ay caramba testing pickles crash';
        const expected = '...';

        expect(sanitizeTruncateText(text, { size: 0 })).to.equal(expected);
      });
    });


    context('when the truncation size is greater then character limit', () => {
      it('Another test that strips html and truncate text/html', () => {
        const text = '<p>foo bar Zed Bar</p> <a href="/foobar">Baz Bar Bat Baz Baz Bazzy</a> foobar barbaz ay caramba testing pickles crash';
        const expected = 'foo bar Zed Bar Baz Bar Bat Baz Baz Bazzy foobar barbaz ay caramba testing pickles crash...';

        expect(sanitizeTruncateText(text, { size: 150 })).to.equal(expected);
      });
    });


    context('when there is no text', () => {
      it('Another test that strips html and truncate text/html', () => {
        const text = '';
        const expected = null;

        expect(sanitizeTruncateText(text, { size: 150 })).to.equal(expected);
      });
    });
  });
});
