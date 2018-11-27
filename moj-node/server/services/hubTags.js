module.exports = function createHubTagsService(repository) {
  async function termFor(id) {
    const content = await repository.termFor(id);

    let relatedContent;

    switch (content.type) {
      case 'series':
        relatedContent = await repository.seasonFor(id);
        break;
      default:
        relatedContent = await repository.relatedContentFor({ id });
    }

    return {
      ...content,
      relatedContent,
    };
  }

  function relatedContentFor({ id, perPage, offset }) {
    return repository.relatedContentFor({ id, perPage, offset });
  }

  return {
    termFor,
    relatedContentFor,
  };
};
