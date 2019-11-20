$(document).ready(function() {
  var audio = $('#audioPlayer');
  var programmeCode = audio.data().programmeCode;
  var title = audio.data().title;
  var extendConfig = audio.data().config || {};
  var name = title + '|' + programmeCode;

  var evt25 = once(analyticsAudioEvent({ action: '25%', name: name }));
  var evt50 = once(analyticsAudioEvent({ action: '50%', name: name }));
  var evt75 = once(analyticsAudioEvent({ action: '75%', name: name }));
  var evt90 = once(analyticsAudioEvent({ action: '90%', name: name }));

  var config = {
    name: title,
    size: {
      width: '100%',
      height: 'auto',
    },
    media: {
      preload: 'metadata',
      mp3: audio.data().media,
      poster: audio.data().poster,
    },
    timeupdate: function(event) {
      var percentage = Math.round(event.jPlayer.status.currentPercentAbsolute);
      if (percentage >= 25 && percentage < 50) {
        evt25();
      } else if (percentage >= 50 && percentage < 75) {
        evt50();
      } else if (percentage >= 75 && percentage < 90) {
        evt75();
      } else if (percentage >= 90) {
        evt90();
      }
    },
  };

  audio.videoPlayer(Object.assign(config, extendConfig));

  function analyticsAudioEvent(config) {
    return function() {
      if (!_paq) return;
      _paq.push(['trackEvent', 'Radio', config.action, config.name]);
    };
  }

  function once(fn) {
    return function() {
      if (fn.called) return;
      var result = fn.apply(this, arguments);

      fn.called = true;

      return result;
    };
  }
});
