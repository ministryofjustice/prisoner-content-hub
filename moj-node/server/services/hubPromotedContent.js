module.exports = function createHubPromotedContentService(repository) {
  async function hubPromotedContent() {
    try {
      return repository.hubPromotedContent();
    } catch (ex) {
      return null;
    }
  }
  return {
    hubPromotedContent,
  };
};
