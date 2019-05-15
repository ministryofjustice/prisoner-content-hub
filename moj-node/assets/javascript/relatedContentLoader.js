(function() {
  function relatedContentLoader(options) {
    if (!options) {
      options = {};
    }
    var url = options.endpointUrl;
    var currentOffset = options.initialOffset;
    var paginateOffset = options.perPage;

    var iconType = {
      video: 'icon-movie',
      page: 'icon-document',
      pdf: 'icon-document',
      radio: 'icon-music',
      game: 'icon-game',
    };

    var linkText = {
      video: 'Watch',
      page: 'Read',
      pdf: 'Read',
      radio: 'Listen',
      game: 'Play',
    };

    var linkIcon = {
      video: 'icon-play',
      page: 'icon-link',
      pdf: 'icon-link',
      radio: 'icon-play',
      game: 'icon-link',
    };

    // Load the first few to;
    updateApp(currentOffset);

    // Load the rest as the user scrolls
    window.addEventListener('scroll', handleScroll);

    function getContent(query, callback) {
      var request = new XMLHttpRequest();
      var requestUrl = url + '&offset=' + query.offset;

      request.addEventListener('load', function(response) {
        callback(undefined, response.target);
      });

      request.addEventListener('error', function() {
        callback(true, undefined);
      });

      request.addEventListener('loadend', function() {
        options.loader.setAttribute('hidden', true);
      });

      request.open('GET', requestUrl);
      request.setRequestHeader('Accept', 'application/json');

      request.send();

      options.loader.removeAttribute('hidden');
    }

    function addContentIconData(data) {
      return data.map(function(item) {
        return Object.assign(item, {
          linkText: linkText[item.contentType],
          linkIcon: linkIcon[item.contentType],
          iconType: iconType[item.contentType],
        });
      });
    }

    function updateApp(offset) {
      return getContent({ offset: offset }, function(err, response) {
        if (err) {
          currentOffset = null;
          return false;
        }

        // handle edge case of an empty response
        if (response.responseText.replace(/\s/) === '{}') {
          currentOffset = null;
          return false;
        }

        try {
          var data = JSON.parse(response.responseText);

          if (!data.length) {
            currentOffset = null;
            return false;
          }

          options.onUpdate(addContentIconData(data));

          return true;
        } catch (error) {
          console.log(error);
          currentOffset = null;
          return false;
        }
      });
    }

    function handleScroll() {
      if (currentOffset === null) return;

      var docElement = document.documentElement;
      var offset = docElement.scrollTop + window.innerHeight;
      var height = docElement.offsetHeight;

      if (offset === height) {
        currentOffset += paginateOffset;
        updateApp(currentOffset);
      }
    }
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = relatedContentLoader;
  } else {
    window.relatedContentLoader = relatedContentLoader;
  }
})();
