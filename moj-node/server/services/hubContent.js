const {
  prop,
  filter,
  not,
  equals,
  map,
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
    const tagsId = prop('tagsId', data);
    const filterOutCurrentEpisode = filter(item => not(equals(prop('id', item), id)));
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

  async function landingPage(data) {
    const id = prop('id', data);
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    const [
      featuredContent,
      relatedContent,
      menu,
    ] = await Promise.all([
      repository.contentFor(featuredContentId),
      repository.relatedContentFor({ id: categoryId }),
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
