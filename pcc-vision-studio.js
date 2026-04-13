(function(){
  const STORAGE_KEY = 'pcc-vision-board';
  const VERSION = 2;
  const BOARD_WIDTH = 2400;
  const BOARD_HEIGHT = 1560;
  const MAX_ITEMS = 72;
  const SAVE_DELAY = 220;
  const INPUT_MAX_BYTES = 4 * 1024 * 1024;
  const OUTPUT_MAX_BYTES = 900 * 1024;
  const DEFAULT_SCROLL = { left: 180, top: 120 };
  const PEXELS_LICENSE_URL = 'https://www.pexels.com/license/';

  const FILTERS = ['All', 'Texture', 'Fabric', 'Light', 'Sky', 'Abstract'];

  const FREE_ASSETS = [
    {
      id: 'paper-fibers',
      title: 'Paper Fibers',
      category: 'Texture',
      tone: 'Soft grain for layering behind plans and affirmations.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/5993559/pexels-photo-5993559.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/5993559/pexels-photo-5993559.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 320
    },
    {
      id: 'soft-paper',
      title: 'Soft Paper',
      category: 'Texture',
      tone: 'A brighter editorial backdrop for cleaner layouts.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/5993568/pexels-photo-5993568.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/5993568/pexels-photo-5993568.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 320
    },
    {
      id: 'satin-fuchsia',
      title: 'Fuchsia Satin',
      category: 'Fabric',
      tone: 'Rich movement for glamorous, high-energy boards.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/6276018/pexels-photo-6276018.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/6276018/pexels-photo-6276018.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 310
    },
    {
      id: 'rose-veil',
      title: 'Rose Veil',
      category: 'Fabric',
      tone: 'A softer drape that gives the board some romance.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/6571742/pexels-photo-6571742.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/6571742/pexels-photo-6571742.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 310
    },
    {
      id: 'blush-marble',
      title: 'Blush Marble',
      category: 'Texture',
      tone: 'Editorial surface texture for luxurious layering.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/4709542/pexels-photo-4709542.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/4709542/pexels-photo-4709542.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 340
    },
    {
      id: 'plant-shadow',
      title: 'Plant Shadow',
      category: 'Light',
      tone: 'Use it to add sunlight and calm without clutter.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/2821756/pexels-photo-2821756.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/2821756/pexels-photo-2821756.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 340
    },
    {
      id: 'pink-clouds',
      title: 'Pink Clouds',
      category: 'Sky',
      tone: 'Dreamy sky color for manifestation-style collages.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30614902/pexels-photo-30614902.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30614902/pexels-photo-30614902.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 360
    },
    {
      id: 'twilight-clouds',
      title: 'Twilight Clouds',
      category: 'Sky',
      tone: 'A moodier sky layer with evening energy.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30505082/pexels-photo-30505082.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30505082/pexels-photo-30505082.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 360
    },
    {
      id: 'pink-swirl',
      title: 'Pink Swirl',
      category: 'Abstract',
      tone: 'An abstract flourish for movement and softness.',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=1200',
      w: 300
    }
  ];

  const TEXT_PRESETS = [
    {
      id: 'note',
      label: 'Editorial Note',
      sample: 'A room, a routine, a reality.',
      copy: 'Quick notes, reminders, and practical next moves.',
      placeholder: 'Write the thought that belongs on this board.',
      width: 320
    },
    {
      id: 'quote',
      label: 'Manifesto Quote',
      sample: '"The life is already asking for me."',
      copy: 'A line that sets the emotional temperature for the board.',
      placeholder: 'Write the line that keeps you aligned.',
      width: 360
    },
    {
      id: 'mantra',
      label: 'Focus Statement',
      sample: 'Luxury, discipline, and ease can coexist.',
      copy: 'For the bold truth you want to see at a glance.',
      placeholder: 'What are you calling in on purpose?',
      width: 380
    },
    {
      id: 'goal',
      label: 'Goal Card',
      sample: 'Move to the city. Build the studio. Live the vision.',
      copy: 'A tangible milestone with a little more structure.',
      placeholder: 'Name the milestone you are building toward.',
      width: 340
    }
  ];

  const ACCENTS = [
    { id: 'ribbon', label: 'Ribbon', className: 'ribbon' },
    { id: 'flutter', label: 'Flutter', className: 'flutter' },
    { id: 'bloom', label: 'Bloom', className: 'bloom' },
    { id: 'prism', label: 'Prism', className: 'prism' },
    { id: 'burst', label: 'Burst', className: 'burst' }
  ];

  const TEXT_PRESET_MAP = Object.fromEntries(TEXT_PRESETS.map(entry => [entry.id, entry]));
  const ACCENT_MAP = Object.fromEntries(ACCENTS.map(entry => [entry.id, entry]));
  const ASSET_MAP = Object.fromEntries(FREE_ASSETS.map(entry => [entry.id, entry]));

  const state = {
    root: null,
    mounted: false,
    initialized: false,
    selectedId: null,
    search: '',
    filter: 'All',
    items: [],
    board: {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      scrollLeft: DEFAULT_SCROLL.left,
      scrollTop: DEFAULT_SCROLL.top
    },
    refs: {},
    drag: null,
    saveTimer: null
  };

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#39;');
  }

  function escapeHtmlAttr(value) {
    return escapeHtml(value).replaceAll('\n', '&#10;');
  }

  function notify(message) {
    if (typeof window.safeShowToast === 'function') {
      window.safeShowToast(message);
      return;
    }
    console.log(message);
  }

  function uid() {
    if (window.crypto && typeof window.crypto.randomUUID === 'function') return window.crypto.randomUUID();
    return 'vision-' + Date.now() + '-' + Math.random().toString(16).slice(2);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function normalizeNumber(value, fallback) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function randomRotation(kind) {
    if (kind === 'image') return (Math.random() * 8) - 4;
    if (kind === 'accent') return (Math.random() * 12) - 6;
    return (Math.random() * 4) - 2;
  }

  function getAccentSvg(id) {
    switch (id) {
      case 'ribbon':
        return '<svg viewBox="0 0 140 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M16 58c18-26 43-39 69-39 17 0 31 5 40 13-18 3-34 13-45 29 13 5 23 14 27 25-11-7-27-11-46-10-18 1-33 7-45 16 8-12 8-24 0-34z" fill="currentColor"/><path d="M25 65c19-10 41-12 63-6" stroke="#fff" stroke-opacity=".46" stroke-width="4" stroke-linecap="round"/></svg>';
      case 'flutter':
        return '<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M58 45c-14-24-33-34-44-28-11 7-5 28 18 35-16 4-24 17-18 26 8 10 28 5 44-16z" fill="currentColor"/><path d="M62 45c14-24 33-34 44-28 11 7 5 28-18 35 16 4 24 17 18 26-8 10-28 5-44-16z" fill="currentColor" opacity=".84"/><path d="M60 23v42" stroke="#2c2420" stroke-width="4" stroke-linecap="round"/><path d="M60 24c6-8 12-10 18-11M60 24c-6-8-12-10-18-11" stroke="#2c2420" stroke-width="3" stroke-linecap="round"/><circle cx="38" cy="34" r="4" fill="#fff" opacity=".42"/><circle cx="81" cy="34" r="4" fill="#fff" opacity=".38"/></svg>';
      case 'bloom':
        return '<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><g fill="currentColor"><ellipse cx="60" cy="24" rx="14" ry="18"/><ellipse cx="86" cy="42" rx="14" ry="18" transform="rotate(70 86 42)"/><ellipse cx="76" cy="70" rx="14" ry="18" transform="rotate(144 76 70)"/><ellipse cx="44" cy="70" rx="14" ry="18" transform="rotate(-144 44 70)"/><ellipse cx="34" cy="42" rx="14" ry="18" transform="rotate(-70 34 42)"/></g><circle cx="60" cy="47" r="10" fill="#fff" opacity=".92"/><circle cx="60" cy="47" r="4" fill="currentColor" opacity=".35"/></svg>';
      case 'prism':
        return '<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M26 28h68l-34 40z" fill="currentColor" opacity=".9"/><path d="M40 14h40l14 14H26z" fill="currentColor"/><path d="M60 14l-8 14 8 40 8-40z" fill="#fff" opacity=".34"/><path d="M40 14l12 14M80 14L68 28M26 28h19M75 28h19" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round"/></svg>';
      case 'burst':
        return '<svg viewBox="0 0 120 90" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><path d="M60 10l9 22 23-9-12 21 24 6-24 6 12 21-23-9-9 22-9-22-23 9 12-21-24-6 24-6-12-21 23 9z" fill="currentColor"/><circle cx="60" cy="50" r="9" fill="#fff" opacity=".18"/></svg>';
      default:
        return '';
    }
  }

  function defaultState() {
    return {
      version: VERSION,
      board: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        scrollLeft: DEFAULT_SCROLL.left,
        scrollTop: DEFAULT_SCROLL.top
      },
      items: []
    };
  }

  function normalizeBoard(board) {
    return {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      scrollLeft: clamp(normalizeNumber(board?.scrollLeft, DEFAULT_SCROLL.left), 0, BOARD_WIDTH),
      scrollTop: clamp(normalizeNumber(board?.scrollTop, DEFAULT_SCROLL.top), 0, BOARD_HEIGHT)
    };
  }

  function normalizeItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const kind = item.kind || item.type || 'image';
    const base = {
      id: item.id || uid(),
      x: clamp(normalizeNumber(item.x, 80 + (index * 22)), 0, BOARD_WIDTH - 120),
      y: clamp(normalizeNumber(item.y, 80 + (index * 18)), 0, BOARD_HEIGHT - 120),
      z: normalizeNumber(item.z, index + 1),
      rotation: normalizeNumber(item.rotation, randomRotation(kind))
    };
    if (kind === 'image') {
      if (!item.src) return null;
      return {
        ...base,
        kind: 'image',
        src: item.src,
        label: item.label || 'Free Image',
        credit: item.credit || 'Free image',
        width: clamp(normalizeNumber(item.width || item.w, 320), 220, 520)
      };
    }
    if (kind === 'accent') {
      const accentId = item.accentId || item.type || 'ribbon';
      if (!ACCENT_MAP[accentId]) return null;
      return {
        ...base,
        kind: 'accent',
        accentId,
        label: item.label || ACCENT_MAP[accentId].label,
        width: clamp(normalizeNumber(item.width || item.w, 210), 150, 280)
      };
    }
    const variant = kind === 'text' ? (item.variant || 'note') : kind;
    return {
      ...base,
      kind: 'text',
      variant,
      label: item.label || (TEXT_PRESET_MAP[variant]?.label || 'Vision Card'),
      content: String(item.content || '').trim(),
      placeholder: item.placeholder || (TEXT_PRESET_MAP[variant]?.placeholder || 'Write here.'),
      width: clamp(normalizeNumber(item.width || item.w, TEXT_PRESET_MAP[variant]?.width || 320), 220, 520)
    };
  }

  function migrateLegacyItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const legacyType = item.type || 'image';
    if (legacyType === 'image') {
      return normalizeItem({
        id: item.id,
        kind: 'image',
        x: item.x,
        y: item.y,
        z: item.z,
        width: item.w || item.width || 320,
        rotation: item.rotation,
        src: item.src,
        label: item.label || 'Saved Image',
        credit: item.credit || 'Saved image'
      }, index);
    }
    if (TEXT_PRESET_MAP[legacyType]) {
      return normalizeItem({
        id: item.id,
        kind: 'text',
        variant: legacyType,
        x: item.x,
        y: item.y,
        z: item.z,
        width: item.w || item.width || TEXT_PRESET_MAP[legacyType].width,
        rotation: item.rotation,
        content: item.content || '',
        label: TEXT_PRESET_MAP[legacyType].label
      }, index);
    }
    const accentId = legacyType === 'butterfly' ? 'flutter' : legacyType === 'blossom' ? 'bloom' : legacyType === 'starburst' ? 'burst' : legacyType;
    if (ACCENT_MAP[accentId]) {
      return normalizeItem({
        id: item.id,
        kind: 'accent',
        accentId,
        x: item.x,
        y: item.y,
        z: item.z,
        width: item.w || item.width || 210,
        rotation: item.rotation
      }, index);
    }
    return normalizeItem({
      id: item.id,
      kind: 'text',
      variant: 'label',
      x: item.x,
      y: item.y,
      z: item.z,
      width: 260,
      content: item.label || item.content || legacyType
    }, index);
  }

  function readStoredState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return {
          version: VERSION,
          board: normalizeBoard(null),
          items: parsed.map(migrateLegacyItem).filter(Boolean)
        };
      }
      if (!parsed || typeof parsed !== 'object') return defaultState();
      return {
        version: VERSION,
        board: normalizeBoard(parsed.board),
        items: Array.isArray(parsed.items) ? parsed.items.map(normalizeItem).filter(Boolean) : []
      };
    } catch (error) {
      return defaultState();
    }
  }

  function applyState(nextState) {
    state.items = nextState.items || [];
    state.board = normalizeBoard(nextState.board);
  }

  function payload() {
    return {
      version: VERSION,
      board: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        scrollLeft: clamp(normalizeNumber(state.board.scrollLeft, DEFAULT_SCROLL.left), 0, BOARD_WIDTH),
        scrollTop: clamp(normalizeNumber(state.board.scrollTop, DEFAULT_SCROLL.top), 0, BOARD_HEIGHT)
      },
      items: state.items.map(item => {
        if (item.kind === 'image') {
          return {
            id: item.id,
            kind: 'image',
            x: item.x,
            y: item.y,
            z: item.z,
            rotation: item.rotation,
            width: item.width,
            src: item.src,
            label: item.label,
            credit: item.credit
          };
        }
        if (item.kind === 'accent') {
          return {
            id: item.id,
            kind: 'accent',
            accentId: item.accentId,
            x: item.x,
            y: item.y,
            z: item.z,
            rotation: item.rotation,
            width: item.width,
            label: item.label
          };
        }
        return {
          id: item.id,
          kind: 'text',
          variant: item.variant,
          x: item.x,
          y: item.y,
          z: item.z,
          rotation: item.rotation,
          width: item.width,
          label: item.label,
          placeholder: item.placeholder,
          content: item.content
        };
      })
    };
  }

  function queueSave() {
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => {
      const nextPayload = payload();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(nextPayload));
      } catch (error) {}
      if (typeof window.syncToCloud === 'function') {
        try {
          window.syncToCloud('vision-board', nextPayload);
        } catch (error) {}
      }
    }, SAVE_DELAY);
  }

  function bringToFront(itemId) {
    const maxZ = state.items.reduce((largest, item) => Math.max(largest, normalizeNumber(item.z, 0)), 0) + 1;
    const item = state.items.find(entry => entry.id === itemId);
    if (!item) return;
    item.z = maxZ;
  }

  function createImageItem(asset, position) {
    return normalizeItem({
      kind: 'image',
      src: asset.src,
      label: asset.title,
      credit: 'Free image via ' + asset.source,
      width: asset.w || 320,
      x: position.x,
      y: position.y,
      rotation: randomRotation('image'),
      z: state.items.length + 1
    }, state.items.length);
  }

  function createTextItem(variant, position) {
    const preset = TEXT_PRESET_MAP[variant] || TEXT_PRESET_MAP.note;
    return normalizeItem({
      kind: 'text',
      variant,
      label: preset.label,
      placeholder: preset.placeholder,
      content: '',
      width: preset.width,
      x: position.x,
      y: position.y,
      rotation: randomRotation('text'),
      z: state.items.length + 1
    }, state.items.length);
  }

  function createAccentItem(accentId, position) {
    const accent = ACCENT_MAP[accentId] || ACCENT_MAP.ribbon;
    return normalizeItem({
      kind: 'accent',
      accentId: accent.id,
      label: accent.label,
      width: 210,
      x: position.x,
      y: position.y,
      rotation: randomRotation('accent'),
      z: state.items.length + 1
    }, state.items.length);
  }

  function getViewportPlacement(width, height) {
    const viewport = state.refs.viewport;
    if (!viewport) {
      return { x: 180, y: 140 };
    }
    const jitter = Math.min(40, state.items.length * 8);
    return {
      x: clamp(viewport.scrollLeft + (viewport.clientWidth / 2) - (width / 2) + jitter, 40, BOARD_WIDTH - width - 40),
      y: clamp(viewport.scrollTop + (viewport.clientHeight / 2) - (height / 2) + jitter, 40, BOARD_HEIGHT - height - 40)
    };
  }

  function getPointFromEvent(event, width, height) {
    const artboard = state.refs.artboard;
    if (!artboard) return getViewportPlacement(width, height);
    const rect = artboard.getBoundingClientRect();
    return {
      x: clamp(event.clientX - rect.left - (width / 2), 40, BOARD_WIDTH - width - 40),
      y: clamp(event.clientY - rect.top - (height / 2), 40, BOARD_HEIGHT - height - 40)
    };
  }

  function shellTemplate() {
    return `
      <section class="vision-studio-shell">
        <aside class="vision-studio-sidebar">
          <div class="vision-studio-panel">
            <div class="vision-studio-sidebar-head">
              <div class="vision-studio-kicker">Vision Studio</div>
              <h2 class="vision-studio-sidebar-title">Curate the life you are building.</h2>
              <p class="vision-studio-sidebar-copy">Free-licensed photography, refined text cards, and a scrollable editorial canvas designed to feel more like a premium creative workspace than a simple widget.</p>
              <div class="vision-studio-sidebar-license">
                <span class="vision-studio-pill">Free image bank only</span>
                <span class="vision-studio-pill">Source: Pexels</span>
              </div>
            </div>
            <div class="vision-studio-search-wrap">
              <input id="vision-studio-search" class="vision-studio-search-input" type="text" placeholder="Search textures, skies, light, fabric..." value="${escapeHtmlAttr(state.search)}" />
            </div>
            <div class="vision-studio-filter-row" id="vision-studio-filters"></div>
            <div class="vision-studio-library">
              <div class="vision-studio-library-section">
                <div class="vision-studio-library-head">
                  <div class="vision-studio-library-label">Free Image Bank</div>
                  <div class="vision-studio-library-copy">Click or drag free-licensed imagery onto the board.</div>
                </div>
                <div class="vision-studio-library-grid" id="vision-studio-assets"></div>
              </div>
              <div class="vision-studio-library-section">
                <div class="vision-studio-library-head">
                  <div class="vision-studio-library-label">Editorial Cards</div>
                  <div class="vision-studio-library-copy">For language, focus, and emotional direction.</div>
                </div>
                <div class="vision-studio-preset-grid" id="vision-studio-text-presets"></div>
              </div>
              <div class="vision-studio-library-section">
                <div class="vision-studio-library-head">
                  <div class="vision-studio-library-label">Mood Marks</div>
                  <div class="vision-studio-library-copy">A few soft accents when the collage needs extra movement.</div>
                </div>
                <div class="vision-studio-preset-grid" id="vision-studio-accent-presets"></div>
              </div>
            </div>
          </div>
        </aside>
        <div class="vision-studio-main">
          <div class="vision-studio-panel vision-studio-toolbar">
            <div class="vision-studio-toolbar-copy">
              <h3 class="vision-studio-toolbar-title">Premium manifestation board</h3>
              <p class="vision-studio-toolbar-sub">Upload your own inspiration, paste images from your clipboard, or pull from the curated Pexels bank. Drag from the handle so scrolling stays fluid.</p>
              <div class="vision-studio-toolbar-meta" id="vision-studio-meta"></div>
            </div>
            <div class="vision-studio-toolbar-actions">
              <button class="vision-studio-btn primary" type="button" data-action="upload">Upload Images</button>
              <button class="vision-studio-btn" type="button" data-action="add-note">Add Note</button>
              <button class="vision-studio-btn" type="button" data-action="add-quote">Add Quote</button>
              <button class="vision-studio-btn ghost" type="button" data-action="recenter">Reset View</button>
              <button class="vision-studio-btn danger" type="button" data-action="clear">Clear Board</button>
              <input id="vision-studio-upload" type="file" accept="image/*" multiple hidden />
            </div>
          </div>
          <div class="vision-studio-panel vision-studio-stage-shell">
            <div class="vision-studio-stage-top">
              <div><strong>Scrollable artboard</strong> built for layering, dragging, and visual breathing room.</div>
              <div>Free images stay tied to legal, royalty-free sources only.</div>
            </div>
            <div class="vision-studio-viewport" id="vision-studio-viewport">
              <div class="vision-studio-artboard" id="vision-studio-artboard"></div>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  function renderFilterButtons() {
    const filters = state.refs.filters;
    if (!filters) return;
    filters.innerHTML = FILTERS.map(filter => `
      <button class="vision-studio-filter-btn${filter === state.filter ? ' is-active' : ''}" type="button" data-filter="${escapeHtmlAttr(filter)}">${escapeHtml(filter)}</button>
    `).join('');
  }

  function filteredAssets() {
    const query = state.search.trim().toLowerCase();
    return FREE_ASSETS.filter(asset => {
      const filterMatch = state.filter === 'All' || asset.category === state.filter;
      if (!filterMatch) return false;
      if (!query) return true;
      const haystack = [asset.title, asset.category, asset.tone, asset.source].join(' ').toLowerCase();
      return haystack.includes(query);
    });
  }

  function renderAssets() {
    if (state.refs.assets) {
      const list = filteredAssets();
      state.refs.assets.innerHTML = list.length ? list.map(asset => `
        <button class="vision-studio-asset-card" type="button" draggable="true" data-library-type="image" data-library-id="${escapeHtmlAttr(asset.id)}">
          <img class="vision-studio-asset-thumb" src="${escapeHtmlAttr(asset.thumb)}" alt="${escapeHtmlAttr(asset.title)}" loading="lazy" />
          <span class="vision-studio-asset-meta">
            <span class="vision-studio-asset-kind">${escapeHtml(asset.category)}</span>
            <span class="vision-studio-asset-title">${escapeHtml(asset.title)}</span>
            <span class="vision-studio-asset-copy">${escapeHtml(asset.tone)}</span>
            <span class="vision-studio-asset-source">${escapeHtml(asset.source)} licensed</span>
          </span>
        </button>
      `).join('') : `<div class="vision-studio-empty-copy">No free assets match this search yet. Try a broader word like "sky" or "texture".</div>`;
    }
    if (state.refs.textPresets) {
      state.refs.textPresets.innerHTML = TEXT_PRESETS.map(preset => `
        <button class="vision-studio-text-preset" type="button" draggable="true" data-library-type="text" data-library-id="${escapeHtmlAttr(preset.id)}">
          <span class="vision-studio-text-sample ${escapeHtmlAttr(preset.id)}">${escapeHtml(preset.sample)}</span>
          <span class="vision-studio-text-preset-title">${escapeHtml(preset.label)}</span>
          <span class="vision-studio-text-preset-copy">${escapeHtml(preset.copy)}</span>
        </button>
      `).join('');
    }
    if (state.refs.accentPresets) {
      state.refs.accentPresets.innerHTML = ACCENTS.map(accent => `
        <button class="vision-studio-accent-preset" type="button" draggable="true" data-library-type="accent" data-library-id="${escapeHtmlAttr(accent.id)}">
          <span class="vision-studio-accent-art">${getAccentSvg(accent.id)}</span>
          <span class="vision-studio-accent-title">${escapeHtml(accent.label)}</span>
        </button>
      `).join('');
    }
  }

  function renderMeta() {
    const meta = state.refs.meta;
    if (!meta) return;
    const imageCount = state.items.filter(item => item.kind === 'image').length;
    const textCount = state.items.filter(item => item.kind === 'text').length;
    const accentCount = state.items.filter(item => item.kind === 'accent').length;
    meta.innerHTML = `
      <span class="vision-studio-meta-pill"><span class="vision-studio-meta-label">Pieces</span> ${state.items.length}</span>
      <span class="vision-studio-meta-pill"><span class="vision-studio-meta-label">Images</span> ${imageCount}</span>
      <span class="vision-studio-meta-pill"><span class="vision-studio-meta-label">Words</span> ${textCount}</span>
      <span class="vision-studio-meta-pill"><span class="vision-studio-meta-label">Accents</span> ${accentCount}</span>
    `;
  }

  function renderEmptyState() {
    return `
      <div class="vision-studio-empty">
        <div class="vision-studio-empty-inner">
          <div class="vision-studio-empty-mark">+</div>
          <div class="vision-studio-empty-title">Start with one image.</div>
          <div class="vision-studio-empty-copy">Pull in a free texture or sky from the left, upload your own inspiration, then layer in words and details until the board feels unmistakably yours.</div>
        </div>
      </div>
    `;
  }

  function renderItem(item) {
    const rotation = Number(item.rotation || 0).toFixed(2);
    const selected = item.id === state.selectedId ? ' is-selected' : '';
    if (item.kind === 'image') {
      return `
        <article class="vision-studio-item${selected}" data-item-id="${escapeHtmlAttr(item.id)}" data-item-kind="image" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;z-index:${item.z};--vision-item-rotation:${rotation}deg;">
          <div class="vision-studio-item-shell">
            <div class="vision-studio-item-bar">
              <div class="vision-studio-item-tag">${escapeHtml(item.label || 'Image')}</div>
              <div class="vision-studio-item-actions">
                <button class="vision-studio-item-btn handle" type="button" data-item-handle="${escapeHtmlAttr(item.id)}">Drag</button>
                <button class="vision-studio-item-btn" type="button" data-item-duplicate="${escapeHtmlAttr(item.id)}">Copy</button>
                <button class="vision-studio-item-btn" type="button" data-item-delete="${escapeHtmlAttr(item.id)}">Delete</button>
              </div>
            </div>
            <div class="vision-studio-image-frame">
              <img src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.label || 'Vision image')}" loading="lazy" />
              <div class="vision-studio-image-meta">
                <span class="vision-studio-image-title">${escapeHtml(item.label || 'Image')}</span>
                <span class="vision-studio-image-credit">${escapeHtml(item.credit || 'Free image')}</span>
              </div>
            </div>
          </div>
        </article>
      `;
    }
    if (item.kind === 'accent') {
      const accent = ACCENT_MAP[item.accentId] || ACCENT_MAP.ribbon;
      return `
        <article class="vision-studio-item${selected}" data-item-id="${escapeHtmlAttr(item.id)}" data-item-kind="accent" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;z-index:${item.z};--vision-item-rotation:${rotation}deg;">
          <div class="vision-studio-item-shell">
            <div class="vision-studio-item-bar">
              <div class="vision-studio-item-tag">${escapeHtml(accent.label)}</div>
              <div class="vision-studio-item-actions">
                <button class="vision-studio-item-btn handle" type="button" data-item-handle="${escapeHtmlAttr(item.id)}">Drag</button>
                <button class="vision-studio-item-btn" type="button" data-item-duplicate="${escapeHtmlAttr(item.id)}">Copy</button>
                <button class="vision-studio-item-btn" type="button" data-item-delete="${escapeHtmlAttr(item.id)}">Delete</button>
              </div>
            </div>
            <div class="vision-studio-accent-shell ${escapeHtmlAttr(accent.className)}">
              <div class="vision-studio-accent-frame">${getAccentSvg(accent.id)}</div>
            </div>
          </div>
        </article>
      `;
    }
    const variant = item.variant || 'note';
    const preset = TEXT_PRESET_MAP[variant] || TEXT_PRESET_MAP.note;
    return `
      <article class="vision-studio-item${selected}" data-item-id="${escapeHtmlAttr(item.id)}" data-item-kind="text" style="left:${item.x}px;top:${item.y}px;width:${item.width}px;z-index:${item.z};--vision-item-rotation:${rotation}deg;">
        <div class="vision-studio-item-shell">
          <div class="vision-studio-item-bar">
            <div class="vision-studio-item-tag">${escapeHtml(item.label || preset.label)}</div>
            <div class="vision-studio-item-actions">
              <button class="vision-studio-item-btn handle" type="button" data-item-handle="${escapeHtmlAttr(item.id)}">Drag</button>
              <button class="vision-studio-item-btn" type="button" data-item-duplicate="${escapeHtmlAttr(item.id)}">Copy</button>
              <button class="vision-studio-item-btn" type="button" data-item-delete="${escapeHtmlAttr(item.id)}">Delete</button>
            </div>
          </div>
          <div class="vision-studio-text-card ${escapeHtmlAttr(variant)}">
            <div class="vision-studio-text-card-inner">
              <div class="vision-studio-card-kicker">${escapeHtml(item.label || preset.label)}</div>
              <div class="vision-studio-text-editor" contenteditable="true" spellcheck="true" data-item-editor="${escapeHtmlAttr(item.id)}" data-placeholder="${escapeHtmlAttr(item.placeholder || preset.placeholder)}">${escapeHtml(item.content || '')}</div>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  function renderItems() {
    const artboard = state.refs.artboard;
    if (!artboard) return;
    artboard.style.width = BOARD_WIDTH + 'px';
    artboard.style.height = BOARD_HEIGHT + 'px';
    artboard.innerHTML = state.items.length
      ? state.items.slice().sort((a, b) => a.z - b.z).map(renderItem).join('')
      : renderEmptyState();
  }

  function restoreScroll() {
    if (!state.refs.viewport) return;
    state.refs.viewport.scrollLeft = clamp(normalizeNumber(state.board.scrollLeft, DEFAULT_SCROLL.left), 0, BOARD_WIDTH);
    state.refs.viewport.scrollTop = clamp(normalizeNumber(state.board.scrollTop, DEFAULT_SCROLL.top), 0, BOARD_HEIGHT);
  }

  function cacheRefs() {
    state.refs = {
      filters: state.root.querySelector('#vision-studio-filters'),
      assets: state.root.querySelector('#vision-studio-assets'),
      textPresets: state.root.querySelector('#vision-studio-text-presets'),
      accentPresets: state.root.querySelector('#vision-studio-accent-presets'),
      meta: state.root.querySelector('#vision-studio-meta'),
      viewport: state.root.querySelector('#vision-studio-viewport'),
      artboard: state.root.querySelector('#vision-studio-artboard'),
      search: state.root.querySelector('#vision-studio-search'),
      fileInput: state.root.querySelector('#vision-studio-upload')
    };
  }

  function bindShellEvents() {
    if (!state.root || state.root.dataset.bound === 'true') return;
    state.root.dataset.bound = 'true';
    state.root.addEventListener('click', handleRootClick);
    state.root.addEventListener('input', handleRootInput);
    state.root.addEventListener('dragstart', handleLibraryDragStart);
    state.refs.viewport.addEventListener('dragover', handleViewportDragOver);
    state.refs.viewport.addEventListener('dragleave', handleViewportDragLeave);
    state.refs.viewport.addEventListener('drop', handleViewportDrop);
    state.refs.viewport.addEventListener('scroll', handleViewportScroll, { passive: true });
    state.refs.artboard.addEventListener('pointerdown', handleArtboardPointerDown);
    state.refs.artboard.addEventListener('click', handleArtboardClick);
    state.refs.fileInput.addEventListener('change', handleFileInputChange);
  }

  function bindGlobalEvents() {
    if (state.initialized) return;
    state.initialized = true;
    document.addEventListener('paste', handlePaste);
    window.addEventListener('pointermove', handleWindowPointerMove);
    window.addEventListener('pointerup', stopDrag);
  }

  function mount() {
    const root = document.getElementById('vision-studio-root');
    if (!root) return;
    state.root = root;
    applyState(readStoredState());
    if (!state.mounted) {
      root.innerHTML = shellTemplate();
      cacheRefs();
      bindShellEvents();
      bindGlobalEvents();
      state.mounted = true;
    }
    renderFilterButtons();
    renderAssets();
    renderMeta();
    renderItems();
    requestAnimationFrame(restoreScroll);
  }

  function isVisionPageActive() {
    const page = document.getElementById('page-vision');
    return !!page && page.classList.contains('active');
  }

  function setSelected(itemId) {
    state.selectedId = itemId || null;
    if (!state.refs.artboard) return;
    state.refs.artboard.querySelectorAll('.vision-studio-item').forEach(node => {
      node.classList.toggle('is-selected', node.dataset.itemId === state.selectedId);
    });
  }

  function addItem(item) {
    if (!item) return;
    if (state.items.length >= MAX_ITEMS) {
      notify('The vision board is full for now. Remove something before adding more.');
      return;
    }
    state.items.push(item);
    bringToFront(item.id);
    setSelected(item.id);
    renderMeta();
    renderItems();
    queueSave();
  }

  function insertLibraryItem(type, id, point) {
    if (type === 'image') {
      const asset = ASSET_MAP[id];
      if (!asset) return;
      addItem(createImageItem(asset, point || getViewportPlacement(asset.w || 320, 360)));
      return;
    }
    if (type === 'text') {
      const preset = TEXT_PRESET_MAP[id];
      if (!preset) return;
      addItem(createTextItem(id, point || getViewportPlacement(preset.width, 220)));
      return;
    }
    if (type === 'accent') {
      const accent = ACCENT_MAP[id];
      if (!accent) return;
      addItem(createAccentItem(id, point || getViewportPlacement(210, 210)));
    }
  }

  function duplicateItem(itemId) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item) return;
    const clone = JSON.parse(JSON.stringify(item));
    clone.id = uid();
    clone.x = clamp(item.x + 34, 40, BOARD_WIDTH - (item.width || 240) - 40);
    clone.y = clamp(item.y + 34, 40, BOARD_HEIGHT - 220);
    clone.z = state.items.reduce((largest, entry) => Math.max(largest, entry.z || 0), 0) + 1;
    addItem(normalizeItem(clone, state.items.length));
  }

  function deleteItem(itemId) {
    state.items = state.items.filter(entry => entry.id !== itemId);
    if (state.selectedId === itemId) state.selectedId = null;
    renderMeta();
    renderItems();
    queueSave();
  }

  function clearBoard() {
    if (!state.items.length) return;
    if (!window.confirm('Clear every image, card, and accent from this vision board?')) return;
    state.items = [];
    state.selectedId = null;
    renderMeta();
    renderItems();
    queueSave();
  }

  function openUploadPicker() {
    const input = state.refs.fileInput;
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') input.showPicker();
      else input.click();
    } catch (error) {
      input.click();
    }
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function dataUrlByteLength(dataUrl) {
    const base64 = String(dataUrl || '').split(',')[1] || '';
    return Math.ceil((base64.length * 3) / 4);
  }

  async function compressImageFile(file) {
    if (!file || !String(file.type || '').startsWith('image/')) return null;
    const dataUrl = await readFileAsDataUrl(file);
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const attempts = [
          { dim: 1800, quality: 0.9 },
          { dim: 1440, quality: 0.86 },
          { dim: 1200, quality: 0.8 },
          { dim: 980, quality: 0.72 },
          { dim: 760, quality: 0.66 }
        ];
        let latest = dataUrl;
        for (const step of attempts) {
          const scale = Math.min(1, step.dim / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, Math.round(image.width * scale));
          canvas.height = Math.max(1, Math.round(image.height * scale));
          const context = canvas.getContext('2d');
          if (!context) continue;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          latest = canvas.toDataURL('image/jpeg', step.quality);
          if (dataUrlByteLength(latest) <= OUTPUT_MAX_BYTES) break;
        }
        resolve(latest);
      };
      image.onerror = () => resolve(dataUrl);
      image.src = dataUrl;
    });
  }

  async function addUploadedImages(files, eventPoint) {
    const list = Array.from(files || []).filter(file => String(file.type || '').startsWith('image/'));
    if (!list.length) {
      notify('Choose an image file first.');
      return;
    }
    const roomLeft = Math.max(0, MAX_ITEMS - state.items.length);
    if (!roomLeft) {
      notify('The vision board is full for now. Remove something before adding more.');
      return;
    }
    let added = 0;
    let skipped = 0;
    const accepted = list.slice(0, roomLeft);
    for (let index = 0; index < accepted.length; index += 1) {
      const file = accepted[index];
      if (file.size > INPUT_MAX_BYTES) {
        skipped += 1;
        continue;
      }
      try {
        const src = await compressImageFile(file);
        if (!src) {
          skipped += 1;
          continue;
        }
        const width = clamp(320 + (index * 14), 280, 420);
        const point = eventPoint ? {
          x: clamp(eventPoint.x + (index * 28), 40, BOARD_WIDTH - width - 40),
          y: clamp(eventPoint.y + (index * 24), 40, BOARD_HEIGHT - 280)
        } : getViewportPlacement(width, 360);
        const item = normalizeItem({
          kind: 'image',
          src,
          label: file.name ? file.name.replace(/\.[^.]+$/, '') : 'Uploaded Image',
          credit: 'Your upload',
          width,
          x: point.x,
          y: point.y,
          rotation: randomRotation('image')
        }, state.items.length + index);
        if (item) {
          state.items.push(item);
          added += 1;
        } else {
          skipped += 1;
        }
      } catch (error) {
        skipped += 1;
      }
    }
    if (!added) {
      notify(skipped ? 'Could not add that image. Try JPG, PNG, WEBP, or a smaller file.' : 'No images were added.');
      return;
    }
    renderMeta();
    renderItems();
    queueSave();
    notify(added === 1 ? '1 image added to your vision board.' : added + ' images added to your vision board.');
  }

  function handleRootClick(event) {
    const button = event.target.closest('[data-action],[data-filter],[data-library-type],[data-item-delete],[data-item-duplicate]');
    if (!button) {
      if (!event.target.closest('.vision-studio-item')) setSelected(null);
      return;
    }
    if (button.dataset.action) {
      switch (button.dataset.action) {
        case 'upload':
          openUploadPicker();
          return;
        case 'add-note':
          insertLibraryItem('text', 'note');
          return;
        case 'add-quote':
          insertLibraryItem('text', 'quote');
          return;
        case 'recenter':
          state.board.scrollLeft = DEFAULT_SCROLL.left;
          state.board.scrollTop = DEFAULT_SCROLL.top;
          restoreScroll();
          queueSave();
          return;
        case 'clear':
          clearBoard();
          return;
        default:
          return;
      }
    }
    if (button.dataset.filter) {
      state.filter = button.dataset.filter;
      renderFilterButtons();
      renderAssets();
      return;
    }
    if (button.dataset.libraryType && button.dataset.libraryId) {
      const id = button.dataset.libraryId;
      const type = button.dataset.libraryType;
      if (type === 'image') {
        const asset = ASSET_MAP[id];
        insertLibraryItem(type, id, asset ? getViewportPlacement(asset.w || 320, 360) : null);
      } else if (type === 'text') {
        const preset = TEXT_PRESET_MAP[id];
        insertLibraryItem(type, id, preset ? getViewportPlacement(preset.width, 220) : null);
      } else {
        insertLibraryItem(type, id, getViewportPlacement(210, 210));
      }
      return;
    }
    if (button.dataset.itemDelete) {
      deleteItem(button.dataset.itemDelete);
      return;
    }
    if (button.dataset.itemDuplicate) {
      duplicateItem(button.dataset.itemDuplicate);
    }
  }

  function handleRootInput(event) {
    if (event.target === state.refs.search) {
      state.search = event.target.value || '';
      renderAssets();
      return;
    }
    const editor = event.target.closest('[data-item-editor]');
    if (!editor) return;
    const item = state.items.find(entry => entry.id === editor.dataset.itemEditor);
    if (!item) return;
    item.content = editor.innerText.trim();
    queueSave();
  }

  function handleLibraryDragStart(event) {
    const source = event.target.closest('[data-library-type][data-library-id]');
    if (!source || !event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/vision-library-type', source.dataset.libraryType);
    event.dataTransfer.setData('text/vision-library-id', source.dataset.libraryId);
  }

  function handleViewportDragOver(event) {
    event.preventDefault();
    if (state.refs.viewport) state.refs.viewport.classList.add('is-drop-active');
  }

  function handleViewportDragLeave(event) {
    if (!state.refs.viewport) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;
    state.refs.viewport.classList.remove('is-drop-active');
  }

  async function handleViewportDrop(event) {
    event.preventDefault();
    if (state.refs.viewport) state.refs.viewport.classList.remove('is-drop-active');
    const fileList = Array.from(event.dataTransfer?.files || []).filter(file => String(file.type || '').startsWith('image/'));
    if (fileList.length) {
      await addUploadedImages(fileList, getPointFromEvent(event, 320, 360));
      return;
    }
    const type = event.dataTransfer?.getData('text/vision-library-type');
    const id = event.dataTransfer?.getData('text/vision-library-id');
    if (!type || !id) return;
    const width = type === 'image' ? (ASSET_MAP[id]?.w || 320) : type === 'accent' ? 210 : (TEXT_PRESET_MAP[id]?.width || 320);
    insertLibraryItem(type, id, getPointFromEvent(event, width, 220));
  }

  function handleViewportScroll() {
    if (!state.refs.viewport || state.drag) return;
    state.board.scrollLeft = state.refs.viewport.scrollLeft;
    state.board.scrollTop = state.refs.viewport.scrollTop;
    queueSave();
  }

  function handleArtboardClick(event) {
    const itemNode = event.target.closest('.vision-studio-item');
    if (!itemNode) {
      setSelected(null);
      return;
    }
    setSelected(itemNode.dataset.itemId);
  }

  function handleArtboardPointerDown(event) {
    const handle = event.target.closest('[data-item-handle]');
    if (!handle) return;
    const itemNode = handle.closest('.vision-studio-item');
    if (!itemNode || event.button !== 0) return;
    const item = state.items.find(entry => entry.id === itemNode.dataset.itemId);
    if (!item) return;
    bringToFront(item.id);
    setSelected(item.id);
    itemNode.classList.add('dragging');
    state.drag = {
      id: item.id,
      node: itemNode,
      width: itemNode.offsetWidth,
      height: itemNode.offsetHeight,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y,
      startScrollLeft: state.refs.viewport.scrollLeft,
      startScrollTop: state.refs.viewport.scrollTop
    };
    try {
      handle.setPointerCapture(event.pointerId);
    } catch (error) {}
    event.preventDefault();
  }

  function autoScrollDuringDrag(event) {
    const viewport = state.refs.viewport;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const edge = 64;
    if (event.clientX < rect.left + edge) viewport.scrollLeft -= 18;
    if (event.clientX > rect.right - edge) viewport.scrollLeft += 18;
    if (event.clientY < rect.top + edge) viewport.scrollTop -= 18;
    if (event.clientY > rect.bottom - edge) viewport.scrollTop += 18;
  }

  function handleWindowPointerMove(event) {
    if (!state.drag || !state.refs.viewport) return;
    autoScrollDuringDrag(event);
    const item = state.items.find(entry => entry.id === state.drag.id);
    if (!item) return;
    const deltaX = (event.clientX - state.drag.startX) + (state.refs.viewport.scrollLeft - state.drag.startScrollLeft);
    const deltaY = (event.clientY - state.drag.startY) + (state.refs.viewport.scrollTop - state.drag.startScrollTop);
    item.x = clamp(state.drag.originX + deltaX, 40, BOARD_WIDTH - state.drag.width - 40);
    item.y = clamp(state.drag.originY + deltaY, 40, BOARD_HEIGHT - state.drag.height - 40);
    state.drag.node.style.left = item.x + 'px';
    state.drag.node.style.top = item.y + 'px';
  }

  function stopDrag() {
    if (!state.drag) return;
    state.drag.node.classList.remove('dragging');
    state.board.scrollLeft = state.refs.viewport ? state.refs.viewport.scrollLeft : state.board.scrollLeft;
    state.board.scrollTop = state.refs.viewport ? state.refs.viewport.scrollTop : state.board.scrollTop;
    state.drag = null;
    queueSave();
    renderMeta();
  }

  async function handleFileInputChange(event) {
    await addUploadedImages(event.target?.files || []);
    if (event.target) event.target.value = '';
  }

  async function handlePaste(event) {
    if (!isVisionPageActive()) return;
    const target = event.target;
    if (target && target.closest('input,textarea,[contenteditable="true"]') && !target.closest('.vision-studio-text-editor')) return;
    const items = Array.from(event.clipboardData?.items || []);
    const files = items
      .filter(item => String(item.type || '').startsWith('image/'))
      .map(item => item.getAsFile())
      .filter(Boolean);
    if (!files.length) return;
    event.preventDefault();
    await addUploadedImages(files);
  }

  function apiOpenUpload() {
    mount();
    openUploadPicker();
  }

  function apiClearBoard() {
    mount();
    clearBoard();
  }

  const api = {
    mount,
    openUpload: apiOpenUpload,
    clearBoard: apiClearBoard
  };

  window.VisionStudio = api;
  window.openVisionBoardUpload = apiOpenUpload;
  window.clearVisionBoard = apiClearBoard;
  window.initVisionBoard = mount;

  document.addEventListener('DOMContentLoaded', mount);
  if (document.readyState !== 'loading') {
    setTimeout(mount, 180);
  }
})();
