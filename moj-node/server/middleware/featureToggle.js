function isFeatureEnabled(query) {
  return feature => query[feature] && query[feature] === 'true';
}

module.exports = function handleFeatureToggles(features = []) {
  return (req, res, next) => {
    const isEnabled = isFeatureEnabled(req.query);

    const result = features.reduce((acc, currentFeature) => {
      acc[currentFeature] = isEnabled(currentFeature);
      return acc;
    }, {});

    res.locals.features = result;

    next();
  };
};
