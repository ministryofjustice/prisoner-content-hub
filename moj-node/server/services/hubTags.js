const { prop } = require('ramda');

const createHubTagsService = repository => {
  async function termFor(id, establishmentId) {
    const content = await repository.termFor(id, establishmentId);

    if (!prop('contentType', content)) return null;

    switch (content.contentType) {
      case 'series': {
        const data = await repository.seasonFor({ id, establishmentId });
        return {
          ...content,
          relatedContent: {
            contentType: 'series',
            data,
          },
        };
      }
      default: {
        const data = await repository.relatedContentFor({
          id,
          establishmentId,
        });
        return {
          ...content,
          relatedContent: {
            contentType: 'default',
            data,
          },
        };
      }
    }
  }

  function relatedSeriesFor({ id, establishmentId, perPage, offset }) {
    return repository.seasonFor({
      id,
      establishmentId,
      perPage,
      offset,
    });
  }

  function relatedContentFor({
    id,
    establishmentId,
    perPage,
    offset,
    sortOrder,
  }) {
    return repository.relatedContentFor({
      id,
      establishmentId,
      perPage,
      offset,
      sortOrder,
    });
  }

  return {
    termFor,
    relatedContentFor,
    relatedSeriesFor,
  };
};

module.exports = {
  createHubTagsService,
};
