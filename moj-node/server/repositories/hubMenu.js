const R = require('ramda');
const config = require('../config');
const {
  tagIdFrom,
  nameFrom,
  termDescriptionValueFrom,
} = require('../selectors/hub');

const berwynNav = require('../data/berwyn-homepage-nav.json');
const waylandNav = require('../data/wayland-homepage-nav.json');
const cookhamWoodNav = require('../data/cookhamwood-homepage-nav.json');
const berwynGAJMenu = require('../data/berwyn-step-by-step.json');
const waylandGAJMenu = require('../data/wayland-step-by-step.json');
const cookhamWoodGAJMenu = require('../data/cookhamwood-step-by-step.json');

function hubMenuRepository(httpClient, jsonClient) {
  const sortAlphabetically = (a, b) => {
    if (
      a.linkText.charAt(0).toLowerCase() > b.linkText.charAt(0).toLowerCase()
    ) {
      return 1;
    }
    return -1;
  };

  async function mainMenu() {
    const query = {
      _menu: 'main',
    };
    const response = await httpClient.get(config.api.hubMenu, { query });
    return parseMenuResponse(response);
  }

  async function tagsMenu() {
    const response = await httpClient.get(config.api.tags);
    return parseTagsResponse(response);
  }

  async function primaryMenu(prisonId = 0) {
    const response = await jsonClient.get(config.api.primary);
    return parseJsonResponse(response, prisonId);
  }

  async function allTopics(prisonId) {
    const tags = await tagsMenu();
    const primary = await primaryMenu(prisonId);

    return tags.concat(primary).sort(sortAlphabetically);
  }

  async function seriesMenu() {
    const query = {
      _menu: 'series',
    };
    const response = await httpClient.get(config.api.hubMenu, { query });
    return parseMenuResponse(response);
  }

  function homepageMenu(prisonId) {
    switch (prisonId) {
      case 792:
        return berwynNav;
      case 793:
        return waylandNav;
      case 959:
        return cookhamWoodNav;
      default:
        return [];
    }
  }

  async function categoryMenu({ categoryId, prisonId }) {
    const query = {
      _category: categoryId,
      _prison: prisonId,
    };
    const response = await httpClient.get(config.api.categoryMenu, { query });

    return parseCategoryMenu(response, prisonId, categoryId);
  }

  function gettingAJobMenu(prisonId) {
    switch (prisonId) {
      case 792:
        return berwynGAJMenu;
      case 793:
        return waylandGAJMenu;
      case 959:
        return cookhamWoodGAJMenu;
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

  function parseJsonResponse(data, prisonId) {
    if (data === null) return [];

    const prisonUids = {
      792: 'fd1e1db7-d0be-424a-a3a6-3b0f49e33293', // berwyn
      793: 'b73767ea-2cbb-4ad5-ba22-09379cc07241', // wayland
      959: '9969cd5a-90fa-476c-9f14-3f85b26d23bc', // cookhamwood
    };

    const items = Object.keys(data.data)
      .filter(key => {
        const { relationships } = data.data[key];
        const prisons = R.path(['field_moj_prisons', 'data'], relationships);
        const matchingPrison = prisons.some(
          prison => prison.id === prisonUids[prisonId],
        );

        return prisons.length === 0 || matchingPrison;
      })
      .map(key => {
        const { attributes } = data.data[key];

        return {
          id: attributes.drupal_internal__nid,
          linkText: attributes.title,
          description: R.path(
            ['field_moj_description', 'processed'],
            attributes,
          ),
          href: `/content/${attributes.drupal_internal__nid}`,
        };
      });

    return items.sort(sortAlphabetically);
  }

  function parseTagsResponse(data) {
    if (data === null) return [];

    const tags = Object.keys(data).map(key => ({
      id: tagIdFrom(data[key]),
      linkText: nameFrom(data[key]),
      description: termDescriptionValueFrom(data[key]),
      href: `/tags/${tagIdFrom(data[key])}`,
    }));

    return tags.sort(sortAlphabetically);
  }

  function parseCategoryMenu(data, prisonId, categoryId) {
    if (data === null) return [];

    const series = parseTagsResponse(data.series_ids);
    // const secondaryTags = parseTagsResponse(data.secondary_tag_ids);

    // inject extra link
    if (Number(categoryId) === 645) {
      if (Number(prisonId) === 792) {
        const link = {
          id: 'working-in-berwyn',
          linkText: 'Working in Berwyn',
          href: '/working-in-berwyn',
        };

        return [link, ...series];
      }
      if (Number(prisonId) === 793) {
        const link = {
          id: 'working-in-wayland',
          linkText: 'Working in Wayland',
          href: '/working-in-wayland',
        };

        return [link, ...series];
      }
      if (Number(prisonId) === 959) {
        const link = {
          id: 'working-in-cookhamwood',
          linkText: 'Working in Cookham Wood',
          href: '/working-in-cookhamwood',
        };

        return [link, ...series];
      }
    }

    return series;
  }

  return {
    mainMenu,
    tagsMenu,
    primaryMenu,
    seriesMenu,
    homepageMenu,
    gettingAJobMenu,
    categoryMenu,
    allTopics,
  };
}

module.exports = {
  hubMenuRepository,
};
