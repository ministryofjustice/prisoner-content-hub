const striptags = require('striptags');


function sanitizeTruncateText(text, opts = { size: 100 }) {
  if (!text) return null;

  const sanitized = striptags(text);
  return `${sanitized.substring(0, opts.size)}...`;
}


module.exports = {
  sanitizeTruncateText,
};
