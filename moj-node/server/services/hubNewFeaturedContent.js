module.exports = function createNewHubFeaturedContentService(repository) {
  async function hubFeaturedContent(
    { establishmentId } = { establishmentId: 0 },
  ) {
    try {
      const featured = await repository.contentFor({ establishmentId });

      return {
        featured,
      };
    } catch (ex) {
      return null;
    }
  }

  return {
    hubFeaturedContent,
  };
};
