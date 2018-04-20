module.exports = function createSomeService() {
  function getSomeData() {
    return {
      text: 'Stuff from some service',
    };
  }

  return {
    getSomeData,
  };
};
