module.exports = function createHubTagsService(repository) {
  async function termFor(id) {
    const content = await repository.termFor(id);
    const relatedContent = await repository.relatedContentFor(id);

    return {
      ...content,
      relatedContent,
    };
  }

  return {
    termFor,
  };
};
