module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent() {
    try {
      const [
        newsAndEvents,
        // games,
        radioShowsAndPodcasts,
        // healthyMindAndBody,
        // inspiration,
        // scienceAndNature,
        // artAndCulture,
        // history,
      ] = await Promise.all([
        repository.newsAndEvents(),
        // repository.games(),
        repository.radioShowsAndPodcasts(),
        // repository.healthyMindAndBody(),
        // repository.inspiration(),
        // repository.scienceAndNature(),
        // repository.artAndCulture(),
        // repository.history(),
      ]);

      return {
        newsAndEvents,
        // games,
        radioShowsAndPodcasts,
        // healthyMindAndBody,
        // inspiration,
        // scienceAndNature,
        // artAndCulture,
        // history,
      };
    } catch (ex) {
      return null;
    }
  }

  return {
    hubFeaturedContent,
  };
};
