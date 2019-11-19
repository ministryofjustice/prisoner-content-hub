(function () {
  var search = new Bloodhound({
    datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
    queryTokenizer: Bloodhound.tokenizers.whitespace,
    remote: {
      url: '/search/suggest?query=%QUERY',
      wildcard: '%QUERY'
    }
  });

  $('#search-wrapper .search-box').typeahead(
    {
      hint: true,
      highlight: true,
      minLength: 3
    },
    {
      name: 'search-results',
      display: 'title',
      source: search,
      templates: {
        suggestion: createSuggestionList
      }
    }
  );

  function createSuggestionList(value) {
    var query = value._query.replace(/\s+/, ' ');
    var title = value.title;
    var url = value.url || '#';
    var tokens = query.split(' ');

    var title_tokens = title.split(' ');

    for (var j = 0; j < title_tokens.length; j++) {
      for (var i = 0; i < tokens.length; i++) {
        var token = title_tokens[j].toLowerCase();
        var query_token = tokens[i].toLowerCase();
        var rx = new RegExp(query_token, 'i');
        if (rx.test(token)) {
          title_tokens[j] = title_tokens[j].replace(rx, function (match) {
            return '<strong>' + match + '</strong>';
          });
          break;
        }
      }
    }

    var title = title_tokens.join(' ');

    // prettier-ignore
    return (
      '<a role="option" class="govuk-link  govuk-link--no-visited-state tt-suggestion tt-selectable" href="' + url + '">' + title + '</a>'
    );
  }
})();
