function createHubMenuService(repository) {
  async function navigationMenu() {
    const mainMenu = await repository.mainMenu();
    const topicsMenu = await repository.tagsMenu();

    return {
      mainMenu,
      topicsMenu,
    };
  }

  return {
    navigationMenu,
  };
}

module.exports = createHubMenuService;
