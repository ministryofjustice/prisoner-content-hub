const createHubFeaturedContentService = repository => {
  async function hubFeaturedContent(
    { establishmentId } = { establishmentId: 0 },
  ) {
    try {
      const [featured] = await Promise.all([
        repository.contentFor({ establishmentId }),
      ]);

      return {
        featured,
      };
    } catch (error) {
      return null;
    }
  }

  return {
    hubFeaturedContent,
  };
};

module.exports = {
  createHubFeaturedContentService,
};
