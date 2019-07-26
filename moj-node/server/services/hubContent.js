const { prop, filter, not, equals, map } = require('ramda');

module.exports = function createHubContentService({
  contentRepository,
  menuRepository,
  categoryFeaturedContentRepository,
}) {
  async function contentFor(id, establishmentId) {
    if (!id) {
      return {};
    }

    const content = await contentRepository.contentFor(id);

    const suggestedContent = await contentRepository.suggestedContentFor({
      id,
      establishmentId,
    });
    const contentType = prop('contentType', content);
    const prisonId = prop('establishmentId', content);

    if (!canAccessContent(establishmentId, prisonId)) {
      return {};
    }

    switch (contentType) {
      case 'radio':
      case 'video': {
        return media(establishmentId, {
          ...content,
          suggestedContent,
        });
      }
      case 'landing-page':
        return landingPage(establishmentId, {
          ...content,
          suggestedContent,
        });
      default:
        return {
          ...content,
          suggestedContent,
        };
    }
  }

  async function media(establishmentId, data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);
    const episodeId = prop('episodeId', data);
    const tagsId = prop('tagsId', data);
    const filterOutCurrentEpisode = filter(item =>
      not(equals(prop('id', item), id)),
    );
    const tagsPromises = map(contentRepository.termFor, tagsId);

    const [series, seasons] = await Promise.all([
      contentRepository.termFor(seriesId),
      contentRepository.nextEpisodesFor({
        id: seriesId,
        establishmentId,
        perPage: 3,
        episodeId,
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

  async function landingPage(establishmentId, data) {
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    const [
      featuredContent,
      categoryFeaturedContent,
      categoryMenu,
    ] = await Promise.all([
      contentRepository.contentFor(featuredContentId),
      categoryFeaturedContentRepository.contentFor({
        categoryId,
        establishmentId,
      }),
      menuRepository.categoryMenu({
        categoryId,
        prisonId: establishmentId,
      }),
    ]);

    return {
      ...data,
      featuredContent,
      relatedContent: { contentType: 'default', data: categoryFeaturedContent },
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
