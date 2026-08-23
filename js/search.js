(function () {
  'use strict';

  var overlay = document.getElementById('search-overlay');
  var input = document.getElementById('search-input');
  var results = document.getElementById('search-results');
  var closeButton = document.getElementById('search-close');
  var searchButtons = document.querySelectorAll('.nav-search-btn');
  var searchData;
  var searchRequest;
  var activeIndex = -1;

  if (!overlay || !input || !results || !closeButton || !searchButtons.length) return;

  function setMessage(className, message) {
    results.replaceChildren();
    var element = document.createElement('div');
    element.className = className;
    element.textContent = message;
    results.appendChild(element);
  }

  function loadSearchData() {
    if (searchData) return Promise.resolve(searchData);
    if (searchRequest) return searchRequest;

    var url = overlay.dataset.searchUrl;
    if (!url) return Promise.reject(new Error('Search data URL is unavailable.'));

    searchRequest = fetch(url, { credentials: 'same-origin' })
      .then(function (response) {
        if (!response.ok) throw new Error('Unable to load search data.');
        return response.json();
      })
      .then(function (data) {
        searchData = Array.isArray(data) ? data : [];
        return searchData;
      })
      .catch(function (error) {
        searchRequest = null;
        throw error;
      });

    return searchRequest;
  }

  function appendHighlightedText(element, value, query) {
    var text = String(value || '');
    var lowerText = text.toLocaleLowerCase();
    var lowerQuery = query.toLocaleLowerCase();
    var position = 0;
    var matchIndex = lowerText.indexOf(lowerQuery, position);

    while (matchIndex !== -1) {
      element.appendChild(document.createTextNode(text.slice(position, matchIndex)));
      var highlight = document.createElement('span');
      highlight.className = 'search-highlight';
      highlight.textContent = text.slice(matchIndex, matchIndex + query.length);
      element.appendChild(highlight);
      position = matchIndex + query.length;
      matchIndex = lowerText.indexOf(lowerQuery, position);
    }
    element.appendChild(document.createTextNode(text.slice(position)));
  }

  function getDate(url) {
    var match = String(url || '').match(/(?:^|\/)(\d{4})\/(\d{2})\/(\d{2})\//);
    return match ? match[1] + '-' + match[2] + '-' + match[3] : '';
  }

  function createMetaItem(iconClass, text) {
    var wrapper = document.createElement('span');
    var icon = document.createElement('span');
    icon.className = 'fa ' + iconClass;
    wrapper.appendChild(icon);
    wrapper.appendChild(document.createTextNode(' ' + text));
    return wrapper;
  }

  function renderResults(items, query) {
    results.replaceChildren();
    activeIndex = -1;

    if (!items.length) {
      setMessage('search-no-results', '没有找到结果');
      return;
    }

    items.forEach(function (item) {
      var link = document.createElement('a');
      link.className = 'search-result-item';
      link.href = item.url || '#';

      var title = document.createElement('div');
      title.className = 'search-result-title';
      appendHighlightedText(title, item.title, query);
      link.appendChild(title);

      var meta = document.createElement('div');
      meta.className = 'search-result-meta';
      if (Array.isArray(item.categories) && item.categories.length) {
        meta.appendChild(createMetaItem('fa-folder', item.categories[0]));
      }
      var date = getDate(item.url);
      if (date) meta.appendChild(createMetaItem('fa-calendar', date));
      if (meta.childNodes.length) link.appendChild(meta);

      results.appendChild(link);
    });
  }

  function search(query) {
    var normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) {
      setMessage('search-hint', results.dataset.placeholder || '搜索');
      return;
    }

    loadSearchData()
      .then(function (items) {
        if (!overlay.classList.contains('active') || input.value.trim().toLocaleLowerCase() !== normalizedQuery) return;
        renderResults(items.filter(function (item) {
          return String(item.title || '').toLocaleLowerCase().indexOf(normalizedQuery) !== -1 ||
            String(item.content || '').toLocaleLowerCase().indexOf(normalizedQuery) !== -1;
        }), query.trim());
      })
      .catch(function () {
        if (overlay.classList.contains('active')) {
          setMessage('search-no-results', '搜索数据加载失败，请稍后重试');
        }
      });
  }

  function openSearch() {
    overlay.classList.add('active');
    overlay.setAttribute('aria-hidden', 'false');
    input.value = '';
    activeIndex = -1;
    setMessage('search-hint', results.dataset.placeholder || '搜索');
    loadSearchData().catch(function () {});
    window.setTimeout(function () { input.focus(); }, 0);
  }

  function closeSearch() {
    overlay.classList.remove('active');
    overlay.setAttribute('aria-hidden', 'true');
    input.value = '';
    activeIndex = -1;
  }

  searchButtons.forEach(function (button) {
    button.addEventListener('click', function (event) {
      event.preventDefault();
      openSearch();
    });
  });

  closeButton.addEventListener('click', closeSearch);
  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) closeSearch();
  });
  input.addEventListener('input', function () { search(input.value); });

  document.addEventListener('keydown', function (event) {
    if (!overlay.classList.contains('active')) return;
    var items = results.querySelectorAll('.search-result-item');

    if (event.key === 'Escape') {
      event.preventDefault();
      closeSearch();
    } else if (event.key === 'ArrowDown' && items.length) {
      event.preventDefault();
      activeIndex = Math.min(activeIndex + 1, items.length - 1);
      items.forEach(function (item, index) { item.classList.toggle('active', index === activeIndex); });
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'ArrowUp' && items.length) {
      event.preventDefault();
      activeIndex = Math.max(activeIndex - 1, 0);
      items.forEach(function (item, index) { item.classList.toggle('active', index === activeIndex); });
      items[activeIndex].scrollIntoView({ block: 'nearest' });
    } else if (event.key === 'Enter' && activeIndex >= 0 && items[activeIndex]) {
      event.preventDefault();
      window.location.assign(items[activeIndex].href);
    }
  });
}());
