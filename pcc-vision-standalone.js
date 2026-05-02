(function () {
  const AUTH_SESSION_KEY = 'pcc-auth-session';
  const TOKEN_KEY = 'pcc-sb-token';
  const THEME_KEY = 'pcc-user-theme';
  const STORAGE_KEY = 'pcc-vision-board';
  const DB_TABLE = 'user_data';
  const PCC_RUNTIME_ENV = (typeof process !== 'undefined' && process && process.env) ? process.env : {};
  const PCC_RUNTIME_CONFIG = (typeof window !== 'undefined' && window.__PCC_CONFIG__) ? window.__PCC_CONFIG__ : {};
  const DEFAULT_THEME = {
    mode: 'light',
    teal: '#0A7266',
    tealMid: '#0D9488',
    tealLight: '#14B8A6',
    font: 'elegant'
  };
  const FONT_LINKS = {
    elegant: null,
    modern: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap',
    classic: 'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600&family=Lato:wght@300;400&display=swap',
    minimal: null
  };
  const FONT_VARS = {
    elegant: { display: "'Cormorant Garamond', serif", ui: "'DM Sans', sans-serif" },
    modern: { display: "'Inter', sans-serif", ui: "'Inter', sans-serif" },
    classic: { display: "'Playfair Display', serif", ui: "'Lato', sans-serif" },
    minimal: { display: "'Georgia', serif", ui: "system-ui, sans-serif" }
  };

  let SUPABASE_URL = '';
  let SUPABASE_KEY = '';
  let runtimeConfigPromise = null;

  window.__PCC_VISION_STANDALONE_PAGE__ = true;

  function applyRuntimeConfig(partial) {
    if (!partial || typeof partial !== 'object') return;
    const normalized = {};
    Object.entries(partial).forEach(([key, value]) => {
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed) normalized[key] = trimmed;
        return;
      }
      if (value != null) normalized[key] = value;
    });
    if (typeof window !== 'undefined') {
      window.__PCC_CONFIG__ = Object.assign(window.__PCC_CONFIG__ || {}, normalized);
    }
    Object.assign(PCC_RUNTIME_CONFIG, normalized);
    SUPABASE_URL = PCC_RUNTIME_ENV.SUPABASE_URL
      || PCC_RUNTIME_CONFIG.SUPABASE_URL
      || '';
    SUPABASE_KEY = PCC_RUNTIME_ENV.API_KEY
      || PCC_RUNTIME_ENV.SUPABASE_ANON_KEY
      || PCC_RUNTIME_CONFIG.API_KEY
      || PCC_RUNTIME_CONFIG.SUPABASE_ANON_KEY
      || '';
  }

  function getStoredTheme() {
    try {
      const raw = localStorage.getItem(THEME_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (error) {
      return null;
    }
  }

  function normalizeTheme(theme) {
    const merged = { ...DEFAULT_THEME, ...(theme || {}) };
    if (!FONT_VARS[merged.font]) merged.font = DEFAULT_THEME.font;
    merged.mode = merged.mode === 'dark' ? 'dark' : 'light';
    return merged;
  }

  function setColorVars(theme) {
    const root = document.documentElement;
    const teal = theme.teal || DEFAULT_THEME.teal;
    const tealMid = theme.tealMid || DEFAULT_THEME.tealMid;
    const tealLight = theme.tealLight || DEFAULT_THEME.tealLight;
    const red = parseInt(teal.slice(1, 3), 16);
    const green = parseInt(teal.slice(3, 5), 16);
    const blue = parseInt(teal.slice(5, 7), 16);
    root.style.setProperty('--teal', teal);
    root.style.setProperty('--teal-mid', tealMid);
    root.style.setProperty('--teal-light', tealLight);
    root.style.setProperty('--teal-rgb', `${red}, ${green}, ${blue}`);
  }

  function applyFontVars(fontKey) {
    const selected = FONT_VARS[fontKey] ? fontKey : DEFAULT_THEME.font;
    const vars = FONT_VARS[selected];
    const root = document.documentElement;
    root.style.setProperty('--font-display', vars.display);
    root.style.setProperty('--font-ui', vars.ui);
    const href = FONT_LINKS[selected];
    if (href && !document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, JSON.stringify(theme));
      localStorage.setItem('cc-theme', theme.mode);
    } catch (error) {}
  }

  function applyTheme(mode) {
    const stored = normalizeTheme(getStoredTheme() || DEFAULT_THEME);
    const next = normalizeTheme({ ...stored, mode });
    document.documentElement.setAttribute('data-theme', next.mode);
    setColorVars(next);
    applyFontVars(next.font);
    saveTheme(next);
    const toggle = document.getElementById('vision-theme-toggle');
    if (toggle) toggle.textContent = next.mode === 'dark' ? 'Light' : 'Dark';
  }

  function getStoredAuthSession() {
    try {
      return JSON.parse(localStorage.getItem(AUTH_SESSION_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function getStoredToken() {
    try {
      return JSON.parse(localStorage.getItem(TOKEN_KEY) || 'null');
    } catch (error) {
      return null;
    }
  }

  function getCurrentUserId() {
    const auth = getStoredAuthSession();
    if (auth?.id) return String(auth.id);
    const token = getStoredToken();
    if (token?.user?.id) return String(token.user.id);
    return null;
  }

  function setUserLabel() {
    const auth = getStoredAuthSession();
    const tokenUser = getStoredToken()?.user || null;
    const name = auth?.firstName || auth?.email || tokenUser?.user_metadata?.first_name || tokenUser?.email || 'Vision Studio';
    const label = document.getElementById('vision-standalone-user');
    if (label) label.textContent = name;
  }

  function safeShowToast(message) {
    let toast = document.getElementById('vision-standalone-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'vision-standalone-toast';
      toast.style.cssText = "position:fixed;bottom:22px;left:50%;transform:translateX(-50%) translateY(18px);background:rgba(10,18,42,0.88);color:#f7fbff;padding:.8rem 1.15rem;border-radius:999px;border:1px solid rgba(255,255,255,0.12);box-shadow:0 20px 44px rgba(4,8,24,0.28);font-family:var(--font-ui,'DM Sans',sans-serif);font-size:.78rem;font-weight:600;letter-spacing:.02em;z-index:9999;opacity:0;pointer-events:none;transition:opacity .22s ease, transform .22s ease;";
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(18px)';
    }, 2400);
  }

  function getSupabaseConfigError() {
    if (SUPABASE_URL && SUPABASE_KEY) return null;
    return { message: 'Missing Supabase configuration for Vision Studio.' };
  }

  async function loadRuntimeConfigFromServer() {
    if (typeof window === 'undefined' || !window.location || !/^https?:$/i.test(window.location.protocol)) return;
    const response = await fetch('/api/pcc-config', {
      cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    if (!response.ok) {
      throw new Error('Could not load runtime config (' + response.status + ').');
    }
    const payload = await response.json().catch(() => ({}));
    applyRuntimeConfig(payload);
  }

  async function ensureSupabaseConfig() {
    if (SUPABASE_URL && SUPABASE_KEY) return null;
    if (!runtimeConfigPromise) {
      runtimeConfigPromise = loadRuntimeConfigFromServer().catch((error) => {
        runtimeConfigPromise = null;
        throw error;
      });
    }
    try {
      await runtimeConfigPromise;
    } catch (error) {}
    return getSupabaseConfigError();
  }

  async function syncToCloud(section, data) {
    const userId = getCurrentUserId();
    const token = getStoredToken()?.access_token;
    if (!userId || !token) return;
    const configError = await ensureSupabaseConfig();
    if (configError) return;
    try {
      await fetch(
        SUPABASE_URL + '/rest/v1/' + DB_TABLE + '?on_conflict=' + encodeURIComponent('user_id,section'),
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + token,
            Prefer: 'resolution=merge-duplicates,return=minimal'
          },
          body: JSON.stringify({
            user_id: userId,
            section,
            data,
            updated_at: new Date().toISOString()
          })
        }
      );
    } catch (error) {}
  }

  async function loadVisionBoardFromCloud() {
    const userId = getCurrentUserId();
    const token = getStoredToken()?.access_token;
    if (!userId || !token) return null;
    const configError = await ensureSupabaseConfig();
    if (configError) return null;
    try {
      const url = SUPABASE_URL + '/rest/v1/' + DB_TABLE
        + '?select=data'
        + '&user_id=eq.' + encodeURIComponent(userId)
        + '&section=eq.' + encodeURIComponent('vision-board')
        + '&limit=1';
      const response = await fetch(url, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: 'Bearer ' + token
        }
      });
      const rows = await response.json().catch(() => []);
      if (!response.ok || !Array.isArray(rows) || !rows[0]?.data) return null;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(rows[0].data));
      return rows[0].data;
    } catch (error) {
      return null;
    }
  }

  async function logoutVisionStudio() {
    try {
      const token = getStoredToken()?.access_token;
      const configError = await ensureSupabaseConfig();
      if (!configError && token) {
        await fetch(SUPABASE_URL + '/auth/v1/logout', {
          method: 'POST',
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: 'Bearer ' + token
          }
        });
      }
    } catch (error) {}
    try { localStorage.removeItem(AUTH_SESSION_KEY); } catch (error) {}
    try { localStorage.removeItem(TOKEN_KEY); } catch (error) {}
    try { localStorage.removeItem('pcc-sb-recovery'); } catch (error) {}
    window.location.replace('./index.html');
  }

  function returnToCommandCenter() {
    window.location.href = './index.html';
  }

  async function bootstrap() {
    applyRuntimeConfig(PCC_RUNTIME_CONFIG);
    const storedTheme = normalizeTheme(getStoredTheme() || {
      ...DEFAULT_THEME,
      mode: localStorage.getItem('cc-theme') === 'dark' ? 'dark' : 'light'
    });
    applyTheme(storedTheme.mode);
    setUserLabel();

    if (!getCurrentUserId() || !getStoredToken()?.access_token) {
      window.location.replace('./index.html');
      return;
    }

    await loadVisionBoardFromCloud();
  }

  window.safeShowToast = safeShowToast;
  window.syncToCloud = syncToCloud;
  window.toggleVisionStandaloneTheme = function () {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  };
  window.logoutVisionStudio = logoutVisionStudio;
  window.returnToCommandCenter = returnToCommandCenter;
  window.loadVisionBoardFromCloud = loadVisionBoardFromCloud;
  window.__PCC_VISION_PREFLIGHT__ = bootstrap().finally(() => {
    window.__PCC_VISION_PREFLIGHT_DONE__ = true;
  });
})();
