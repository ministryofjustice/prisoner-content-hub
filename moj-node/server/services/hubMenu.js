const createHubMenuService = repository => {
  function seriesMenu() {
    return repository.seriesMenu();
  }

  function primaryMenu() {
    return repository.primaryMenu();
  }

  function tagsMenu() {
    return repository.tagsMenu();
  }

  function allTopics(prisonId) {
    return repository.allTopics(prisonId);
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
    primaryMenu,
    gettingAJobMenu,
    categoryMenu,
    allTopics,
  };
};

module.exports = {
  createHubMenuService,
};
