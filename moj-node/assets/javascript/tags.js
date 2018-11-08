
(function() {
  var template = document.getElementById('template').innerHTML;
  var relatedContents = document.getElementById('related-contents');
  var contentId = relatedContents.getAttribute('data-content-id');
  var loader = document.querySelector('.ajax-loader');

  var url = "/tags/related-content/" + contentId;
  var customTags = [ '<%', '%>' ];
  var currentOffset = 9;


  // Mustache stuff;
  Mustache.parse(template);
  Mustache.tags = customTags;


  function getContent(query, cb) {
    var request = new XMLHttpRequest();

    request.addEventListener('load', function(response) {
      cb(undefined, response.target);
    });

    request.addEventListener('error', function() {
      cb(true, undefined);
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
    if (currentOffset === null) return;

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

      currentOffset += 9;

      return true;
    });
  }

  window.addEventListener('scroll', (event) => {
    var d = document.documentElement;
    var offset = d.scrollTop + window.innerHeight;
    var height = d.offsetHeight;

    const percentageScrolled = Math.round((offset / height) * 100);

    if (offset === height) {
      addContent(currentOffset);
    }

  });

  // kick things off;
  addContent(currentOffset);
})();
