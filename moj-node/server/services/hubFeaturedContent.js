module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent() {
    try {
      const [
        newsAndEvents,
        dayToDay,
        games,
        musicAndGames,
        healthyMindAndBody,
        inspiration,
        scienceAndNature,
        artAndCulture,
        history,
        legalAndYourRights,
      ] = await Promise.all([
        repository.newsAndEvents(),
        repository.dayToDay(),
        repository.games(),
        repository.musicAndGames(),
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
        games,
        musicAndGames,
        healthyMindAndBody,
        inspiration,
        scienceAndNature,
        artAndCulture,
        history,
        legalAndYourRights,
      };
    } catch (ex) {
      return null;
    }
  }

  return {
    hubFeaturedContent,
  };
};
