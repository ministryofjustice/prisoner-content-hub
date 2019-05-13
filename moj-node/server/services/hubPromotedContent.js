module.exports = function createHubPromotedContentService(repository) {
  async function hubPromotedContent(
    { establishmentId } = { establishmentId: 0 },
  ) {
    try {
      return repository.hubPromotedContent({ establishmentId });
    } catch (ex) {
      return [];
    }
  }
  return {
    hubPromotedContent,
  };
};
