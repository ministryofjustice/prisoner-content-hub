const {
  prop,
  filter,
  not,
  equals,
} = require('ramda');

module.exports = function createHubContentService(repository) {
  async function contentFor(id) {
    const result = await repository.contentFor(id);
    const type = prop('type', result);

    switch (type) {
      case 'radio':
      case 'video':
        return media(result);
      case 'landing-page':
        return landingPage(result);
      default:
        return result;
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

    return {
      ...data,
      featuredContent,
    };
  }

  return {
    contentFor,
  };
};
