function createHubMenuService(repository) {
  try {
    const menu = {
      menu: () => repository.menu(),
    };
    return menu;
  } catch (ex) {
    return null;
  }
}

module.exports = createHubMenuService;
