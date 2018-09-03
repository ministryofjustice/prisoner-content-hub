const { prop } = require('ramda');

module.exports = function createHubContentService(repository) {
  async function contentFor(id) {
    const result = await repository.contentFor(id);
    const type = prop('type', result);

    switch (type) {
      case 'radio':
        return radioData(result);
      default:
        return result;
    }
  }

  async function radioData(data) {
    const seriesId = prop('seriesId', data);

    const series = await repository.termFor(seriesId);
    const season = await repository.seasonFor(seriesId);

    return {
      ...data,
      seriesName: prop('name', series),
      season,
    };
  }

  return {
    contentFor,
  };
};
