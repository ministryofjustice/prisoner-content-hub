const {
  prop,
  filter,
  not,
  equals,
} = require('ramda');

module.exports = function createHubContentService(repository) {
  async function contentFor(id) {
    const content = await repository.contentFor(id);
    const type = prop('type', content);

    switch (type) {
      case 'radio':
      case 'video':
        return media(content);
      case 'landing-page':
        return landingPage(content);
      default:
        return content;
    }
  }

  async function media(data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);

    const series = await repository.termFor(seriesId);
    const seasons = await repository.seasonFor(seriesId);
    const filterOutCurrentEpisode = filter(item => not(equals(prop('id', item), id)));

    return {
      ...data,
      seriesName: prop('name', series),
      season: seasons ? filterOutCurrentEpisode(seasons) : seasons,
    };
  }

  async function landingPage(data) {
    const featuredContentId = prop('featuredContentId', data);
    const featuredContent = await repository.contentFor(featuredContentId);
    const categoryId = prop('categoryId', data);
    const relatedContent = await repository.relatedContentFor({ id: categoryId });

    return {
      ...data,
      featuredContent,
      relatedContent,
    };
  }

  return {
    contentFor,
  };
};
