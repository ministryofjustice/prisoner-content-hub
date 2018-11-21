module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent() {
    try {
      const [
        newsAndEvents,
        dayToDay,
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
        musicAndGames,
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
