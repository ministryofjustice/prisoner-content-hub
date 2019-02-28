const { prop, filter, not, equals, map } = require('ramda');

module.exports = function createHubContentService(
  contentRepository,
  menuRepository,
) {
  async function contentFor(id, establishmentId) {
    const content = await contentRepository.contentFor(id);
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
    const tagsPromises = map(contentRepository.termFor, tagsId);

    const [series, seasons] = await Promise.all([
      contentRepository.termFor(seriesId),
      contentRepository.seasonFor(seriesId),
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

    const [featuredContent, relatedContent, categoryMenu] = await Promise.all([
      contentRepository.contentFor(featuredContentId),
      contentRepository.relatedContentFor({
        id: categoryId,
        establishmentId,
        sortOrder,
      }),
      menuRepository.categoryMenu({
        categoryId,
        prisonId: establishmentId,
      }),
    ]);

    return {
      ...data,
      featuredContent,
      relatedContent,
      categoryMenu,
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
