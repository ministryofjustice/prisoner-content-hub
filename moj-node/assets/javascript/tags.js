;(function() {
  var template = document.getElementById('template').innerHTML;
  var relatedContents = document.getElementById('related-contents');
  var contentId = relatedContents.getAttribute('data-content-id');
  var loader = document.querySelector('.ajax-loader');
  var sortOrder = contentId == 644  ? 'DESC' : 'ASC'; // 644 news and events
  var url = "/tags/related-content/" + contentId;
  var customTags = [ '<%', '%>' ];
  var currentOffset = 8;
  var paginateOffset = 8;

  var iconType = {
    video: "icon-movie",
    page: "icon-document",
    pdf: "icon-document",
    radio: "icon-music",
    game: "icon-game"
  }

  var linkText = {
    video: "Watch",
    page: "Read",
    pdf: "Read",
    radio: "Listen",
    game: "Play"
  }

  var linkIcon = {
    video: "icon-play",
    page: "icon-link",
    pdf: "icon-link",
    radio: "icon-play",
    game: "icon-link"
  }

  function enhanceData(data) {
    return data.map(function(item){
      return Object.assign(item, {
        linkText: linkText[item.contentType],
        linkIcon: linkIcon[item.contentType],
        iconType: iconType[item.contentType]
      })
    });
  }

  // Mustache stuff;
  Mustache.parse(template);
  Mustache.tags = customTags;

  // Load the first few to;
  addContent(currentOffset);

  // Load the rest as the user scrolls
  window.addEventListener('scroll', handleScroll);

  function getContent(query, callback) {
    var request = new XMLHttpRequest();

    request.addEventListener('load', function(response) {
      callback(undefined, response.target);
    });

    request.addEventListener('error', function() {
      callback(true, undefined);
    });

    request.addEventListener("loadend", function() {
      loader.setAttribute('hidden', true);
    });

    request.open("GET", url + "?perPage=8&offset=" + query.offset + "&sortOrder=" + sortOrder);
    request.setRequestHeader('Accept', 'application/json');

    request.send();

    loader.removeAttribute('hidden');
  }

  function updateTemplate(data) {
    var rendered = Mustache.render(template, {relatedContent: data }, {}, customTags);
    var docFrag = document.createRange().createContextualFragment(rendered);

    relatedContents.appendChild(docFrag);
  };


  function addContent(offset) {
    return getContent({ offset: offset}, function(err, response) {
      if (err) {
        currentOffset = null;
        return false;
      }

      // handle edge case of an empty response
      if (response.responseText.replace(/\s/) === "{}") {
        currentOffset = null;
        return false;
      }

      try {
        var data = JSON.parse(response.responseText);

        if (!data) {
          currentOffset = null;
          return false;
        }

        updateTemplate(enhanceData(data));

        return true;
      } catch (error) {
        console.log(error);
        currentOffset = null;
        return false;
      }
    });
  }

  function handleScroll(event) {
    if (currentOffset === null) return;

    var docElement = document.documentElement;
    var offset = docElement.scrollTop + window.innerHeight;
    var height = docElement.offsetHeight;

    if (offset === height) {
      currentOffset += paginateOffset;

      addContent(currentOffset);
    }
  }
})();
