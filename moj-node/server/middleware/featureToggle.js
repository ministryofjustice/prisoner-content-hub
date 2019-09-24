module.exports = function handleFeatureToggles(features = {}) {
  return (req, res, next) => {
    const result = Object.keys(features).reduce((acc, currentFeature) => {
      acc[currentFeature] = features[currentFeature];
      return acc;
    }, {});

    res.locals.features = result;

    next();
  };
};
