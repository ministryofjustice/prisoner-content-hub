const R = require('ramda');

module.exports.idFrom = R.view(R.lensPath(['nid', 0, 'value']));
module.exports.titleFrom = R.view(R.lensPath(['title', 0, 'value']));
module.exports.contentTypeFrom = R.view(R.lensPath(['type', 0, 'target_id']));
module.exports.descriptionValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'value']));
module.exports.descriptionProcessedFrom = R.view(R.lensPath(['field_moj_description', 0, 'processed']));
module.exports.summaryValueFrom = R.view(R.lensPath(['field_moj_description', 0, 'summary']));
module.exports.imageAltFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'alt']));
module.exports.imageUrlFrom = R.view(R.lensPath(['field_moj_thumbnail_image', 0, 'url']));
module.exports.durationFrom = R.view(R.lensPath(['field_moj_duration', 0, 'value']));
module.exports.audioFrom = R.view(R.lensPath(['field_moj_audio', 0, 'url']));

module.exports.seriesFrom = R.prop('field_moj_series');
module.exports.episodeFrom = R.view(R.lensPath(['field_moj_episode', 0, 'value']));
module.exports.seasonFrom = R.view(R.lensPath(['field_moj_season', 0, 'value']));
