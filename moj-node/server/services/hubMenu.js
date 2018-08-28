function createHubMenuService(repository) {
  try {
    return {
      menu: () => repository.menu(),
    };
  } catch (ex) {
    return null;
  }
}

module.exports = createHubMenuService;
