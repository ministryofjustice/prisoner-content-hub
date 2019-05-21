$(document).ready(function() {
  var audio = $('#audioPlayer');
  var programmeCode = audio.data().programmeCode;
  var title = audio.data().title;
  var name = title + '|' + programmeCode;

  var evt25 = once(matomoAudioEvent({ action: '25%', name: name }));
  var evt50 = once(matomoAudioEvent({ action: '50%', name: name }));
  var evt75 = once(matomoAudioEvent({ action: '75%', name: name }));
  var evt90 = once(matomoAudioEvent({ action: '90%', name: name }));

  $('#audioPlayer').videoPlayer({
    name: audio.attr('data-title'),
    size: {
      width: '100%',
      height: 'auto',
    },
    media: {
      preload: 'metadata',
      mp3: audio.attr('data-media'),
      poster: audio.attr('data-poster'),
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
  });

  function matomoAudioEvent(config) {
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
