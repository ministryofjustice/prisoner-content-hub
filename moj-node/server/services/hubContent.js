const { prop, filter, not, equals, map, path } = require('ramda');
const { fixUrlForProduction } = require('../utils/index');

function createHubContentService({
  contentRepository,
  menuRepository,
  categoryFeaturedContentRepository,
}) {
  async function contentFor(id, establishmentId) {
    if (!id) {
      return {};
    }

    const content = await contentRepository.contentFor(id);
    const prisonId = prop('establishmentId', content);

    if (!canAccessContent(establishmentId, prisonId)) {
      return {};
    }

    const contentType = prop('contentType', content);
    const suggestedContent =
      contentType === 'radio' || contentType === 'video'
        ? await contentRepository.suggestedContentFor({
            id,
            establishmentId,
          })
        : [];
    const videoDataRegExp = new RegExp('<p>VIDEO\\|[^|<]+\\|[^|<]+<', 'g');
    let videoMatches = [];
    /* eslint-disable func-names */
    const rawContent = path(['description', 'raw'], content);

    if (rawContent) {
      videoMatches = Array.from(
        content.description.raw.matchAll(videoDataRegExp),
        function (m) {
          return m[0];
        },
      );
    }
    /* eslint-enable func-names */

    if (videoMatches.length > 0) {
      content.videos = videoMatches.map(videoMatch => {
        return videoMatch
          .replace('<p>VIDEO|', '')
          .slice(0, -1)
          .split('|')
          .map(url => fixUrlForProduction(url));
      });
    }

    switch (contentType) {
      case 'radio':
      case 'video': {
        return media(establishmentId, {
          ...content,
          suggestedContent,
        });
      }
      case 'landing-page':
        return landingPage(establishmentId, {
          ...content,
        });
      default:
        return {
          ...content,
        };
    }
  }

  async function streamFor(url) {
    return contentRepository.streamFor(url);
  }

  async function media(establishmentId, data) {
    const id = prop('id', data);
    const seriesId = prop('seriesId', data);
    const episodeId = prop('episodeId', data);
    const secondaryTags = prop('secondaryTags', data);
    const filterOutCurrentEpisode = filter(item =>
      not(equals(prop('id', item), id)),
    );
    const tagsPromises = map(contentRepository.termFor, secondaryTags);

    const [series, seasons] = await Promise.all([
      contentRepository.termFor(seriesId),
      contentRepository.nextEpisodesFor({
        id: seriesId,
        establishmentId,
        perPage: 3,
        episodeId,
      }),
    ]);

    const tags = await Promise.all(tagsPromises);

    return {
      ...data,
      seriesName: prop('name', series),
      season: seasons ? filterOutCurrentEpisode(seasons) : seasons,
      tags,
    };
  }

  async function landingPage(establishmentId, data) {
    const featuredContentId = prop('featuredContentId', data);
    const categoryId = prop('categoryId', data);

    const [
      featuredContent,
      categoryFeaturedContent,
      categoryMenu,
    ] = await Promise.all([
      contentRepository.contentFor(featuredContentId),
      categoryFeaturedContentRepository.contentFor({
        categoryId,
        establishmentId,
      }),
      menuRepository.categoryMenu({
        categoryId,
        prisonId: establishmentId,
      }),
    ]);

    return {
      ...data,
      featuredContent,
      relatedContent: { contentType: 'default', data: categoryFeaturedContent },
      categoryMenu,
    };
  }

  return {
    contentFor,
    streamFor,
  };
}

function canAccessContent(establishmentId, prisonId) {
  if (!prisonId || !establishmentId) return true;

  if (establishmentId === prisonId) {
    return true;
  }

  return false;
}

module.exports = {
  createHubContentService,
};
