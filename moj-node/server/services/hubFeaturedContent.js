module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent() {
    try {
      const [
        newsAndEvents,
        dayToDay,
        music,
        healthyMindAndBody,
        inspiration,
        scienceAndNature,
        artAndCulture,
        history,
        legalAndYourRights,
      ] = await Promise.all([
        repository.newsAndEvents(),
        repository.dayToDay(),
        repository.music(),
        repository.healthyMindAndBody(),
        repository.inspiration(),
        repository.scienceAndNature(),
        repository.artAndCulture(),
        repository.history(),
        repository.legalAndYourRights(),
      ]);

      return {
        newsAndEvents,
        dayToDay,
        music,
        healthyMindAndBody,
        inspiration,
        scienceAndNature,
        artAndCulture,
        history,
        legalAndYourRights,
        games: repository.games(),
      };
    } catch (ex) {
      return null;
    }
  }

  return {
    hubFeaturedContent,
  };
};
