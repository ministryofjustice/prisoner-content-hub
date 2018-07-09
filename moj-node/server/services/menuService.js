module.exports = function createMenuService(contentClient) {
  const getMenuElement = async () => {
    const data = await contentClient.getMenu();
    return {
      menu: formatMenu(data),
    };
  };

  const formatMenu = (result) => {
    const menuItems = result[0].below;
    return Object.keys(menuItems).map(key => menuItems[key].title);
  };

  return {
    getMenuElement,
  };
};
