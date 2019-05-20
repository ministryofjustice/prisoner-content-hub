const R = require('ramda');
const config = require('../config');
const { tagIdFrom, nameFrom } = require('../selectors/hub');

const berwynNav = require('../data/berwyn-homepage-nav.json');
const waylandNav = require('../data/wayland-homepage-nav.json');
const berwynGAJMenu = require('../data/berwyn-step-by-step.json');
const waylandGAJMenu = require('../data/wayland-step-by-step.json');

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

  function homepageMenu(prisonId) {
    switch (prisonId) {
      case 792:
        return berwynNav;
      case 793:
        return waylandNav;
      default:
        return [];
    }
  }

  async function categoryMenu({ categoryId, prisonId }) {
    const response = await httpClient.get(config.api.categoryMenu, {
      _category: categoryId,
      _prison: prisonId,
    });

    return parseCategoryMenu(response, prisonId, categoryId);
  }

  function gettingAJobMenu(prisonId) {
    switch (prisonId) {
      case 792:
        return berwynGAJMenu;
      case 793:
        return waylandGAJMenu;
      default:
        return [];
    }
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

    const tags = Object.keys(data).map(key => ({
      id: tagIdFrom(data[key]),
      linkText: nameFrom(data[key]),
      href: `/tags/${tagIdFrom(data[key])}`,
    }));

    const sortAlphabetically = (a, b) => {
      if (
        a.linkText.charAt(0).toLowerCase() > b.linkText.charAt(0).toLowerCase()
      ) {
        return 1;
      }
      return -1;
    };

    return tags.sort(sortAlphabetically);
  }

  function parseCategoryMenu(data, prisonId, categoryId) {
    if (data === null) return [];

    const series = parseTagsResponse(data.series_ids);
    // const secondaryTags = parseTagsResponse(data.secondary_tag_ids);

    // inject extra link
    if (Number(prisonId) === 793 && Number(categoryId) === 645) {
      const link = {
        id: 'working-in-wayland',
        linkText: 'Working in Wayland',
        href: '/working-in-wayland',
      };

      return [link, ...series];
    }

    return series;
  }

  return {
    mainMenu,
    tagsMenu,
    seriesMenu,
    homepageMenu,
    gettingAJobMenu,
    categoryMenu,
  };
}

module.exports = hubMenuRepository;
