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
    var reg = new RegExp(query, 'gi');
    var url = value.url || '#';
    var label = title.replace(reg, function (match) {
      return '<strong>' + match + '</strong>';
    });

    // prettier-ignore
    return (
      '<a role="option" class="govuk-link  govuk-link--no-visited-state tt-suggestion tt-selectable" href="' + url + '">' + label + '</a>'
    );
  }
})();
