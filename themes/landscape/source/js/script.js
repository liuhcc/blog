(function($){
  // Local search
  var $overlay = $('#search-overlay'),
    $input = $('#search-input'),
    $results = $('#search-results'),
    searchData = null,
    searchLoaded = false,
    activeIndex = -1;

  var loadSearchData = function(callback) {
    if (searchLoaded && searchData) {
      if (callback) callback();
      return;
    }
    var url = $overlay.data('search-url');
    if (!url) return;
    $.getJSON(url, function(data) {
      searchData = data;
      searchLoaded = true;
      if (callback) callback();
    }).fail(function() {
      searchLoaded = true;
      searchData = [];
      if (callback) callback();
    });
  };

  var escapeHtml = function(value) {
    return String(value || '').replace(/[&<>'"]/g, function(character) {
      return {'&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'}[character];
    });
  };

  var highlight = function(value, query) {
    var escapedValue = escapeHtml(value);
    var escapedQuery = escapeHtml(query).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escapedValue.replace(new RegExp('(' + escapedQuery + ')', 'gi'), '<span class="search-highlight">$1</span>');
  };

  var renderResults = function(items, query) {
    if (!items || items.length === 0) {
      $results.html('<div class="search-no-results">' + ($input.val() ? '没有找到结果' : $results.data('placeholder')) + '</div>');
      return;
    }
    var html = '';
    $.each(items, function(i, item) {
      var title = highlight(item.title, query);
      var date = '';
      if (item.url) {
        var m = item.url.match(/(?:^|\/)(\d{4})\/(\d{2})\/(\d{2})\//);
        if (m) date = m[1] + '-' + m[2] + '-' + m[3];
      }
      html += '<a class="search-result-item" href="' + encodeURI(item.url || '#') + '">';
      html += '<div class="search-result-title">' + title + '</div>';
      html += '<div class="search-result-meta">';
      if (item.categories && item.categories.length) html += '<span class="fa fa-folder"></span> ' + escapeHtml(item.categories[0]);
      if (date) html += '<span class="fa fa-calendar"></span> ' + date;
      html += '</div></a>';
    });
    $results.html(html);
    activeIndex = -1;
  };

  var doSearch = function(query) {
    if (!searchData) {
      loadSearchData(function() { doSearch(query); });
      return;
    }
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

  $('.nav-search-btn').on('click', function(e){
    e.preventDefault();
    $overlay.addClass('active');
    $results.html('<div class="search-hint">' + $results.data('placeholder') + '</div>');
    $input.val('');
    loadSearchData();
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
      if (activeIndex >= 0) {
        $items.eq(activeIndex)[0].scrollIntoView({block: 'nearest'});
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      activeIndex = Math.max(activeIndex - 1, -1);
      $items.removeClass('active');
      if (activeIndex >= 0) {
        $items.eq(activeIndex).addClass('active');
        $items.eq(activeIndex)[0].scrollIntoView({block: 'nearest'});
      }
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      window.location.href = $items.eq(activeIndex).attr('href');
    }
  });

  $input.on('input', function(){
    doSearch($(this).val());
  });

  // Article collapse/expand on index
  $('.article-toggle-btn').on('click', function() {
    var $article = $(this).closest('.article');
    var $entry = $article.find('.article-entry');
    var $btn = $(this);
    if ($article.hasClass('collapsed')) {
      $entry.slideDown(200);
      $article.removeClass('collapsed');
      $btn.html('<span class="fa fa-chevron-up"></span> 收起');
    } else {
      $entry.slideUp(200);
      $article.addClass('collapsed');
      $btn.html('<span class="fa fa-chevron-down"></span> 展开');
    }
  });

  // TOC toggle
  $('.toc-header').on('click', function() {
    $(this).closest('.toc-wrap').toggleClass('collapsed');
  });

  // TOC smooth scroll
  $('.toc-link').on('click', function(e) {
    e.preventDefault();
    var target = $(this).attr('href');
    if (target) {
      var $target = $(target);
      if ($target.length) {
        $('html, body').animate({ scrollTop: $target.offset().top - 60 }, 300);
      }
    }
  });

  // Left TOC scrollspy + tree toggle
  var $leftToc = $('#left-toc');
  if ($leftToc.length) {
    var $leftTocLinks = $leftToc.find('.left-toc-link');
    var articleHeadings = [];
    $('.article-entry').find('h1, h2, h3').each(function() {
      if (this.id) {
        articleHeadings.push({ id: this.id, el: this });
      }
    });

    var tocActiveIndex = -1;

    var updateActiveToc = function() {
      if (!articleHeadings.length) return;
      var scrollTop = $(window).scrollTop();
      var winHeight = $(window).height();
      var threshold = 100;
      var newIndex = 0;

      for (var i = articleHeadings.length - 1; i >= 0; i--) {
        var top = $(articleHeadings[i].el).offset().top;
        if (top <= scrollTop + threshold) {
          newIndex = i;
          break;
        }
      }

      // If scrolled to very bottom, highlight last heading
      if (scrollTop + winHeight >= $(document).height() - 50) {
        newIndex = articleHeadings.length - 1;
      }

      if (newIndex !== tocActiveIndex) {
        tocActiveIndex = newIndex;
        var activeId = articleHeadings[newIndex].id;
        $leftTocLinks.removeClass('active');
        var $activeLink = $leftTocLinks.filter('[href="#' + activeId + '"]').addClass('active');

        // Auto-expand collapsed ancestors so active link is visible
        if ($activeLink.length) {
          $activeLink.parents('.left-toc-item.collapsed').each(function() {
            $(this).removeClass('collapsed');
          });

          // Scroll TOC nav to keep active item visible
          var tocNav = $leftToc.find('.left-toc-nav')[0];
          var linkOffset = $activeLink.offset().top;
          var navOffset = $(tocNav).offset().top;
          var relativeTop = linkOffset - navOffset + tocNav.scrollTop;
          var navHeight = tocNav.clientHeight;
          if (relativeTop < tocNav.scrollTop + 30 || relativeTop > tocNav.scrollTop + navHeight - 40) {
            tocNav.scrollTop = relativeTop - navHeight / 2 + $activeLink.height() / 2;
          }
        }
      }
    };

    // Toggle collapse/expand
    $leftToc.on('click', '.toc-toggle-icon', function(e) {
      e.preventDefault();
      e.stopPropagation();
      $(this).closest('.left-toc-item').toggleClass('collapsed');
    });

    // Left TOC link click - smooth scroll
    $leftTocLinks.on('click', function(e) {
      e.preventDefault();
      var target = $(this).attr('href');
      if (target) {
        var $target = $(target);
        if ($target.length) {
          $('html, body').animate({ scrollTop: $target.offset().top - 70 }, 300);
        }
      }
    });

    $(window).on('scroll', function() {
      window.requestAnimationFrame(updateActiveToc);
    });

    // TOC resize handle
    var tocMinWidth = 200;
    var tocMaxWidth = 500;
    var savedTocWidth = localStorage.getItem('left-toc-width');
    if (savedTocWidth) {
      $leftToc.css('width', savedTocWidth + 'px');
    }

    var $tocHandle = $leftToc.find('.toc-resize-handle');
    $tocHandle.on('mousedown', function(e) {
      e.preventDefault();
      var startX = e.clientX;
      var startWidth = $leftToc.outerWidth();
      $('body').addClass('toc-resizing');
      $(document).on('mousemove.tocResize', function(e) {
        var delta = e.clientX - startX;
        var newWidth = Math.min(tocMaxWidth, Math.max(tocMinWidth, startWidth + delta));
        $leftToc.css('width', newWidth + 'px');
      });
      $(document).on('mouseup.tocResize', function() {
        $(document).off('.tocResize');
        $('body').removeClass('toc-resizing');
        localStorage.setItem('left-toc-width', $leftToc.outerWidth());
      });
    });

    // Sidebar resize handle
    var $sidebar = $('#sidebar');
    var $sidebarHandle = $sidebar.find('.sidebar-resize-handle');
    var sidebarMinWidth = 200;
    var sidebarMaxWidth = 500;
    var savedSidebarWidth = localStorage.getItem('sidebar-width');
    if (savedSidebarWidth && $sidebar.length) {
      $sidebar.css('width', savedSidebarWidth + 'px');
    }

    $sidebarHandle.on('mousedown', function(e) {
      e.preventDefault();
      var startX = e.clientX;
      var startWidth = $sidebar.outerWidth();
      $('body').addClass('sidebar-resizing');
      $(document).on('mousemove.sidebarResize', function(e) {
        var delta = startX - e.clientX;
        var newWidth = Math.min(sidebarMaxWidth, Math.max(sidebarMinWidth, startWidth + delta));
        $sidebar.css('width', newWidth + 'px');
      });
      $(document).on('mouseup.sidebarResize', function() {
        $(document).off('.sidebarResize');
        $('body').removeClass('sidebar-resizing');
        localStorage.setItem('sidebar-width', $sidebar.outerWidth());
      });
    });

    // Initial update
    setTimeout(updateActiveToc, 300);
  }

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

  $('#main-nav-toggle').on('click', function(e){
    e.preventDefault();
    if (isMobileNavAnim) return;

    startMobileNavAnim();
    $container.toggleClass('mobile-nav-on');
    stopMobileNavAnim();
  });

  $('#wrap').on('click', function(){
    if (isMobileNavAnim || !$container.hasClass('mobile-nav-on')) return;

    $container.removeClass('mobile-nav-on');
  });

  // Dark mode
  var $darkModeBtn = $('.nav-dark-mode-btn');
  var $darkIcon = $darkModeBtn.find('.fa');
  var isDark = localStorage.getItem('dark-mode') === 'true';

  if (isDark) {
    $('body').addClass('dark-mode');
    $darkIcon.removeClass('fa-moon-o').addClass('fa-sun-o');
  }

  $darkModeBtn.on('click', function(e) {
    e.preventDefault();
    $('body').toggleClass('dark-mode');
    var dark = $('body').hasClass('dark-mode');
    localStorage.setItem('dark-mode', dark);
    if (dark) {
      $darkIcon.removeClass('fa-moon-o').addClass('fa-sun-o');
    } else {
      $darkIcon.removeClass('fa-sun-o').addClass('fa-moon-o');
    }
  });

  // Reading progress
  var $progressBar = $('#reading-progress-bar');
  $(window).on('scroll', function() {
    var scrollTop = $(this).scrollTop();
    var docHeight = $(document).height();
    var winHeight = $(this).height();
    var scrollPercent = (scrollTop / (docHeight - winHeight)) * 100;
    $progressBar.css('width', Math.min(scrollPercent, 100) + '%');
  });

  // Back to top
  var $backToTop = $('#back-to-top');
  $(window).on('scroll', function() {
    if ($(this).scrollTop() > 300) {
      $backToTop.addClass('visible');
    } else {
      $backToTop.removeClass('visible');
    }
  });
  $backToTop.on('click', function() {
    $('html, body').animate({ scrollTop: 0 }, 300);
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
