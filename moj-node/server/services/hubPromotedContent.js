module.exports = function createHubPromotedContentService(repository) {
  async function hubPromotedContent({ establishmentId } = { establishmentId: 0 }) {
    try {
      return repository.hubPromotedContent({ query: { _prison: establishmentId } });
    } catch (ex) {
      return [];
    }
  }
  return {
    hubPromotedContent,
  };
};
