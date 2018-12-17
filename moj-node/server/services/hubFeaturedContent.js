module.exports = function createHubFeaturedContentService(repository) {
  async function hubFeaturedContent({ establishmentId } = { establishmentId: 0 }) {
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
        repository.newsAndEvents({ establishmentId }),
        repository.dayToDay({ establishmentId }),
        repository.music({ establishmentId }),
        repository.healthyMindAndBody({ establishmentId }),
        repository.inspiration({ establishmentId }),
        repository.scienceAndNature({ establishmentId }),
        repository.artAndCulture({ establishmentId }),
        repository.history({ establishmentId }),
        repository.legalAndYourRights({ establishmentId }),
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
