const R = require('ramda');
const config = require('../config');
const { tagIdFrom, nameFrom } = require('../selectors/hub');

function hubMenuRepository(httpClient) {
  async function mainMenu() {
    const response = await httpClient.get(config.api.hubMenu, {
      _menu: 'main',
    });
    return parseMenuResponse(response);
  }

  async function tagsMenu() {
    const response = await httpClient.get(config.api.tags);
    return parseTagsResponse(response);
  }

  async function seriesMenu() {
    const response = await httpClient.get(config.api.hubMenu, {
      _menu: 'series',
    });
    return parseMenuResponse(response);
  }

  function parseMenuResponse(data = []) {
    if (data === null) return [];

    return data.map(menuItem => ({
      linkText: R.prop('title', menuItem),
      href: `/content/${R.prop('id', menuItem)}`,
      id: R.prop('id', menuItem),
    }));
  }

  function parseTagsResponse(data) {
    if (data === null) return [];

    return Object.keys(data).map(key => ({
      id: tagIdFrom(data[key]),
      linkText: nameFrom(data[key]),
      href: `/tags/${tagIdFrom(data[key])}`,
    }));
  }

  return {
    mainMenu,
    tagsMenu,
    seriesMenu,
  };
}

module.exports = hubMenuRepository;
