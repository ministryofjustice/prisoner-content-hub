var search = new Bloodhound({
  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('value'),
  queryTokenizer: Bloodhound.tokenizers.whitespace,
  remote: {
    url: '/search/suggest/%QUERY',
    wildcard: '%QUERY',
  },
});

$('#search-wrapper .search-box').typeahead(
  {
    hint: true,
    highlight: true,
    minLength: 3,
  },
  {
    name: 'search-results',
    display: 'title',
    source: search,
  },
);
