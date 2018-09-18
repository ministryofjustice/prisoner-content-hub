const R = require('ramda');
const config = require('../config');

function hubMenuRepository(httpClient) {
  async function call() {
    const response = await httpClient.get(config.api.hubMenu);
    return parseResponse(response);
  }

  function parseResponse(data = []) {
    if (data === null) return [];

    return data.map(
      obj => ({
        linkText: R.prop('title', obj),
        href: R.prop('link', obj),
      }),
    );
  }

  return {
    menu() {
      return call();
    },
  };
}

module.exports = hubMenuRepository;
