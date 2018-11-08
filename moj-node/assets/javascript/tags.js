;(function() {
  var template = document.getElementById('template').innerHTML;
  var relatedContents = document.getElementById('related-contents');
  var contentId = relatedContents.getAttribute('data-content-id');
  var loader = document.querySelector('.ajax-loader');

  var url = "/tags/related-content/" + contentId;
  var customTags = [ '<%', '%>' ];
  var currentOffset = 0;
  var paginateOffset = 9


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

    request.open("GET", url + "?perPage=8&offset=" + query.offset);
    request.responseType = "application/json";
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

      const data = JSON.parse(response.responseText);

      updateTemplate(data);

      return true;
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
