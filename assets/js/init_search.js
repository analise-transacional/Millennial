(function(window){
  if (!window.SimpleJekyllSearch) {
    throw new Error('SimpleJekyllSearch must be present to init search')
  }

  window.SimpleJekyllSearch({
    searchInput: document.querySelector('#search-input'),
    resultsContainer: document.getElementById('results-container'),
    json: '/search.json',
    searchResultTemplate: '<a href="{url}">{title}</a>',
    noResultsText: '<span>Nenhum resultado encontrado</span>'
  })

})(window)