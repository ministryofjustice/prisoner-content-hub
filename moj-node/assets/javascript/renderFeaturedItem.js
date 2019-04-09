(function() {
  function createRenderer(template, rootElement) {
    var customTags = ['<%', '%>'];
    Mustache.parse(template);
    Mustache.tags = customTags;

    return function(data) {
      const relatedContent = { relatedContent: data };
      var rendered = Mustache.render(template, relatedContent, {}, customTags);
      var docFrag = document.createRange().createContextualFragment(rendered);

      rootElement.appendChild(docFrag);
    };
  }

  if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = createRenderer;
  } else {
    window.createRenderer = createRenderer;
  }
})();
