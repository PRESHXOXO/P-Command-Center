(function () {
  const ASSET_VERSION = (window.PCC_ASSET_VERSION || '').trim();

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

  function versionedPath(path) {
    if (!ASSET_VERSION) return path;
    return path + (path.includes('?') ? '&' : '?') + 'v=' + encodeURIComponent(ASSET_VERSION);
  }

  function canLazyLoad(pageId) {
    return !!PAGE_PARTIALS[pageId];
  }

  function getPageNode(pageId) {
    return document.getElementById('page-' + pageId);
  }

  function getShellCopy(page) {
    return {
      kicker: page.dataset.shellKicker || page.querySelector('.page-shell-kicker')?.textContent?.trim() || 'Loading Hub',
      title: page.dataset.shellTitle || page.querySelector('.page-shell-title')?.textContent?.trim() || 'Loading',
      copy: page.dataset.shellCopy || page.querySelector('.page-shell-copy')?.textContent?.trim() || 'Preparing this space...'
    };
  }

  function renderShellState(page, options = {}) {
    if (!page || !(window.PccUi && typeof window.PccUi.mountStateCard === 'function')) return;
    const copy = getShellCopy(page);
    window.PccUi.mountStateCard(page, {
      state: options.state || 'loading',
      tone: options.tone || (options.state === 'error' ? 'danger' : 'brand'),
      size: 'regular',
      layout: 'centered',
      className: 'page-shell-card',
      kicker: options.kicker || copy.kicker,
      title: options.title || copy.title,
      copy: options.copy || copy.copy,
      icon: options.icon || (options.state === 'error' ? '!' : '✦'),
      live: options.live || (options.state === 'error' ? 'assertive' : 'polite'),
      actions: options.actions || []
    });
  }

  function resetPageCache(pageId) {
    delete fragmentPromises[pageId];
    const page = getPageNode(pageId);
    if (!page) return page;
    page.dataset.pageLoaded = 'false';
    page.setAttribute('aria-busy', 'true');
    page.classList.add('page-shell-loading');
    return page;
  }

  function retryPageLoad(pageId) {
    const page = resetPageCache(pageId);
    if (!page) return Promise.resolve(null);
    renderShellState(page, { state: 'loading' });
    return ensurePageReady(pageId).catch(() => null);
  }

  function renderPageError(pageId, error) {
    const page = resetPageCache(pageId);
    if (!page) return;
    page.setAttribute('aria-busy', 'false');
    renderShellState(page, {
      state: 'error',
      title: 'This Hub Needs Another Try',
      copy: error?.message || 'We could not load this space right now. Try again in a moment.',
      actions: [{
        label: 'Try Again',
        variant: 'primary',
        onClick: () => { retryPageLoad(pageId); }
      }]
    });
  }

  function loadScriptOnce(src) {
    const versionedSrc = versionedPath(src);
    if (scriptPromises[versionedSrc]) return scriptPromises[versionedSrc];
    const existing = document.querySelector(`script[src="${versionedSrc}"]`);
    if (existing) {
      scriptPromises[versionedSrc] = Promise.resolve(existing);
      return scriptPromises[versionedSrc];
    }
    scriptPromises[versionedSrc] = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = versionedSrc;
      script.async = false;
      script.dataset.pccDynamic = 'true';
      script.onload = () => resolve(script);
      script.onerror = () => {
        delete scriptPromises[versionedSrc];
        script.remove();
        reject(new Error('Could not load script: ' + src));
      };
      document.body.appendChild(script);
    });
    return scriptPromises[versionedSrc];
  }

  function loadStyleOnce(href) {
    const versionedHref = versionedPath(href);
    if (stylePromises[versionedHref]) return stylePromises[versionedHref];
    const existing = document.querySelector(`link[rel="stylesheet"][href="${versionedHref}"]`);
    if (existing) {
      stylePromises[versionedHref] = Promise.resolve(existing);
      return stylePromises[versionedHref];
    }
    stylePromises[versionedHref] = new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = versionedHref;
      link.dataset.pccDynamic = 'true';
      link.onload = () => resolve(link);
      link.onerror = () => {
        delete stylePromises[versionedHref];
        link.remove();
        reject(new Error('Could not load stylesheet: ' + href));
      };
      document.head.appendChild(link);
    });
    return stylePromises[versionedHref];
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

    fragmentPromises[pageId] = fetch(versionedPath(PAGE_PARTIALS[pageId]), { cache: 'no-store' })
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
    try {
      const page = await ensurePageMarkup(pageId);
      await ensurePageAssets(pageId);
      if (pageId === 'vision' && window.VisionStudio && typeof window.VisionStudio.mount === 'function') {
        window.VisionStudio.mount();
      }
      return page;
    } catch (error) {
      renderPageError(pageId, error);
      throw error;
    }
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
      document.querySelectorAll('.page-shell-loading[data-page-lazy="true"]').forEach((page) => {
        renderShellState(page, { state: 'loading' });
      });
      bindPrefetchHints();
      warmKnownPages();
    });
  } else {
    document.querySelectorAll('.page-shell-loading[data-page-lazy="true"]').forEach((page) => {
      renderShellState(page, { state: 'loading' });
    });
    bindPrefetchHints();
    warmKnownPages();
  }
})();
