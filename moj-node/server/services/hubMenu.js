function createHubMenuService(repository) {
  function seriesMenu() {
    return repository.seriesMenu();
  }

  function tagsMenu() {
    return repository.tagsMenu();
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
    seriesMenu,
    tagsMenu,
    homepageMenu,
    gettingAJobMenu,
    categoryMenu,
  };
}

module.exports = createHubMenuService;
