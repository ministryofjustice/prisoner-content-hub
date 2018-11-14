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

  return {
    navigationMenu,
    seriesMenu,
  };
}

module.exports = createHubMenuService;
