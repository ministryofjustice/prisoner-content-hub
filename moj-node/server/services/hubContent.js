const { prop, filter, not, equals, map } = require('ramda');

module.exports = function createHubContentService(repository) {
  async function contentFor(id, establishmentId) {
    const content = await repository.contentFor(id);
    const contentType = prop('contentType', content);
    const prisonId = prop('establishmentId', content);

    if (!canAccessContent(establishmentId, prisonId)) {
      return {};
    }

    switch (contentType) {
      case 'radio':
      case 'video': {
        return media(content);
      }
      case 'landing-page':
        return landingPage(content, establishmentId);
      default:
        return content;
    }
  }

  async function media(data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);
    const tagsId = prop('tagsId', data);
    const filterOutCurrentEpisode = filter(item =>
      not(equals(prop('id', item), id)),
    );
    const tagsPromises = map(repository.termFor, tagsId);

    const [series, seasons] = await Promise.all([
      repository.termFor(seriesId),
      repository.seasonFor(seriesId),
    ]);

    const tags = await Promise.all(tagsPromises);

    return {
      ...data,
      seriesName: prop('name', series),
      season: seasons ? filterOutCurrentEpisode(seasons) : seasons,
      tags,
    };
  }

  async function landingPage(data, establishmentId) {
    let sortOrder;
    const id = prop('id', data);
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    if (id === 3632) {
      // news sort order needs to be in a different order
      sortOrder = 'DESC';
    }

    const [featuredContent, relatedContent, menu] = await Promise.all([
      repository.contentFor(featuredContentId),
      repository.relatedContentFor({
        id: categoryId,
        establishmentId,
        sortOrder,
      }),
      repository.menuFor(id),
    ]);

    return {
      ...data,
      featuredContent,
      relatedContent,
      menu,
    };
  }

  return {
    contentFor,
  };
};

function canAccessContent(establishmentId, prisonId) {
  if (!prisonId || !establishmentId) return true;

  if (establishmentId === prisonId) {
    return true;
  }

  return false;
}
