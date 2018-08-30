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
    const id = prop('series', data);

    const series = await repository.termFor(id);

    return {
      ...data,
      series: prop('name', series),
    };
  }

  return {
    contentFor,
  };
};
