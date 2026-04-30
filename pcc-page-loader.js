(function () {
  const PAGE_PARTIALS = {
    'life-board': './pages/life-board.html',
    'notes': './pages/notes.html',
    'vision': './pages/vision.html',
    'calendar': './pages/calendar.html',
    'community': './pages/community.html',
    'streams': './pages/streams.html',
    'paralegal': './pages/paralegal.html',
    'home': './pages/home.html'
  };

  const PAGE_ASSETS = {
    vision: {
      styles: ['./pcc-vision-studio.css'],
      scripts: ['./pcc-vision-studio.js']
    },
    community: {
      scripts: ['./pcc-community-upgrade.js', './pcc-community-social-upgrade.js']
    }
  };

  const fragmentPromises = Object.create(null);
  const scriptPromises = Object.create(null);
  const stylePromises = Object.create(null);

  function canLazyLoad(pageId) {
    return !!PAGE_PARTIALS[pageId];
  }

  function getPageNode(pageId) {
    return document.getElementById('page-' + pageId);
  }

  function loadScriptOnce(src) {
    if (scriptPromises[src]) return scriptPromises[src];
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      scriptPromises[src] = Promise.resolve(existing);
      return scriptPromises[src];
    }
    scriptPromises[src] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.onload = () => resolve(script);
      script.onerror = () => reject(new Error('Could not load script: ' + src));
      document.body.appendChild(script);
    });
    return scriptPromises[src];
  }

  function loadStyleOnce(href) {
    if (stylePromises[href]) return stylePromises[href];
    const existing = document.querySelector(`link[rel="stylesheet"][href="${href}"]`);
    if (existing) {
      stylePromises[href] = Promise.resolve(existing);
      return stylePromises[href];
    }
    stylePromises[href] = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      link.onload = () => resolve(link);
      link.onerror = () => reject(new Error('Could not load stylesheet: ' + href));
      document.head.appendChild(link);
    });
    return stylePromises[href];
  }

  async function ensurePageAssets(pageId) {
    const assets = PAGE_ASSETS[pageId];
    if (!assets) return;
    for (const href of assets.styles || []) {
      await loadStyleOnce(href);
    }
    for (const src of assets.scripts || []) {
      await loadScriptOnce(src);
    }
  }

  function markPageLoaded(pageId, page, html) {
    page.innerHTML = html;
    page.dataset.pageLoaded = 'true';
    page.removeAttribute('aria-busy');
    page.classList.remove('page-shell-loading');
    document.dispatchEvent(new CustomEvent('pcc:pagecontentloaded', {
      detail: { pageId, page }
    }));
    return page;
  }

  async function ensurePageMarkup(pageId) {
    const page = getPageNode(pageId);
    if (!page || !canLazyLoad(pageId)) return page;
    if (page.dataset.pageLoaded === 'true') return page;
    if (fragmentPromises[pageId]) return fragmentPromises[pageId];

    fragmentPromises[pageId] = fetch(PAGE_PARTIALS[pageId], { cache: 'force-cache' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Could not load the ' + pageId + ' page (' + response.status + ').');
        }
        const html = await response.text();
        return markPageLoaded(pageId, page, html);
      })
      .catch((error) => {
        delete fragmentPromises[pageId];
        throw error;
      });

    return fragmentPromises[pageId];
  }

  async function ensurePageReady(pageId) {
    if (!canLazyLoad(pageId)) return getPageNode(pageId);
    const page = await ensurePageMarkup(pageId);
    await ensurePageAssets(pageId);
    return page;
  }

  function prefetchPageMarkup(pageId) {
    if (!canLazyLoad(pageId)) return;
    const page = getPageNode(pageId);
    if (!page || page.dataset.pageLoaded === 'true' || fragmentPromises[pageId]) return;
    ensurePageMarkup(pageId).catch(() => {});
  }

  function bindPrefetchHints() {
    document.querySelectorAll('.nav-tab[data-page]').forEach((tab) => {
      if (tab.dataset.pagePrefetchBound === 'true') return;
      tab.dataset.pagePrefetchBound = 'true';
      const pageId = tab.dataset.page;
      const prefetch = () => prefetchPageMarkup(pageId);
      tab.addEventListener('mouseenter', prefetch, { passive: true });
      tab.addEventListener('focus', prefetch, { passive: true });
    });
  }

  function warmKnownPages() {
    const warm = () => ['calendar', 'vision', 'community'].forEach(prefetchPageMarkup);
    if (typeof window.requestIdleCallback === 'function') {
      window.requestIdleCallback(warm, { timeout: 1800 });
    } else {
      setTimeout(warm, 900);
    }
  }

  window.ensurePageReady = ensurePageReady;
  window.prefetchPageMarkup = prefetchPageMarkup;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      bindPrefetchHints();
      warmKnownPages();
    });
  } else {
    bindPrefetchHints();
    warmKnownPages();
  }
})();
