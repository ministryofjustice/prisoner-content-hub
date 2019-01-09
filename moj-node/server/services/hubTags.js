module.exports = function createHubTagsService(repository) {
  async function termFor(id, establishmentId) {
    const content = await repository.termFor(id);

    let relatedContent;

    switch (content.type) {
      case 'series':
        relatedContent = await repository.seasonFor(id);
        break;
      default:
        relatedContent = await repository.relatedContentFor({ id, establishmentId });
    }

    return {
      ...content,
      relatedContent,
    };
  }

  async function relatedContentFor({
    id, establishmentId, perPage, offset, sortOrder,
  }) {
    const result = await repository.relatedContentFor({
      id, establishmentId, perPage, offset, sortOrder,
    });

    return result;
  }

  return {
    termFor,
    relatedContentFor,
  };
};
