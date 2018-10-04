module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent() {
    try {
      const [
        newsAndEvents,
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
