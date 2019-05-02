const { prop, filter, not, equals, map } = require('ramda');

module.exports = function createHubContentService({
  contentRepository,
  menuRepository,
  categoryFeaturedContentRepository,
}) {
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
        return media(establishmentId, content);
      }
      case 'landing-page':
        return landingPage(content, establishmentId);
      default:
        return content;
    }
  }

  async function media(establishmentId, data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);
    const tagsId = prop('tagsId', data);
    const filterOutCurrentEpisode = filter(item =>
      not(equals(prop('id', item), id)),
    );
    const tagsPromises = map(contentRepository.termFor, tagsId);

    const [series, seasons] = await Promise.all([
      contentRepository.termFor(seriesId),
      contentRepository.seasonFor({
        id: seriesId,
        establishmentId,
        perPage: 30,
        offset: 0,
      }),
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
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    const [featuredContent, relatedContent, categoryMenu] = await Promise.all([
      contentRepository.contentFor(featuredContentId),
      categoryFeaturedContentRepository.hubContentFor({
        query: {
          _number: 8,
          _category: categoryId,
          _prison: establishmentId,
        },
      }),
      menuRepository.categoryMenu({
        categoryId,
        prisonId: establishmentId,
      }),
    ]);

    return {
      ...data,
      featuredContent,
      relatedContent: { contentType: 'default', data: relatedContent },
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
