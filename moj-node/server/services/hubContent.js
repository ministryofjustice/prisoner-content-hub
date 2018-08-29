module.exports = function createHubContentService(repository) {
  return {
    contentFor: id => repository.contentFor(id),
  };
};
