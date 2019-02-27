function createHubMenuService(repository) {
  async function navigationMenu() {
    const [mainMenu, topicsMenu] = await Promise.all([
      repository.mainMenu(),
      repository.tagsMenu(),
    ]);

    return {
      mainMenu,
      topicsMenu,
    };
  }

  function seriesMenu() {
    return repository.seriesMenu();
  }

  function homepageMenu(prisonId) {
    return repository.homepageMenu(prisonId);
  }

  function gettingAJobMenu(prisonId) {
    return repository.gettingAJobMenu(prisonId);
  }

  function categoryMenu({ category, prisonId }) {
    return repository.categoryMenu({ category, prisonId });
  }

  return {
    navigationMenu,
    seriesMenu,
    homepageMenu,
    gettingAJobMenu,
    categoryMenu,
  };
}

module.exports = createHubMenuService;
