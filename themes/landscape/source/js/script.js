(function($){
  // Local search
  var $overlay = $('#search-overlay'),
    $input = $('#search-input'),
    $results = $('#search-results'),
    searchData = null,
    activeIndex = -1;

  var loadSearchData = function() {
    if (searchData) return;
    $.getJSON($overlay.data('search-url'), function(data) {
      searchData = data;
    });
  };

  var renderResults = function(items, query) {
    if (!items || items.length === 0) {
      $results.html('<div class="search-no-results">' + ($input.val() ? 'No results found' : $results.data('placeholder')) + '</div>');
      return;
    }
    var html = '';
    var regex = new RegExp('(' + query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
    $.each(items, function(i, item) {
      var title = item.title.replace(regex, '<span class="search-highlight">$1</span>');
      var date = '';
      if (item.url) {
        var m = item.url.match(/^\/(\d{4})\/(\d{2})\/(\d{2})\//);
        if (m) date = m[1] + '-' + m[2] + '-' + m[3];
      }
      html += '<a class="search-result-item" href="' + item.url + '">';
      html += '<div class="search-result-title">' + title + '</div>';
      html += '<div class="search-result-meta">';
      if (item.categories && item.categories.length) html += '<span>' + item.categories[0] + '</span>';
      if (date) html += '<span>' + date + '</span>';
      html += '</div></a>';
    });
    $results.html(html);
    activeIndex = -1;
  };

  var doSearch = function(query) {
    if (!searchData) return;
    query = query.trim().toLowerCase();
    if (!query) {
      $results.html('<div class="search-hint">' + $results.data('placeholder') + '</div>');
      return;
    }
    var results = [];
    $.each(searchData, function(i, item) {
      if (item.title.toLowerCase().indexOf(query) !== -1) {
        results.push(item);
      } else if (item.content && item.content.toLowerCase().indexOf(query) !== -1) {
        results.push(item);
      }
    });
    renderResults(results, query);
  };

  $('.nav-search-btn').on('click', function(){
    loadSearchData();
    $overlay.addClass('active');
    $results.html('<div class="search-hint">' + $results.data('placeholder') + '</div>');
    setTimeout(function(){ $input.focus(); }, 100);
  });

  $('#search-close').on('click', function(){
    $overlay.removeClass('active');
    $input.val('');
  });

  $overlay.on('click', function(e){
    if ($(e.target).is('#search-overlay')) {
      $overlay.removeClass('active');
      $input.val('');
    }
  });

  $(document).on('keydown', function(e){
    if (!$overlay.hasClass('active')) return;
    var $items = $results.find('.search-result-item');
    if (e.key === 'Escape') {
      $overlay.removeClass('active');
      $input.val('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      activeIndex = Math.min(activeIndex + 1, $items.length - 1);
      $items.removeClass('active').eq(activeIndex).addClass('active');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      $items.removeClass('active');
      if (activeIndex >= 0) $items.eq(activeIndex).addClass('active');
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = $items.eq(activeIndex).attr('href');
    }
  });

  $input.on('input', function(){
    doSearch($(this).val());
  });

  // Share
  $('body').on('click', function(){
    $('.article-share-box.on').removeClass('on');
  }).on('click', '.article-share-link', function(e){
    e.stopPropagation();

    var $this = $(this),
      url = $this.attr('data-url'),
      encodedUrl = encodeURIComponent(url),
      id = 'article-share-box-' + $this.attr('data-id'),
      title = $this.attr('data-title'),
      offset = $this.offset();

    if ($('#' + id).length){
      var box = $('#' + id);

      if (box.hasClass('on')){
        box.removeClass('on');
        return;
      }
    } else {
      var html = [
        '<div id="' + id + '" class="article-share-box">',
          '<input class="article-share-input" value="' + url + '">',
          '<div class="article-share-links">',
            '<a href="https://twitter.com/intent/tweet?text=' + encodeURIComponent(title) + '&url=' + encodedUrl + '" class="article-share-twitter" target="_blank" title="Twitter"><span class="fa fa-twitter"></span></a>',
            '<a href="https://www.facebook.com/sharer.php?u=' + encodedUrl + '" class="article-share-facebook" target="_blank" title="Facebook"><span class="fa fa-facebook"></span></a>',
            '<a href="http://pinterest.com/pin/create/button/?url=' + encodedUrl + '" class="article-share-pinterest" target="_blank" title="Pinterest"><span class="fa fa-pinterest"></span></a>',
            '<a href="https://www.linkedin.com/shareArticle?mini=true&url=' + encodedUrl + '" class="article-share-linkedin" target="_blank" title="LinkedIn"><span class="fa fa-linkedin"></span></a>',
          '</div>',
        '</div>'
      ].join('');

      var box = $(html);

      $('body').append(box);
    }

    $('.article-share-box.on').hide();

    box.css({
      top: offset.top + 25,
      left: offset.left
    }).addClass('on');
  }).on('click', '.article-share-box', function(e){
    e.stopPropagation();
  }).on('click', '.article-share-box-input', function(){
    $(this).select();
  }).on('click', '.article-share-box-link', function(e){
    e.preventDefault();
    e.stopPropagation();

    window.open(this.href, 'article-share-box-window-' + Date.now(), 'width=500,height=450');
  });

  // Caption
  $('.article-entry').each(function(i){
    $(this).find('img').each(function(){
      if ($(this).parent().hasClass('fancybox') || $(this).parent().is('a')) return;

      var alt = this.alt;

      if (alt) $(this).after('<span class="caption">' + alt + '</span>');

      $(this).wrap('<a href="' + this.src + '" data-fancybox=\"gallery\" data-caption="' + alt + '"></a>')
    });

    $(this).find('.fancybox').each(function(){
      $(this).attr('rel', 'article' + i);
    });
  });

  if ($.fancybox){
    $('.fancybox').fancybox();
  }

  // Mobile nav
  var $container = $('#container'),
    isMobileNavAnim = false,
    mobileNavAnimDuration = 200;

  var startMobileNavAnim = function(){
    isMobileNavAnim = true;
  };

  var stopMobileNavAnim = function(){
    setTimeout(function(){
      isMobileNavAnim = false;
    }, mobileNavAnimDuration);
  }

  $('#main-nav-toggle').on('click', function(){
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // Category tree toggle
  $('.category-toggle').on('click', function(e){
    e.preventDefault();
    var $node = $(this).parent('.category-node');
    var $posts = $node.children('.category-posts');
    if ($node.hasClass('open')) {
      $posts.slideUp(150);
      $node.removeClass('open');
    } else {
      $posts.slideDown(150);
      $node.addClass('open');
    }
  });
})(jQuery);