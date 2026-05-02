(function(){
  const STORAGE_KEY = 'pcc-vision-board';
  const VERSION = 3;
  const BOARD_WIDTH = 2600;
  const BOARD_HEIGHT = 1700;
  const BOARD_PADDING = 44;
  const SAVE_DELAY = 220;
  const MAX_ITEMS = 96;
  const INPUT_MAX_BYTES = 4 * 1024 * 1024;
  const OUTPUT_MAX_BYTES = 950 * 1024;
  const DEFAULT_SCROLL = { left: 220, top: 160 };
  const SNAP_THRESHOLD = 12;
  const MIN_ZOOM = 0.34;
  const MAX_ZOOM = 1.45;
  const DEFAULT_ZOOM = 0.58;
  const DEFAULT_TITLE = "P's Vision Studio";

  const CATEGORY_DEFS = [
    { id: 'elements', label: 'Elements', copy: 'Panels, washes, dividers', icon: 'grid' },
    { id: 'text', label: 'Text', copy: 'Headlines and notes', icon: 'type' },
    { id: 'photos', label: 'Photos', copy: 'Free licensed imagery', icon: 'photo' },
    { id: 'frames', label: 'Frames', copy: 'Drag in stylish frames', icon: 'frame' },
    { id: 'stickers', label: 'Stickers / Icons', copy: 'Elegant decorative marks', icon: 'spark' },
    { id: 'goal-blocks', label: 'Goal Blocks', copy: 'Milestones and priorities', icon: 'target' },
    { id: 'habit-trackers', label: 'Habit Trackers', copy: 'Weekly rhythm widgets', icon: 'habit' },
    { id: 'calendar-widgets', label: 'Calendar Widgets', copy: 'Planning views', icon: 'calendar' },
    { id: 'affirmation-cards', label: 'Affirmation Cards', copy: 'Words with presence', icon: 'quote' },
    { id: 'mood-accents', label: 'Mood Accents', copy: 'Soft glows and florals', icon: 'flower' }
  ];

  const PHOTO_BANK = [
    {
      id: 'soft-paper',
      title: 'Soft Paper',
      copy: 'Bright texture layer',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/5993568/pexels-photo-5993568.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/5993568/pexels-photo-5993568.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    },
    {
      id: 'paper-fibers',
      title: 'Paper Fibers',
      copy: 'Editorial grain',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/5993559/pexels-photo-5993559.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/5993559/pexels-photo-5993559.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    },
    {
      id: 'blush-marble',
      title: 'Blush Marble',
      copy: 'Luxury surface',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/4709542/pexels-photo-4709542.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/4709542/pexels-photo-4709542.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 380,
      height: 440
    },
    {
      id: 'plant-shadow',
      title: 'Plant Shadow',
      copy: 'Quiet light play',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/2821756/pexels-photo-2821756.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/2821756/pexels-photo-2821756.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 420,
      height: 320
    },
    {
      id: 'satin-fuchsia',
      title: 'Fuchsia Satin',
      copy: 'Rich movement',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/6276018/pexels-photo-6276018.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/6276018/pexels-photo-6276018.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    },
    {
      id: 'rose-veil',
      title: 'Rose Veil',
      copy: 'Soft draped fabric',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/6571742/pexels-photo-6571742.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/6571742/pexels-photo-6571742.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    },
    {
      id: 'pink-clouds',
      title: 'Pink Clouds',
      copy: 'Dreamy sky',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30614902/pexels-photo-30614902.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30614902/pexels-photo-30614902.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 440,
      height: 320
    },
    {
      id: 'twilight-clouds',
      title: 'Twilight Clouds',
      copy: 'Moody gradient sky',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30505082/pexels-photo-30505082.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30505082/pexels-photo-30505082.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 440,
      height: 320
    },
    {
      id: 'pink-swirl',
      title: 'Pink Swirl',
      copy: 'Abstract motion',
      source: 'Pexels',
      thumb: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    }
  ];

  const STATIC_LIBRARY = [
    { id: 'glass-panel', category: 'elements', title: 'Glass Panel', copy: 'Floating panel layer', preview: 'glass-panel' },
    { id: 'spotlight-wash', category: 'elements', title: 'Spotlight Wash', copy: 'Blue aura backdrop', preview: 'spotlight-wash' },
    { id: 'soft-divider', category: 'elements', title: 'Soft Divider', copy: 'Spacing and structure', preview: 'soft-divider' },
    { id: 'headline', category: 'text', title: 'Headline', copy: 'Large editorial statement', preview: 'headline' },
    { id: 'note-card', category: 'text', title: 'Note Card', copy: 'Freeform thought block', preview: 'note-card' },
    { id: 'micro-label', category: 'text', title: 'Micro Label', copy: 'Small uppercase caption', preview: 'micro-label' },
    { id: 'arch-frame', category: 'frames', title: 'Arch Frame', copy: 'Elegant portrait frame', preview: 'arch-frame' },
    { id: 'polaroid-frame', category: 'frames', title: 'Polaroid Frame', copy: 'Soft instant-photo feel', preview: 'polaroid-frame' },
    { id: 'glass-frame', category: 'frames', title: 'Glass Frame', copy: 'Modern airy frame', preview: 'glass-frame' },
    { id: 'butterfly', category: 'stickers', title: 'Butterfly', copy: 'Airy movement accent', preview: 'butterfly' },
    { id: 'crown', category: 'stickers', title: 'Crown', copy: 'Luxury marker', preview: 'crown' },
    { id: 'bow', category: 'stickers', title: 'Bow', copy: 'Soft feminine detail', preview: 'bow' },
    { id: 'bloom', category: 'stickers', title: 'Bloom', copy: 'Petal cluster', preview: 'bloom' },
    { id: 'goal-focus', category: 'goal-blocks', title: 'Goal Focus', copy: 'Priority with milestones', preview: 'goal-focus' },
    { id: 'milestone-map', category: 'goal-blocks', title: 'Milestone Map', copy: 'Three-step plan block', preview: 'milestone-map' },
    { id: 'weekly-habit', category: 'habit-trackers', title: 'Weekly Habit', copy: '7-day tracker', preview: 'weekly-habit' },
    { id: 'streak-strip', category: 'habit-trackers', title: 'Streak Strip', copy: 'Compact routine marker', preview: 'streak-strip' },
    { id: 'week-planner', category: 'calendar-widgets', title: 'Week Planner', copy: 'Seven-column planning view', preview: 'week-planner' },
    { id: 'month-snapshot', category: 'calendar-widgets', title: 'Month Snapshot', copy: 'Mini monthly overview', preview: 'month-snapshot' },
    { id: 'affirmation-card', category: 'affirmation-cards', title: 'Affirmation Card', copy: 'Bold reflective statement', preview: 'affirmation-card' },
    { id: 'intention-card', category: 'affirmation-cards', title: 'Intention Card', copy: 'Grounding daily intention', preview: 'intention-card' },
    { id: 'mood-aura', category: 'mood-accents', title: 'Mood Aura', copy: 'Glow layer behind modules', preview: 'mood-aura' },
    { id: 'petal-spray', category: 'mood-accents', title: 'Petal Spray', copy: 'Subtle floral detail', preview: 'petal-spray' },
    { id: 'silk-ribbon', category: 'mood-accents', title: 'Silk Ribbon', copy: 'Curved luxury accent', preview: 'silk-ribbon' }
  ];

  const LIBRARY_ITEMS = STATIC_LIBRARY.concat(PHOTO_BANK.map(photo => ({
    id: photo.id,
    category: 'photos',
    title: photo.title,
    copy: photo.copy,
    preview: 'photo',
    photoId: photo.id
  })));

  const PHOTO_MAP = Object.fromEntries(PHOTO_BANK.map(item => [item.id, item]));
  const LIBRARY_MAP = Object.fromEntries(LIBRARY_ITEMS.map(item => [item.id, item]));

  const state = {
    root: null,
    mounted: false,
    initialized: false,
    activeCategory: 'photos',
    search: '',
    snapEnabled: true,
    selectedId: null,
    pendingUploadTarget: null,
    items: [],
    board: {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      scrollLeft: DEFAULT_SCROLL.left,
      scrollTop: DEFAULT_SCROLL.top
    },
    refs: {},
    refController: null,
    drag: null,
    resize: null,
    guides: { vertical: [], horizontal: [] },
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

  function toNumber(value, fallback) {
    const num = Number(value);
    return Number.isFinite(num) ? num : fallback;
  }

  function round(value) {
    return Math.round(value);
  }

  function iconSvg(name) {
    switch (name) {
      case 'grid': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="7" height="7" rx="2" fill="currentColor"/><rect x="14" y="3" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/><rect x="3" y="14" width="7" height="7" rx="2" fill="currentColor" opacity=".8"/><rect x="14" y="14" width="7" height="7" rx="2" fill="currentColor"/></svg>';
      case 'type': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M12 6v12M8 18h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'photo': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="2" fill="currentColor"/><path d="M7 17l4-4 3 3 3-2 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'frame': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" opacity=".7"/></svg>';
      case 'spark': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="currentColor"/></svg>';
      case 'target': return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>';
      case 'habit': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2" fill="none" opacity=".5"/></svg>';
      case 'calendar': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'quote': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 17A4.5 4.5 0 0 1 4 12.5C4 9 6.5 6.7 10 6v2c-2.3.5-3.7 2-3.7 4.1 0 .2 0 .4.1.6H10V17zm9 0A4.5 4.5 0 0 1 13 12.5c0-3.5 2.5-5.8 6-6.5v2c-2.3.5-3.7 2-3.7 4.1 0 .2 0 .4.1.6H19V17z" fill="currentColor"/></svg>';
      case 'flower': return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2.6" fill="currentColor"/><ellipse cx="12" cy="6" rx="3" ry="4" fill="currentColor" opacity=".84"/><ellipse cx="18" cy="12" rx="3" ry="4" fill="currentColor" opacity=".84"/><ellipse cx="12" cy="18" rx="3" ry="4" fill="currentColor" opacity=".84"/><ellipse cx="6" cy="12" rx="3" ry="4" fill="currentColor" opacity=".84"/></svg>';
      default: return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="currentColor"/></svg>';
    }
  }

  function actionSvg(name) {
    switch (name) {
      case 'grip': return '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="6" cy="6" r="1.4" fill="currentColor"/><circle cx="10" cy="6" r="1.4" fill="currentColor"/><circle cx="14" cy="6" r="1.4" fill="currentColor"/><circle cx="6" cy="10" r="1.4" fill="currentColor"/><circle cx="10" cy="10" r="1.4" fill="currentColor"/><circle cx="14" cy="10" r="1.4" fill="currentColor"/><circle cx="6" cy="14" r="1.4" fill="currentColor"/><circle cx="10" cy="14" r="1.4" fill="currentColor"/><circle cx="14" cy="14" r="1.4" fill="currentColor"/></svg>';
      case 'up': return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 4l5 6H5l5-6zm-5 9h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'down': return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 16l-5-6h10l-5 6zM5 7h10" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'copy': return '<svg viewBox="0 0 20 20" aria-hidden="true"><rect x="7" y="7" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8" fill="none"/><rect x="4" y="4" width="8" height="8" rx="2" stroke="currentColor" stroke-width="1.8" fill="none" opacity=".7"/></svg>';
      case 'trash': return '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 6h10M8 6V4h4v2m-6 0l.6 9a1.5 1.5 0 0 0 1.5 1.4h3.8a1.5 1.5 0 0 0 1.5-1.4L14 6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      default: return '';
    }
  }

  function defaultBoardState() {
    return {
      version: VERSION,
      board: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        scrollLeft: DEFAULT_SCROLL.left,
        scrollTop: DEFAULT_SCROLL.top,
        zoom: DEFAULT_ZOOM,
        title: DEFAULT_TITLE,
        activeCategory: 'photos',
        libraryCollapsed: false,
        inspectorCollapsed: true
      },
      items: []
    };
  }

  function normalizeBoard(board) {
    const requestedCategory = String(board?.activeCategory || '').trim();
    const knownCategory = CATEGORY_DEFS.some((entry) => entry.id === requestedCategory)
      ? requestedCategory
      : 'photos';
    return {
      width: BOARD_WIDTH,
      height: BOARD_HEIGHT,
      scrollLeft: clamp(toNumber(board?.scrollLeft, DEFAULT_SCROLL.left), 0, BOARD_WIDTH),
      scrollTop: clamp(toNumber(board?.scrollTop, DEFAULT_SCROLL.top), 0, BOARD_HEIGHT),
      zoom: clamp(toNumber(board?.zoom, DEFAULT_ZOOM), MIN_ZOOM, MAX_ZOOM),
      title: typeof board?.title === 'string' && board.title.trim() ? board.title.trim() : DEFAULT_TITLE,
      activeCategory: knownCategory,
      libraryCollapsed: board?.libraryCollapsed === true,
      inspectorCollapsed: board?.inspectorCollapsed !== false
    };
  }

  function createBaseItem(module, variant, point, size, extra) {
    return {
      id: uid(),
      module,
      variant,
      x: clamp(round(point.x), BOARD_PADDING, BOARD_WIDTH - size.w - BOARD_PADDING),
      y: clamp(round(point.y), BOARD_PADDING, BOARD_HEIGHT - size.h - BOARD_PADDING),
      w: size.w,
      h: size.h,
      z: state.items.reduce((largest, item) => Math.max(largest, item.z || 0), 0) + 1,
      rotate: extra?.rotate != null ? extra.rotate : 0,
      lockAspect: !!extra?.lockAspect,
      aspectRatio: extra?.aspectRatio || (size.w / Math.max(size.h, 1))
    };
  }

  function monthCells() {
    const now = new Date();
    const first = new Date(now.getFullYear(), now.getMonth(), 1);
    const startDay = first.getDay();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startDay; i += 1) cells.push({ day: '', note: '' });
    for (let day = 1; day <= daysInMonth; day += 1) cells.push({ day: String(day), note: '' });
    while (cells.length < 35) cells.push({ day: '', note: '' });
    return cells.slice(0, 35);
  }

  function weekNotes() {
    return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(label => ({ label, note: '' }));
  }

  function currentCategory() {
    return CATEGORY_DEFS.find(entry => entry.id === state.activeCategory) || CATEGORY_DEFS[0];
  }

  function zoomLabel() {
    return Math.round((state.board.zoom || DEFAULT_ZOOM) * 100) + '%';
  }

  function selectedItem() {
    return state.items.find(entry => entry.id === state.selectedId) || null;
  }

  function studioCounts() {
    return state.items.reduce((acc, item) => {
      acc.total += 1;
      if (item.module === 'photo' || item.module === 'frame') acc.photos += 1;
      if (item.module === 'goal') acc.goals += 1;
      if (item.module === 'calendar') acc.calendar += 1;
      if (item.module === 'habit') acc.habits += 1;
      if (item.module === 'affirmation' || item.module === 'text') acc.words += 1;
      return acc;
    }, {
      total: 0,
      photos: 0,
      goals: 0,
      calendar: 0,
      habits: 0,
      words: 0
    });
  }

  function itemLabel(item) {
    if (!item) return 'Module';
    if (item.module === 'photo') return item.title || 'Photo';
    if (item.module === 'frame') return item.title || 'Frame';
    if (item.module === 'goal') return item.variant === 'milestone-map' ? 'Milestone Map' : 'Goal Block';
    if (item.module === 'habit') return item.variant === 'streak-strip' ? 'Streak Strip' : 'Habit Tracker';
    if (item.module === 'calendar') return item.mode === 'month' ? 'Month Snapshot' : 'Week Planner';
    if (item.module === 'affirmation') return item.variant === 'intention-card' ? 'Intention Card' : 'Affirmation Card';
    if (item.module === 'decor') {
      switch (item.variant) {
        case 'glass-panel': return 'Glass Panel';
        case 'spotlight-wash': return 'Spotlight Wash';
        case 'soft-divider': return 'Soft Divider';
        case 'petal-spray': return 'Petal Spray';
        case 'silk-ribbon': return 'Silk Ribbon';
        case 'mood-aura': return 'Mood Aura';
        default: return 'Accent';
      }
    }
    if (item.variant === 'headline') return 'Headline';
    if (item.variant === 'micro-label') return 'Micro Label';
    return 'Note Card';
  }

  function itemSupportCopy(item) {
    if (!item) return 'Select something on the board to edit it with more precision.';
    switch (item.module) {
      case 'photo':
        return 'Use imagery as atmosphere, proof, or a destination. Resize it generously and let other modules overlap it.';
      case 'frame':
        return 'Frames are useful for more intentional storytelling. Swap the image inside without changing the board structure.';
      case 'goal':
        return 'Goal blocks work best when they stay short, directional, and easy to scan from a distance.';
      case 'habit':
        return 'Keep habit modules compact so they support the board instead of taking it over.';
      case 'calendar':
        return 'Planning widgets are strongest when they anchor one area of the board and create order for the rest.';
      case 'affirmation':
        return 'Words should feel grounded and credible. Write language you actually want to re-read.';
      case 'decor':
        return 'Accents are there to create mood, rhythm, and composition without overwhelming the working content.';
      default:
        return 'Text modules create the editorial voice of the board. Keep them simple and intentional.';
    }
  }

  function inspectorPreview(item) {
    if (!item) return '';
    if ((item.module === 'photo' || item.module === 'frame') && item.src) {
      return `
        <div class="vs-inspector-preview">
          <img src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.title || itemLabel(item))}" />
        </div>
      `;
    }
    return `
      <div class="vs-inspector-preview is-placeholder">
        <div class="vs-inspector-preview-mark">${escapeHtml(itemLabel(item).slice(0, 1).toUpperCase())}</div>
        <div class="vs-inspector-preview-copy">${escapeHtml(itemSupportCopy(item))}</div>
      </div>
    `;
  }

  function renderTemplateCards() {
    return `
      <div class="vs-template-grid">
        <button class="vs-template-card" type="button" data-action="starter-editorial">
          <span class="vs-template-kicker">Starter</span>
          <span class="vs-template-title">Editorial Glow</span>
          <span class="vs-template-copy">Atmosphere first. Images, framing, and space for your own language.</span>
        </button>
        <button class="vs-template-card" type="button" data-action="starter-focus-map">
          <span class="vs-template-kicker">Starter</span>
          <span class="vs-template-title">Focus Map</span>
          <span class="vs-template-copy">A sharper mix of goals, planning, and weekly rhythm for active execution.</span>
        </button>
        <button class="vs-template-card" type="button" data-action="starter-mood-story">
          <span class="vs-template-kicker">Starter</span>
          <span class="vs-template-title">Mood Story</span>
          <span class="vs-template-copy">A softer composition for inspiration, texture, notes, and emotional direction.</span>
        </button>
      </div>
    `;
  }

  function starterLayoutItems(kind) {
    const softPaper = PHOTO_MAP['soft-paper'] || PHOTO_BANK[0];
    const clouds = PHOTO_MAP['pink-clouds'] || PHOTO_BANK[0];
    const marble = PHOTO_MAP['blush-marble'] || PHOTO_BANK[0];
    const plant = PHOTO_MAP['plant-shadow'] || PHOTO_BANK[0];
    const rose = PHOTO_MAP['rose-veil'] || PHOTO_BANK[0];
    const editorial = [
      {
        module: 'photo',
        variant: 'photo',
        src: clouds.src,
        title: clouds.title,
        credit: 'Free image',
        source: clouds.source,
        x: 220,
        y: 180,
        w: 700,
        h: 460,
        lockAspect: true,
        aspectRatio: clouds.width / clouds.height
      },
      { module: 'text', variant: 'headline', x: 1040, y: 210, w: 760, h: 230, title: '', body: '' },
      { module: 'decor', variant: 'glass-panel', x: 980, y: 500, w: 820, h: 320, lockAspect: false },
      { module: 'affirmation', variant: 'affirmation-card', x: 1115, y: 565, w: 520, h: 240, text: '', caption: '' },
      { module: 'frame', variant: 'glass-frame', x: 1880, y: 210, w: 430, h: 300, title: '', caption: '', src: softPaper.src },
      { module: 'decor', variant: 'silk-ribbon', x: 1770, y: 690, w: 330, h: 190, lockAspect: true },
      { module: 'decor', variant: 'mood-aura', x: 1480, y: 1000, w: 360, h: 260, lockAspect: true }
    ];
    const focus = [
      {
        module: 'photo',
        variant: 'photo',
        src: plant.src,
        title: plant.title,
        credit: 'Free image',
        source: plant.source,
        x: 240,
        y: 250,
        w: 560,
        h: 420,
        lockAspect: true,
        aspectRatio: plant.width / plant.height
      },
      { module: 'goal', variant: 'goal-focus', x: 900, y: 220, w: 430, h: 320, title: '', focus: '', steps: ['', '', ''] },
      { module: 'calendar', variant: 'week-planner', x: 1385, y: 220, w: 760, h: 290, title: '', mode: 'week', week: weekNotes() },
      { module: 'habit', variant: 'streak-strip', x: 900, y: 610, w: 560, h: 170, title: '', mode: 'strip', days: [false, false, false, false, false, false, false] },
      { module: 'text', variant: 'headline', x: 240, y: 760, w: 660, h: 210, title: '', body: '' },
      { module: 'affirmation', variant: 'intention-card', x: 1510, y: 620, w: 440, h: 220, text: '', caption: '' },
      { module: 'decor', variant: 'spotlight-wash', x: 1790, y: 900, w: 380, h: 260, lockAspect: false }
    ];
    const moodStory = [
      {
        module: 'photo',
        variant: 'photo',
        src: marble.src,
        title: marble.title,
        credit: 'Free image',
        source: marble.source,
        x: 1550,
        y: 230,
        w: 540,
        h: 620,
        lockAspect: true,
        aspectRatio: marble.width / marble.height
      },
      { module: 'frame', variant: 'polaroid-frame', x: 320, y: 220, w: 420, h: 520, title: '', caption: '', src: rose.src },
      { module: 'text', variant: 'note-card', x: 835, y: 250, w: 430, h: 320, title: '', body: '' },
      { module: 'affirmation', variant: 'affirmation-card', x: 820, y: 640, w: 530, h: 250, text: '', caption: '' },
      { module: 'text', variant: 'micro-label', x: 345, y: 800, w: 260, h: 118, title: '', body: '' },
      { module: 'decor', variant: 'petal-spray', x: 1370, y: 920, w: 360, h: 220, lockAspect: true },
      { module: 'decor', variant: 'bloom', x: 2020, y: 930, w: 240, h: 190, lockAspect: true }
    ];
    const seed = kind === 'focus-map'
      ? focus
      : kind === 'mood-story'
        ? moodStory
        : editorial;
    return seed.map((item, index) => normalizeItem(item, index)).filter(Boolean);
  }

  function applyStarterLayout(kind) {
    const incoming = starterLayoutItems(kind);
    if (!incoming.length) return;
    if (state.items.length && !window.confirm('Replace the current board with this starter composition?')) return;
    state.items = incoming;
    state.selectedId = incoming[0]?.id || null;
    state.board.inspectorCollapsed = !state.selectedId;
    state.board.scrollLeft = DEFAULT_SCROLL.left;
    state.board.scrollTop = DEFAULT_SCROLL.top;
    renderBoard();
    restoreScroll();
    queueSave();
    notify('Starter layout ready.');
  }

  function renderInspectorPanel() {
    const item = selectedItem();
    const counts = studioCounts();
    if (!item) {
      return `
        <div class="vs-inspector-scroll">
          <section class="vs-inspector-section">
            <div class="vs-kicker">Studio</div>
            <h3 class="vs-inspector-title">Keep the canvas in charge.</h3>
            <p class="vs-inspector-copy">Pull from the library, layer freely across the artboard, and use the inspector only when you want precise control.</p>
            <div class="vs-inspector-stats">
              <div class="vs-inspector-stat">
                <span class="vs-inspector-stat-label">Modules</span>
                <strong>${counts.total}</strong>
              </div>
              <div class="vs-inspector-stat">
                <span class="vs-inspector-stat-label">Photos</span>
                <strong>${counts.photos}</strong>
              </div>
              <div class="vs-inspector-stat">
                <span class="vs-inspector-stat-label">Goals</span>
                <strong>${counts.goals}</strong>
              </div>
              <div class="vs-inspector-stat">
                <span class="vs-inspector-stat-label">Planners</span>
                <strong>${counts.calendar + counts.habits}</strong>
              </div>
            </div>
          </section>
          <section class="vs-inspector-section">
            <div class="vs-kicker">Compositions</div>
            <h3 class="vs-inspector-title">Start with shape, not filler.</h3>
            <p class="vs-inspector-copy">Each starter sets the board rhythm first, then leaves the meaning to you.</p>
            ${renderTemplateCards()}
          </section>
          <section class="vs-inspector-section">
            <div class="vs-kicker">Session</div>
            <div class="vs-inspector-chip-row">
              <span class="vs-inspector-chip">${zoomLabel()} zoom</span>
              <span class="vs-inspector-chip">${state.snapEnabled ? 'Snap enabled' : 'Free placement'}</span>
              <span class="vs-inspector-chip">${counts.words} text layer${counts.words === 1 ? '' : 's'}</span>
            </div>
          </section>
        </div>
      `;
    }

    return `
      <div class="vs-inspector-scroll">
        <section class="vs-inspector-section">
          <div class="vs-kicker">Selection</div>
          <h3 class="vs-inspector-title">${escapeHtml(itemLabel(item))}</h3>
          <p class="vs-inspector-copy">${escapeHtml(itemSupportCopy(item))}</p>
          ${inspectorPreview(item)}
          <div class="vs-inspector-stats">
            <div class="vs-inspector-stat">
              <span class="vs-inspector-stat-label">Width</span>
              <strong>${Math.round(item.w)}px</strong>
            </div>
            <div class="vs-inspector-stat">
              <span class="vs-inspector-stat-label">Height</span>
              <strong>${Math.round(item.h)}px</strong>
            </div>
            <div class="vs-inspector-stat">
              <span class="vs-inspector-stat-label">Layer</span>
              <strong>${Math.round(item.z)}</strong>
            </div>
            <div class="vs-inspector-stat">
              <span class="vs-inspector-stat-label">Position</span>
              <strong>${Math.round(item.x)}, ${Math.round(item.y)}</strong>
            </div>
          </div>
        </section>
        <section class="vs-inspector-section">
          <label class="vs-inspector-field">
            <span class="vs-inspector-field-label">Rotation</span>
            <div class="vs-inspector-range-row">
              <input type="range" min="-24" max="24" step="1" value="${Math.round(item.rotate || 0)}" data-selected-rotate="true" />
              <span class="vs-inspector-range-value">${Math.round(item.rotate || 0)}deg</span>
            </div>
          </label>
          <label class="vs-inspector-check">
            <input type="checkbox" data-selected-lock-aspect="true"${item.lockAspect ? ' checked' : ''} />
            <span>Keep proportions while resizing</span>
          </label>
          <div class="vs-inspector-actions">
            <button class="vs-inspector-btn" type="button" data-action="center-selection">Center</button>
            <button class="vs-inspector-btn" type="button" data-action="duplicate-selection">Duplicate</button>
            <button class="vs-inspector-btn" type="button" data-action="layer-up-selection">Bring forward</button>
            <button class="vs-inspector-btn" type="button" data-action="layer-down-selection">Send back</button>
            ${(item.module === 'photo' || item.module === 'frame') ? '<button class="vs-inspector-btn" type="button" data-action="replace-selected-image">Replace image</button>' : ''}
            <button class="vs-inspector-btn danger" type="button" data-action="delete-selection">Delete</button>
          </div>
        </section>
      </div>
    `;
  }

  function renderInspector() {
    if (!state.refs.inspector) return;
    state.refs.inspector.innerHTML = renderInspectorPanel();
  }

  function mapLegacyAccent(variant) {
    switch (variant) {
      case 'ribbon': return 'silk-ribbon';
      case 'flutter':
      case 'butterfly': return 'butterfly';
      case 'crown': return 'crown';
      case 'bloom':
      case 'blossom': return 'bloom';
      case 'spark':
      case 'burst':
      case 'starburst': return 'mood-aura';
      default: return 'petal-spray';
    }
  }

  function migrateLegacyItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const type = item.kind || item.type || 'image';
    const legacyVariant = item.variant || type;
    if (type === 'image') {
      return normalizeItem({
        module: 'photo',
        variant: 'photo',
        id: item.id,
        x: item.x,
        y: item.y,
        z: item.z,
        rotate: item.rotation,
        w: item.width || item.w || 360,
        h: item.height || item.h || Math.round((item.width || item.w || 360) * 1.12),
        src: item.src,
        title: item.label || 'Photo',
        credit: item.credit || 'Saved image',
        source: item.credit || 'Saved image',
        lockAspect: true,
        aspectRatio: (item.width || item.w || 360) / Math.max(item.height || item.h || Math.round((item.width || item.w || 360) * 1.12), 1)
      }, index);
    }
    if (type === 'goal' || (type === 'text' && legacyVariant === 'goal')) {
      return normalizeItem({
        module: 'goal',
        variant: 'goal-focus',
        id: item.id,
        x: item.x,
        y: item.y,
        z: item.z,
        rotate: item.rotation,
        w: item.width || item.w || 360,
        h: item.height || item.h || 300,
        title: item.label || '',
        focus: item.content || '',
        steps: ['', '', '']
      }, index);
    }
    if (type === 'quote' || type === 'mantra' || (type === 'text' && (legacyVariant === 'quote' || legacyVariant === 'mantra'))) {
      return normalizeItem({
        module: 'affirmation',
        variant: type === 'mantra' || legacyVariant === 'mantra' ? 'intention-card' : 'affirmation-card',
        id: item.id,
        x: item.x,
        y: item.y,
        z: item.z,
        rotate: item.rotation,
        w: item.width || item.w || (type === 'mantra' || legacyVariant === 'mantra' ? 360 : 380),
        h: item.height || item.h || (type === 'mantra' || legacyVariant === 'mantra' ? 230 : 260),
        text: item.content || '',
        caption: item.label || ''
      }, index);
    }
    if (type === 'sticker' || (type === 'text' && legacyVariant === 'label')) {
      return normalizeItem({
        module: 'text',
        variant: 'micro-label',
        id: item.id,
        x: item.x,
        y: item.y,
        z: item.z,
        rotate: item.rotation,
        w: item.width || item.w || 260,
        h: item.height || item.h || 118,
        title: item.content || item.label || '',
        body: ''
      }, index);
    }
    if (type === 'note' || type === 'text') {
      if (legacyVariant === 'goal') {
        return normalizeItem({
          module: 'goal',
          variant: 'goal-focus',
          id: item.id,
          x: item.x,
          y: item.y,
          z: item.z,
          rotate: item.rotation,
          w: item.width || item.w || 360,
          h: item.height || item.h || 300,
          title: item.label || '',
          focus: item.content || '',
          steps: ['', '', '']
        }, index);
      }
      if (legacyVariant === 'quote' || legacyVariant === 'mantra') {
        return normalizeItem({
          module: 'affirmation',
          variant: legacyVariant === 'mantra' ? 'intention-card' : 'affirmation-card',
          id: item.id,
          x: item.x,
          y: item.y,
          z: item.z,
          rotate: item.rotation,
          w: item.width || item.w || (legacyVariant === 'mantra' ? 360 : 380),
          h: item.height || item.h || (legacyVariant === 'mantra' ? 230 : 260),
          text: item.content || '',
          caption: item.label || ''
        }, index);
      }
      return normalizeItem({
        module: 'text',
        variant: legacyVariant === 'label' ? 'micro-label' : 'note-card',
        id: item.id,
        x: item.x,
        y: item.y,
        z: item.z,
        rotate: item.rotation,
        w: item.width || item.w || 320,
        h: item.height || item.h || 240,
        title: legacyVariant === 'label' ? item.content || '' : '',
        body: legacyVariant === 'label' ? '' : item.content || ''
      }, index);
    }
    return normalizeItem({
      module: 'decor',
      variant: mapLegacyAccent(item.accentId || item.type || type),
      id: item.id,
      x: item.x,
      y: item.y,
      z: item.z,
      rotate: item.rotation,
      w: item.width || item.w || 220,
      h: item.height || item.h || 180,
      lockAspect: true
    }, index);
  }

  function normalizeItem(item, index) {
    if (!item || typeof item !== 'object') return null;
    const module = item.module || 'text';
    const fallbackX = BOARD_PADDING + ((index || 0) * 18);
    const fallbackY = BOARD_PADDING + ((index || 0) * 16);
    const normalized = {
      id: item.id || uid(),
      module,
      variant: item.variant || module,
      x: clamp(round(toNumber(item.x, fallbackX)), 0, BOARD_WIDTH),
      y: clamp(round(toNumber(item.y, fallbackY)), 0, BOARD_HEIGHT),
      w: round(clamp(toNumber(item.w || item.width, 320), 120, BOARD_WIDTH - BOARD_PADDING)),
      h: round(clamp(toNumber(item.h || item.height, 220), 70, BOARD_HEIGHT - BOARD_PADDING)),
      z: toNumber(item.z, (index || 0) + 1),
      rotate: toNumber(item.rotate != null ? item.rotate : item.rotation, 0),
      lockAspect: !!item.lockAspect,
      aspectRatio: toNumber(item.aspectRatio, toNumber(item.w || item.width, 320) / Math.max(toNumber(item.h || item.height, 220), 1))
    };

    if (module === 'photo') {
      if (!item.src) return null;
      normalized.src = item.src;
      normalized.title = item.title || item.label || 'Photo';
      normalized.credit = item.credit || 'Free photo';
      normalized.source = item.source || item.credit || 'Pexels';
      normalized.lockAspect = true;
      normalized.aspectRatio = normalized.w / Math.max(normalized.h, 1);
      return normalized;
    }

    if (module === 'frame') {
      normalized.title = item.title || '';
      normalized.caption = item.caption || '';
      normalized.src = item.src || '';
      normalized.lockAspect = false;
      return normalized;
    }

    if (module === 'text') {
      normalized.title = item.title || '';
      normalized.body = item.body || '';
      return normalized;
    }

    if (module === 'goal') {
      normalized.title = item.title || '';
      normalized.focus = item.focus || '';
      normalized.steps = Array.isArray(item.steps) ? item.steps.slice(0, 3).concat(['', '', '']).slice(0, 3) : ['', '', ''];
      return normalized;
    }

    if (module === 'habit') {
      normalized.title = item.title || '';
      normalized.mode = item.mode || 'weekly';
      normalized.days = Array.isArray(item.days) ? item.days.map(Boolean).slice(0, 7).concat([false, false, false, false, false, false, false]).slice(0, 7) : [false, false, false, false, false, false, false];
      return normalized;
    }

    if (module === 'calendar') {
      normalized.title = item.title || '';
      normalized.mode = item.mode || 'week';
      normalized.week = Array.isArray(item.week) ? item.week.slice(0, 7).map(entry => ({
        label: entry?.label || '',
        note: entry?.note || ''
      })) : weekNotes();
      normalized.cells = Array.isArray(item.cells) ? item.cells.slice(0, 35).map(entry => ({
        day: entry?.day || '',
        note: entry?.note || ''
      })) : monthCells();
      normalized.footer = item.footer || '';
      return normalized;
    }

    if (module === 'affirmation') {
      normalized.text = item.text || '';
      normalized.caption = item.caption || '';
      return normalized;
    }

    normalized.lockAspect = item.lockAspect !== false;
    normalized.aspectRatio = toNumber(item.aspectRatio, normalized.w / Math.max(normalized.h, 1));
    return normalized;
  }

  function readState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultBoardState();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return {
          version: VERSION,
          board: normalizeBoard(null),
          items: parsed.map(migrateLegacyItem).filter(Boolean)
        };
      }
      return {
        version: VERSION,
        board: normalizeBoard(parsed.board),
        items: Array.isArray(parsed.items) ? parsed.items.map(normalizeItem).filter(Boolean) : []
      };
    } catch (error) {
      return defaultBoardState();
    }
  }

  function savePayload() {
    return {
      version: VERSION,
      board: {
        width: BOARD_WIDTH,
        height: BOARD_HEIGHT,
        scrollLeft: state.board.scrollLeft,
        scrollTop: state.board.scrollTop,
        zoom: state.board.zoom,
        title: state.board.title,
        activeCategory: state.activeCategory,
        libraryCollapsed: !!state.board.libraryCollapsed,
        inspectorCollapsed: !!state.board.inspectorCollapsed
      },
      items: state.items.map(item => JSON.parse(JSON.stringify(item)))
    };
  }

  function queueSave() {
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveTimer = setTimeout(() => {
      const payload = savePayload();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      } catch (error) {}
      if (typeof window.syncToCloud === 'function') {
        try {
          window.syncToCloud('vision-board', payload);
        } catch (error) {}
      }
    }, SAVE_DELAY);
  }

  function viewportPlacement(size) {
    const viewport = state.refs.viewport;
    const jitter = Math.min(44, state.items.length * 10);
    const zoom = state.board.zoom || DEFAULT_ZOOM;
    if (!viewport) {
      return {
        x: BOARD_PADDING + jitter,
        y: BOARD_PADDING + jitter
      };
    }
    return {
      x: clamp(round(((viewport.scrollLeft + (viewport.clientWidth / 2)) / zoom) - (size.w / 2) + jitter), BOARD_PADDING, BOARD_WIDTH - size.w - BOARD_PADDING),
      y: clamp(round(((viewport.scrollTop + (viewport.clientHeight / 2)) / zoom) - (size.h / 2) + jitter), BOARD_PADDING, BOARD_HEIGHT - size.h - BOARD_PADDING)
    };
  }

  function pointerPlacement(event, size) {
    const board = state.refs.board;
    const zoom = state.board.zoom || DEFAULT_ZOOM;
    if (!board) return viewportPlacement(size);
    const rect = board.getBoundingClientRect();
    return {
      x: clamp(round(((event.clientX - rect.left) / zoom) - (size.w / 2)), BOARD_PADDING, BOARD_WIDTH - size.w - BOARD_PADDING),
      y: clamp(round(((event.clientY - rect.top) / zoom) - (size.h / 2)), BOARD_PADDING, BOARD_HEIGHT - size.h - BOARD_PADDING)
    };
  }

  function spawnFromLibrary(libraryId, point) {
    const basePoint = point || viewportPlacement({ w: 320, h: 240 });
    const photo = PHOTO_MAP[libraryId];
    if (photo) {
      return normalizeItem({
        module: 'photo',
        variant: 'photo',
        src: photo.src,
        title: photo.title,
        credit: 'Free image',
        source: photo.source,
        x: basePoint.x,
        y: basePoint.y,
        w: photo.width,
        h: photo.height,
        lockAspect: true,
        aspectRatio: photo.width / photo.height
      }, state.items.length);
    }

    switch (libraryId) {
      case 'glass-panel':
        return normalizeItem({ module: 'decor', variant: 'glass-panel', x: basePoint.x, y: basePoint.y, w: 360, h: 220, lockAspect: false }, state.items.length);
      case 'spotlight-wash':
        return normalizeItem({ module: 'decor', variant: 'spotlight-wash', x: basePoint.x, y: basePoint.y, w: 320, h: 220, lockAspect: false }, state.items.length);
      case 'soft-divider':
        return normalizeItem({ module: 'decor', variant: 'soft-divider', x: basePoint.x, y: basePoint.y, w: 440, h: 86, lockAspect: false }, state.items.length);
      case 'headline':
        return normalizeItem({ module: 'text', variant: 'headline', x: basePoint.x, y: basePoint.y, w: 460, h: 200, title: '', body: '' }, state.items.length);
      case 'note-card':
        return normalizeItem({ module: 'text', variant: 'note-card', x: basePoint.x, y: basePoint.y, w: 340, h: 260, title: '', body: '' }, state.items.length);
      case 'micro-label':
        return normalizeItem({ module: 'text', variant: 'micro-label', x: basePoint.x, y: basePoint.y, w: 260, h: 118, title: '', body: '' }, state.items.length);
      case 'arch-frame':
        return normalizeItem({ module: 'frame', variant: 'arch-frame', x: basePoint.x, y: basePoint.y, w: 340, h: 430, title: '', caption: '' }, state.items.length);
      case 'polaroid-frame':
        return normalizeItem({ module: 'frame', variant: 'polaroid-frame', x: basePoint.x, y: basePoint.y, w: 320, h: 400, title: '', caption: '' }, state.items.length);
      case 'glass-frame':
        return normalizeItem({ module: 'frame', variant: 'glass-frame', x: basePoint.x, y: basePoint.y, w: 360, h: 280, title: '', caption: '' }, state.items.length);
      case 'goal-focus':
        return normalizeItem({ module: 'goal', variant: 'goal-focus', x: basePoint.x, y: basePoint.y, w: 360, h: 308, title: '', focus: '', steps: ['', '', ''] }, state.items.length);
      case 'milestone-map':
        return normalizeItem({ module: 'goal', variant: 'milestone-map', x: basePoint.x, y: basePoint.y, w: 390, h: 320, title: '', focus: '', steps: ['', '', ''] }, state.items.length);
      case 'weekly-habit':
        return normalizeItem({ module: 'habit', variant: 'weekly-habit', x: basePoint.x, y: basePoint.y, w: 360, h: 220, title: '', mode: 'weekly', days: [false, false, false, false, false, false, false] }, state.items.length);
      case 'streak-strip':
        return normalizeItem({ module: 'habit', variant: 'streak-strip', x: basePoint.x, y: basePoint.y, w: 420, h: 150, title: '', mode: 'strip', days: [false, false, false, false, false, false, false] }, state.items.length);
      case 'week-planner':
        return normalizeItem({ module: 'calendar', variant: 'week-planner', x: basePoint.x, y: basePoint.y, w: 540, h: 260, title: '', mode: 'week', week: weekNotes() }, state.items.length);
      case 'month-snapshot':
        return normalizeItem({ module: 'calendar', variant: 'month-snapshot', x: basePoint.x, y: basePoint.y, w: 420, h: 340, title: '', mode: 'month', cells: monthCells(), footer: '' }, state.items.length);
      case 'affirmation-card':
        return normalizeItem({ module: 'affirmation', variant: 'affirmation-card', x: basePoint.x, y: basePoint.y, w: 420, h: 250, text: '', caption: '' }, state.items.length);
      case 'intention-card':
        return normalizeItem({ module: 'affirmation', variant: 'intention-card', x: basePoint.x, y: basePoint.y, w: 360, h: 220, text: '', caption: '' }, state.items.length);
      default:
        return normalizeItem({ module: 'decor', variant: libraryId, x: basePoint.x, y: basePoint.y, w: 230, h: 180, lockAspect: true }, state.items.length);
    }
  }

  function renderCategoryButtons() {
    return CATEGORY_DEFS.map(category => `
      <button class="vs-category-btn${category.id === state.activeCategory ? ' is-active' : ''}" type="button" data-category="${escapeHtmlAttr(category.id)}" title="${escapeHtmlAttr(category.label)}">
        <span class="vs-category-icon">${iconSvg(category.icon)}</span>
        <span class="vs-category-text">
          <span class="vs-category-label">${escapeHtml(category.label)}</span>
        </span>
      </button>
    `).join('');
  }

  function renderLibraryPreview(item) {
    if (item.preview === 'photo' && item.photoId) {
      const photo = PHOTO_MAP[item.photoId];
      return `<div class="vs-library-preview photo"><img src="${escapeHtmlAttr(photo.thumb)}" alt="${escapeHtmlAttr(photo.title)}" loading="lazy" /><span class="vs-mini-label">Free photo</span></div>`;
    }
    return `<div class="vs-library-preview preview-${escapeHtmlAttr(item.preview)}"><span class="vs-mini-label">${escapeHtml(item.category.replace('-', ' '))}</span></div>`;
  }

  function visibleLibraryItems() {
    const query = state.search.trim().toLowerCase();
    return LIBRARY_ITEMS.filter(item => {
      if (item.category !== state.activeCategory) return false;
      if (!query) return true;
      return [item.title, item.copy, item.category].join(' ').toLowerCase().includes(query);
    });
  }

  function renderLibraryGrid() {
    const items = visibleLibraryItems();
    if (!items.length) {
      return '<div class="vs-empty-copy">No modules match this search yet.</div>';
    }
    return items.map(item => `
      <button class="vs-library-card${item.category === 'photos' ? ' is-photo' : ' is-module'}" type="button" draggable="true" data-library-id="${escapeHtmlAttr(item.id)}">
        ${renderLibraryPreview(item)}
        <span class="vs-library-body">
          <span class="vs-library-overline">${escapeHtml(item.category.replace('-', ' '))}</span>
          <span class="vs-library-label">${escapeHtml(item.title)}</span>
          <span class="vs-library-copy">${escapeHtml(item.copy)}</span>
        </span>
      </button>
    `).join('');
  }

  function boardShell() {
    const category = currentCategory();
    const libraryLabel = state.board.libraryCollapsed ? 'Open Library' : 'Hide Library';
    const inspectorLabel = state.board.inspectorCollapsed ? 'Open Inspector' : 'Hide Inspector';
    return `
      <section class="vs-editor">
        <header class="vs-appbar">
          <div class="vs-appbar-left">
            <div class="vs-brand-mark">P</div>
            <div class="vs-brand-copy">
              <div class="vs-brand-kicker">Command Center</div>
              <div class="vs-brand-name">Vision Editor</div>
            </div>
          </div>
          <div class="vs-appbar-center">
            <input id="vs-board-title" class="vs-board-title-input" type="text" value="${escapeHtmlAttr(state.board.title || DEFAULT_TITLE)}" placeholder="Untitled vision board" />
            <div class="vs-board-title-sub">Layer imagery, planning, and direction into one living board.</div>
          </div>
          <div class="vs-appbar-actions">
            <button class="vs-top-btn" type="button" data-action="toggle-library">${libraryLabel}</button>
            <button class="vs-top-btn" type="button" data-action="toggle-inspector">${inspectorLabel}</button>
            <button class="vs-top-btn" type="button" data-action="quick-headline">Headline</button>
            <button class="vs-top-btn" type="button" data-action="quick-goal">Goal</button>
            <button class="vs-top-btn primary" type="button" data-action="upload-board-photo">Upload</button>
            <button class="vs-top-btn" type="button" data-action="toggle-snap">${state.snapEnabled ? 'Snap On' : 'Snap Off'}</button>
            <input id="vs-upload-input" type="file" accept="image/*" multiple hidden />
          </div>
        </header>
        <div class="vs-editor-body">
          <aside class="vs-rail">
            <div class="vs-rail-stack" id="vs-category-grid">${renderCategoryButtons()}</div>
          </aside>
          <aside class="vs-library-pane">
            <div class="vs-library-pane-head">
              <div>
                <div class="vs-kicker">Library</div>
                <h2 class="vs-title">${escapeHtml(category.label)}</h2>
                <p class="vs-subtitle">${escapeHtml(category.copy)}. Click to drop, or drag into the exact area you want to build around.</p>
              </div>
              <div class="vs-pane-badge">${state.items.length} module${state.items.length === 1 ? '' : 's'}</div>
            </div>
            <label class="vs-search">
              <span class="vs-search-icon" aria-hidden="true"></span>
              <input id="vs-search" type="text" placeholder="Search elements, photos, text..." value="${escapeHtmlAttr(state.search)}" />
            </label>
            <div class="vs-library-meta">
              <span class="vs-mini-chip">Visual bank</span>
              <span class="vs-mini-chip">Drag to place</span>
              <span class="vs-mini-chip">Resize live</span>
            </div>
            <div class="vs-library">
              <div class="vs-library-head">
                <div class="vs-library-title">${escapeHtml(category.label)} Bank</div>
                <div class="vs-library-caption">Built for real composition, not demo filler.</div>
              </div>
              <div class="vs-library-grid" id="vs-library-grid">${renderLibraryGrid()}</div>
            </div>
          </aside>
          <div class="vs-stage-shell">
            <div class="vs-stage-topbar">
              <div class="vs-stage-pill">Canvas mode</div>
              <div class="vs-stage-copy">Move fast on the board, then tune selected modules only when you need precision.</div>
              <div class="vs-stage-actions">
                <button class="vs-stage-btn" type="button" data-action="quick-headline">Add Text</button>
                <button class="vs-stage-btn" type="button" data-action="quick-goal">Add Goal</button>
                <button class="vs-stage-btn" type="button" data-action="quick-affirmation">Add Card</button>
                <button class="vs-stage-btn" type="button" data-action="reset-view">Reset View</button>
                <button class="vs-stage-btn danger" type="button" data-action="clear-board">Clear Board</button>
              </div>
            </div>
            <div class="vs-stage">
              <div class="vs-stage-quickdock">
                <button class="vs-quickdock-btn" type="button" data-action="upload-board-photo">Photo</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-headline">Text</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-goal">Goal</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-affirmation">Affirm</button>
              </div>
              <div class="vs-viewport-shell">
                <div class="vs-viewport" id="vs-viewport">
                  <div class="vs-board-scale" id="vs-board-scale">
                    <div class="vs-board" id="vs-board"></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="vs-stage-footer">
              <div class="vs-stage-footer-copy">
                <strong>${escapeHtml(state.board.title || DEFAULT_TITLE)}</strong>
                <span>Drag with the grip, overlap freely, and let the canvas stay in charge.</span>
              </div>
              <div class="vs-zoom-wrap">
                <button class="vs-zoom-btn" type="button" data-action="zoom-out">-</button>
                <input id="vs-zoom-range" class="vs-zoom-range" type="range" min="${MIN_ZOOM}" max="${MAX_ZOOM}" step="0.01" value="${state.board.zoom || DEFAULT_ZOOM}" />
                <button class="vs-zoom-btn" type="button" data-action="zoom-in">+</button>
                <button class="vs-stage-btn" type="button" data-action="zoom-fit">Fit</button>
                <div class="vs-zoom-value" id="vs-zoom-value">${zoomLabel()}</div>
              </div>
            </div>
          </div>
          <aside class="vs-inspector-pane">
            <div class="vs-inspector-shell" id="vs-inspector">${renderInspectorPanel()}</div>
          </aside>
        </div>
      </section>
    `;
  }

  function decorSvg(variant) {
    switch (variant) {
      case 'butterfly':
        return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M58 45c-14-24-33-34-44-28-11 7-5 28 18 35-16 4-24 17-18 26 8 10 28 5 44-16z" fill="#dbe6ff"/><path d="M62 45c14-24 33-34 44-28 11 7 5 28-18 35 16 4 24 17 18 26-8 10-28 5-44-16z" fill="#ffffff" opacity=".84"/><path d="M60 22v44" stroke="#1a317f" stroke-width="4" stroke-linecap="round"/><path d="M60 23c6-7 12-10 18-10M60 23c-6-7-12-10-18-10" stroke="#1a317f" stroke-width="3" stroke-linecap="round"/></svg>';
      case 'crown':
        return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M20 62l10-34 23 20 7-24 7 24 23-20 10 34z" fill="#ffe4a8"/><path d="M28 58c10-11 18-18 32-18s22 7 32 18" fill="none" stroke="#fff6db" stroke-width="4" stroke-linecap="round"/><rect x="22" y="62" width="76" height="12" rx="6" fill="#ffd56e"/><circle cx="30" cy="28" r="5" fill="#fff"/><circle cx="60" cy="24" r="5" fill="#fff"/><circle cx="90" cy="28" r="5" fill="#fff"/></svg>';
      case 'bow':
        return '<svg viewBox="0 0 120 90" aria-hidden="true"><path d="M60 48C40 30 18 20 10 28c-8 8 4 28 28 34-5 7-3 15 6 18 8 2 14-2 16-11 2 9 8 13 16 11 9-3 11-11 6-18 24-6 36-26 28-34-8-8-30 2-50 20z" fill="#ffc7dc"/><circle cx="60" cy="48" r="10" fill="#fff"/></svg>';
      case 'bloom':
        return '<svg viewBox="0 0 120 90" aria-hidden="true"><g fill="#ffdbe8"><ellipse cx="60" cy="24" rx="14" ry="18"/><ellipse cx="86" cy="42" rx="14" ry="18" transform="rotate(70 86 42)"/><ellipse cx="76" cy="70" rx="14" ry="18" transform="rotate(144 76 70)"/><ellipse cx="44" cy="70" rx="14" ry="18" transform="rotate(-144 44 70)"/><ellipse cx="34" cy="42" rx="14" ry="18" transform="rotate(-70 34 42)"/></g><circle cx="60" cy="47" r="10" fill="#fff"/><circle cx="60" cy="47" r="4" fill="#f4a6c1"/></svg>';
      case 'petal-spray':
        return '<svg viewBox="0 0 180 120" aria-hidden="true"><ellipse cx="40" cy="40" rx="18" ry="10" fill="#ffe4ef"/><ellipse cx="76" cy="28" rx="14" ry="9" fill="#ffd0e1"/><ellipse cx="100" cy="64" rx="18" ry="11" fill="#fff0f6"/><ellipse cx="134" cy="42" rx="20" ry="12" fill="#ffdce9"/><path d="M28 94c22-12 40-16 59-12 20 5 34 4 53-7" stroke="#d4e5ff" stroke-width="8" stroke-linecap="round" opacity=".72"/></svg>';
      case 'silk-ribbon':
        return '<svg viewBox="0 0 220 120" aria-hidden="true"><path d="M16 58c32-34 70-48 112-44 24 2 44 10 58 21-26 2-49 12-66 30 18 6 31 18 36 33-17-10-39-15-66-13-27 2-47 11-64 25 10-16 12-31-10-52z" fill="#ffd4e4"/><path d="M36 66c28-12 58-14 94-7" stroke="#fff" stroke-opacity=".6" stroke-width="6" stroke-linecap="round"/></svg>';
      case 'spotlight-wash':
        return '<svg viewBox="0 0 220 160" aria-hidden="true"><defs><radialGradient id="wash" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".82"/><stop offset="45%" stop-color="#b8d0ff" stop-opacity=".48"/><stop offset="100%" stop-color="#b8d0ff" stop-opacity="0"/></radialGradient></defs><ellipse cx="110" cy="80" rx="88" ry="54" fill="url(#wash)"/></svg>';
      case 'mood-aura':
        return '<svg viewBox="0 0 220 180" aria-hidden="true"><defs><radialGradient id="aura" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff" stop-opacity=".95"/><stop offset="38%" stop-color="#c8d8ff" stop-opacity=".55"/><stop offset="100%" stop-color="#c8d8ff" stop-opacity="0"/></radialGradient></defs><circle cx="110" cy="90" r="72" fill="url(#aura)"/></svg>';
      case 'soft-divider':
        return '<svg viewBox="0 0 260 56" aria-hidden="true"><path d="M20 28h220" stroke="#ffffff" stroke-width="10" stroke-linecap="round" opacity=".92"/><path d="M64 28h132" stroke="#9dbbff" stroke-width="4" stroke-linecap="round" opacity=".85"/></svg>';
      case 'glass-panel':
        return '<svg viewBox="0 0 240 160" aria-hidden="true"><rect x="12" y="12" width="216" height="136" rx="26" fill="rgba(255,255,255,0.22)" stroke="rgba(255,255,255,0.7)" stroke-width="2"/><path d="M24 32c40-18 84-24 140-16" stroke="rgba(255,255,255,0.6)" stroke-width="10" stroke-linecap="round"/></svg>';
      default:
        return '<svg viewBox="0 0 220 180" aria-hidden="true"><circle cx="110" cy="90" r="70" fill="#d7e7ff"/></svg>';
    }
  }

  function renderEmptyState() {
    return `
      <div class="vs-empty">
        <div class="vs-empty-inner">
          <div class="vs-empty-mark">Studio</div>
          <div class="vs-empty-title">Build a board that actually feels like your future.</div>
          <div class="vs-empty-copy">Start clean, pull from the library, or load a starter composition that gives you structure without fake demo content.</div>
          <div class="vs-empty-actions">
            <button class="vs-empty-btn primary" type="button" data-action="starter-editorial">Editorial Glow</button>
            <button class="vs-empty-btn" type="button" data-action="starter-focus-map">Focus Map</button>
            <button class="vs-empty-btn" type="button" data-action="upload-board-photo">Upload Images</button>
          </div>
        </div>
      </div>
    `;
  }

  function itemToolbar(item, label) {
    return `
      <div class="vs-item-toolbar">
        <div class="vs-item-badge">${escapeHtml(label)}</div>
        <div class="vs-item-actions">
          <button class="vs-icon-btn vs-drag-handle" type="button" data-drag-handle="${escapeHtmlAttr(item.id)}" aria-label="Move module" title="Move module">${actionSvg('grip')}</button>
          <button class="vs-icon-btn" type="button" data-layer-up="${escapeHtmlAttr(item.id)}" aria-label="Bring module forward" title="Bring forward">${actionSvg('up')}</button>
          <button class="vs-icon-btn" type="button" data-layer-down="${escapeHtmlAttr(item.id)}" aria-label="Send module back" title="Send backward">${actionSvg('down')}</button>
          <button class="vs-icon-btn" type="button" data-duplicate-item="${escapeHtmlAttr(item.id)}" aria-label="Duplicate module" title="Duplicate">${actionSvg('copy')}</button>
          <button class="vs-icon-btn" type="button" data-delete-item="${escapeHtmlAttr(item.id)}" aria-label="Delete module" title="Delete">${actionSvg('trash')}</button>
        </div>
      </div>
    `;
  }

  function renderPhoto(item) {
    return `
      <div class="vs-item-shell vs-module-photo">
        ${itemToolbar(item, item.title || 'Photo')}
        <div class="vs-content">
          <img src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.title || 'Vision photo')}" />
          <div class="vs-photo-overlay">
            <span class="vs-photo-label">${escapeHtml(item.title || 'Photo')}</span>
            <span class="vs-photo-credit">${escapeHtml(item.source || 'Free')}</span>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderFrame(item) {
    const variantClass = item.variant === 'polaroid-frame' ? 'polaroid' : item.variant === 'glass-frame' ? 'glass' : 'arch';
    return `
      <div class="vs-item-shell vs-module-frame">
        ${itemToolbar(item, 'Frame')}
        <div class="vs-content">
          <div class="vs-frame-shell ${variantClass}">
            <div class="vs-frame-inner">
              ${item.src
                ? `<img class="vs-frame-image" src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.title || 'Framed image')}" />`
                : `<button class="vs-frame-placeholder" type="button" data-frame-upload="${escapeHtmlAttr(item.id)}"><span><span class="vs-frame-placeholder-title">Add image</span><span class="vs-frame-placeholder-copy">Upload a photo into this frame.</span></span></button>`
              }
            </div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderText(item) {
    if (item.variant === 'headline') {
      return `
        <div class="vs-item-shell vs-module-headline">
          ${itemToolbar(item, 'Headline')}
          <div class="vs-content">
            <div class="vs-editable vs-headline-text" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add a headline">${escapeHtml(item.title || '')}</div>
            <div class="vs-editable vs-headline-sub" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Optional subline">${escapeHtml(item.body || '')}</div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'micro-label') {
      return `
        <div class="vs-item-shell vs-module-text">
          ${itemToolbar(item, 'Label')}
          <div class="vs-content">
            <div class="vs-note-surface">
              <div class="vs-editable vs-note-body" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add label">${escapeHtml(item.title || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    return `
      <div class="vs-item-shell vs-module-note">
        ${itemToolbar(item, 'Note')}
        <div class="vs-content">
          <div class="vs-note-surface">
            <div class="vs-note-title">Notes</div>
            <div class="vs-editable vs-note-body" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Write something real, useful, or motivating.">${escapeHtml(item.body || '')}</div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderGoal(item) {
    return `
      <div class="vs-item-shell vs-module-goal">
        ${itemToolbar(item, item.variant === 'milestone-map' ? 'Milestones' : 'Goal')}
        <div class="vs-content">
          <div class="vs-goal-card">
            <div class="vs-editable vs-goal-title" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Goal title">${escapeHtml(item.title || '')}</div>
            <div class="vs-editable vs-goal-focus" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="focus" data-placeholder="What are you moving toward?">${escapeHtml(item.focus || '')}</div>
            <div class="vs-goal-list">
              ${item.steps.map((step, index) => `
                <div class="vs-goal-row">
                  <span class="vs-goal-dot"></span>
                  <div class="vs-editable vs-goal-step" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="steps" data-index="${index}" data-placeholder="Milestone ${index + 1}">${escapeHtml(step || '')}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderHabit(item) {
    return `
      <div class="vs-item-shell vs-module-habit">
        ${itemToolbar(item, 'Habit')}
        <div class="vs-content">
          <div class="vs-habit-card">
            <div class="vs-editable vs-habit-title" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Habit title">${escapeHtml(item.title || '')}</div>
            <div class="vs-habit-track">
              ${item.days.map((done, index) => `
                <div class="vs-habit-day">
                  <span class="vs-habit-day-label">${['M','T','W','T','F','S','S'][index]}</span>
                  <button class="vs-habit-toggle${done ? ' is-done' : ''}" type="button" data-toggle-day="${escapeHtmlAttr(item.id)}" data-index="${index}"></button>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderCalendar(item) {
    if (item.mode === 'month') {
      return `
        <div class="vs-item-shell vs-module-calendar">
          ${itemToolbar(item, 'Calendar')}
          <div class="vs-content">
            <div class="vs-calendar-card">
              <div class="vs-editable vs-calendar-title" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Month snapshot">${escapeHtml(item.title || '')}</div>
              <div class="vs-calendar-grid">
                ${['S','M','T','W','T','F','S'].map(day => `<div class="vs-calendar-head">${day}</div>`).join('')}
                ${item.cells.map(cell => `
                  <div class="vs-calendar-cell">
                    <span class="vs-calendar-date">${escapeHtml(cell.day || '')}</span>
                    <span class="vs-calendar-note">${escapeHtml(cell.note || '')}</span>
                  </div>
                `).join('')}
              </div>
              <div class="vs-editable vs-goal-focus" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="footer" data-placeholder="Add one focus for this month.">${escapeHtml(item.footer || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    return `
      <div class="vs-item-shell vs-module-calendar">
        ${itemToolbar(item, 'Calendar')}
        <div class="vs-content">
          <div class="vs-calendar-card">
            <div class="vs-editable vs-calendar-title" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Week planner">${escapeHtml(item.title || '')}</div>
            <div class="vs-calendar-grid">
              ${item.week.map((day, index) => `
                <div class="vs-calendar-cell">
                  <div class="vs-calendar-head">${escapeHtml(day.label || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index])}</div>
                  <div class="vs-editable vs-calendar-note" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="week" data-index="${index}" data-placeholder="Plan">${escapeHtml(day.note || '')}</div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderAffirmation(item) {
    return `
      <div class="vs-item-shell vs-module-affirmation">
        ${itemToolbar(item, 'Affirmation')}
        <div class="vs-content">
          <div class="vs-affirmation-surface">
            <div class="vs-editable vs-affirmation-text" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="text" data-placeholder="Write an affirmation that feels true when you read it.">${escapeHtml(item.text || '')}</div>
            <div class="vs-editable vs-affirmation-caption" contenteditable="true" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="caption" data-placeholder="Optional caption">${escapeHtml(item.caption || '')}</div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderDecor(item) {
    return `
      <div class="vs-item-shell vs-module-decor">
        ${itemToolbar(item, 'Accent')}
        <div class="vs-content">
          <div class="vs-decor-surface">${decorSvg(item.variant)}</div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderItem(item) {
    const classes = ['vs-item'];
    if (state.selectedId === item.id) classes.push('is-selected');
    const style = `left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;z-index:${item.z};--vs-rotation:${item.rotate}deg;`;
    let inner = '';
    if (item.module === 'photo') inner = renderPhoto(item);
    else if (item.module === 'frame') inner = renderFrame(item);
    else if (item.module === 'goal') inner = renderGoal(item);
    else if (item.module === 'habit') inner = renderHabit(item);
    else if (item.module === 'calendar') inner = renderCalendar(item);
    else if (item.module === 'affirmation') inner = renderAffirmation(item);
    else if (item.module === 'decor') inner = renderDecor(item);
    else inner = renderText(item);
    return `<article class="${classes.join(' ')}" data-item-id="${escapeHtmlAttr(item.id)}" style="${style}">${inner}</article>`;
  }

  function renderGuides() {
    return `
      <div class="vs-guides">
        ${renderGuideLines()}
      </div>
    `;
  }

  function renderGuideLines() {
    return `
      ${state.guides.vertical.map(value => `<div class="vs-guide is-vertical" style="left:${value}px"></div>`).join('')}
      ${state.guides.horizontal.map(value => `<div class="vs-guide is-horizontal" style="top:${value}px"></div>`).join('')}
    `;
  }

  function getGuideLayer() {
    if (state.refs.guideLayer && state.refs.guideLayer.isConnected) return state.refs.guideLayer;
    if (!state.refs.board) return null;
    state.refs.guideLayer = state.refs.board.querySelector('.vs-guides');
    return state.refs.guideLayer;
  }

  function updateGuideLayer() {
    const layer = getGuideLayer();
    if (!layer) return;
    layer.innerHTML = renderGuideLines();
  }

  function getLiveItemNode(itemId) {
    if (!state.refs.board || !itemId) return null;
    return state.refs.board.querySelector(`[data-item-id="${itemId}"]`);
  }

  function applyItemFrame(node, item) {
    if (!node || !item) return;
    node.style.left = item.x + 'px';
    node.style.top = item.y + 'px';
    node.style.width = item.w + 'px';
    node.style.height = item.h + 'px';
    node.style.zIndex = String(item.z);
    node.style.setProperty('--vs-rotation', (item.rotate || 0) + 'deg');
  }

  function renderBoard() {
    if (!state.refs.board) return;
    const html = state.items.length
      ? state.items.slice().sort((a, b) => a.z - b.z).map(renderItem).join('')
      : renderEmptyState();
    state.refs.board.innerHTML = html + renderGuides();
    state.refs.guideLayer = state.refs.board.querySelector('.vs-guides');
    updateChrome();
  }

  function syncEditorLayoutState() {
    if (!state.root) return;
    state.root.dataset.libraryCollapsed = state.board.libraryCollapsed ? 'true' : 'false';
    state.root.dataset.inspectorCollapsed = state.board.inspectorCollapsed ? 'true' : 'false';
    state.root.dataset.hasSelection = state.selectedId ? 'true' : 'false';
    const libraryToggle = state.root.querySelector('[data-action="toggle-library"]');
    const inspectorToggle = state.root.querySelector('[data-action="toggle-inspector"]');
    if (libraryToggle) libraryToggle.textContent = state.board.libraryCollapsed ? 'Open Library' : 'Hide Library';
    if (inspectorToggle) inspectorToggle.textContent = state.board.inspectorCollapsed ? 'Open Inspector' : 'Hide Inspector';
  }

  function fitZoomValue() {
    const viewport = state.refs.viewport;
    if (!viewport) return DEFAULT_ZOOM;
    const usableWidth = Math.max(440, viewport.clientWidth - 180);
    const usableHeight = Math.max(320, viewport.clientHeight - 180);
    return clamp(Math.min(usableWidth / BOARD_WIDTH, usableHeight / BOARD_HEIGHT), MIN_ZOOM, MAX_ZOOM);
  }

  function applyViewportMetrics() {
    if (state.root) {
      state.root.style.setProperty('--vs-board-width', BOARD_WIDTH + 'px');
      state.root.style.setProperty('--vs-board-height', BOARD_HEIGHT + 'px');
      state.root.style.setProperty('--vs-scale', String(state.board.zoom || DEFAULT_ZOOM));
    }
    if (state.refs.boardScale) {
      state.refs.boardScale.style.width = Math.round(BOARD_WIDTH * (state.board.zoom || DEFAULT_ZOOM)) + 'px';
      state.refs.boardScale.style.height = Math.round(BOARD_HEIGHT * (state.board.zoom || DEFAULT_ZOOM)) + 'px';
    }
  }

  function updateChrome() {
    if (state.refs.zoomRange) state.refs.zoomRange.value = String(state.board.zoom || DEFAULT_ZOOM);
    if (state.refs.zoomValue) state.refs.zoomValue.textContent = zoomLabel();
    if (state.refs.titleInput && document.activeElement !== state.refs.titleInput) {
      state.refs.titleInput.value = state.board.title || DEFAULT_TITLE;
    }
    if (state.refs.paneBadge) {
      state.refs.paneBadge.textContent = state.items.length + ' module' + (state.items.length === 1 ? '' : 's');
    }
    if (state.refs.footerTitle) state.refs.footerTitle.textContent = state.board.title || DEFAULT_TITLE;
    syncEditorLayoutState();
    renderInspector();
  }

  function setZoom(nextZoom, options) {
    const viewport = state.refs.viewport;
    const preserveCenter = !options || options.preserveCenter !== false;
    const previousZoom = state.board.zoom || DEFAULT_ZOOM;
    const targetZoom = clamp(nextZoom, MIN_ZOOM, MAX_ZOOM);
    if (!viewport) {
      state.board.zoom = targetZoom;
      applyViewportMetrics();
      updateChrome();
      return;
    }
    const centerX = preserveCenter ? (viewport.scrollLeft + (viewport.clientWidth / 2)) / previousZoom : 0;
    const centerY = preserveCenter ? (viewport.scrollTop + (viewport.clientHeight / 2)) / previousZoom : 0;
    state.board.zoom = targetZoom;
    applyViewportMetrics();
    if (preserveCenter) {
      viewport.scrollLeft = Math.max(0, round((centerX * targetZoom) - (viewport.clientWidth / 2)));
      viewport.scrollTop = Math.max(0, round((centerY * targetZoom) - (viewport.clientHeight / 2)));
      syncScrollPosition();
    }
    updateChrome();
  }

  function rerenderShell() {
    if (!state.root) return;
    state.root.innerHTML = boardShell();
    cacheRefs();
    bindMountedRefs();
    applyViewportMetrics();
    updateCategoryUi();
    updateLibraryUi();
    restoreScroll();
    renderBoard();
  }

  function cacheRefs() {
    state.refs = {
      categoryGrid: state.root.querySelector('#vs-category-grid'),
      libraryGrid: state.root.querySelector('#vs-library-grid'),
      search: state.root.querySelector('#vs-search'),
      upload: state.root.querySelector('#vs-upload-input'),
      viewport: state.root.querySelector('#vs-viewport'),
      board: state.root.querySelector('#vs-board'),
      boardScale: state.root.querySelector('#vs-board-scale'),
      titleInput: state.root.querySelector('#vs-board-title'),
      zoomRange: state.root.querySelector('#vs-zoom-range'),
      zoomValue: state.root.querySelector('#vs-zoom-value'),
      paneBadge: state.root.querySelector('.vs-pane-badge'),
      footerTitle: state.root.querySelector('.vs-stage-footer-copy strong'),
      inspector: state.root.querySelector('#vs-inspector'),
      guideLayer: state.root.querySelector('.vs-guides')
    };
  }

  function updateCategoryUi() {
    if (!state.refs.categoryGrid) return;
    state.refs.categoryGrid.innerHTML = renderCategoryButtons();
  }

  function updateLibraryUi() {
    if (!state.refs.libraryGrid) return;
    state.refs.libraryGrid.className = 'vs-library-grid is-' + state.activeCategory;
    state.refs.libraryGrid.innerHTML = renderLibraryGrid();
  }

  function restoreScroll() {
    if (!state.refs.viewport) return;
    state.refs.viewport.scrollLeft = state.board.scrollLeft;
    state.refs.viewport.scrollTop = state.board.scrollTop;
    updateChrome();
  }

  function bringToFront(itemId) {
    const nextZ = state.items.reduce((largest, item) => Math.max(largest, item.z || 0), 0) + 1;
    const item = state.items.find(entry => entry.id === itemId);
    if (!item) return;
    item.z = nextZ;
  }

  function sendBackward(itemId) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item) return;
    item.z = Math.max(1, item.z - 1);
    state.items.sort((a, b) => a.z - b.z).forEach((entry, index) => {
      entry.z = index + 1;
    });
  }

  function addItem(item) {
    if (!item) return;
    if (state.items.length >= MAX_ITEMS) {
      notify('The board is full for now. Remove something before adding more.');
      return;
    }
    state.items.push(item);
    bringToFront(item.id);
    state.selectedId = item.id;
    state.board.inspectorCollapsed = false;
    renderBoard();
    queueSave();
  }

  function deleteItem(itemId) {
    state.items = state.items.filter(item => item.id !== itemId);
    if (state.selectedId === itemId) state.selectedId = null;
    renderBoard();
    queueSave();
  }

  function duplicateItem(itemId) {
    const source = state.items.find(item => item.id === itemId);
    if (!source) return;
    const clone = JSON.parse(JSON.stringify(source));
    clone.id = uid();
    clone.x = clamp(source.x + 28, BOARD_PADDING, BOARD_WIDTH - source.w - BOARD_PADDING);
    clone.y = clamp(source.y + 28, BOARD_PADDING, BOARD_HEIGHT - source.h - BOARD_PADDING);
    clone.z = state.items.reduce((largest, item) => Math.max(largest, item.z || 0), 0) + 1;
    state.items.push(clone);
    state.selectedId = clone.id;
    renderBoard();
    queueSave();
  }

  function centerSelectedItem() {
    const item = selectedItem();
    if (!item) return;
    item.x = round((BOARD_WIDTH - item.w) / 2);
    item.y = round((BOARD_HEIGHT - item.h) / 2);
    renderBoard();
    queueSave();
  }

  function updateItemField(itemId, field, value, index) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item) return;
    if (field === 'steps') {
      item.steps[index] = value;
    } else if (field === 'week') {
      item.week[index].note = value;
    } else if (field === 'title' || field === 'body' || field === 'focus' || field === 'footer' || field === 'text' || field === 'caption') {
      item[field] = value;
    }
    queueSave();
  }

  function toggleHabitDay(itemId, index) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item || item.module !== 'habit') return;
    item.days[index] = !item.days[index];
    renderBoard();
    queueSave();
  }

  function syncScrollPosition() {
    if (!state.refs.viewport) return;
    state.board.scrollLeft = state.refs.viewport.scrollLeft;
    state.board.scrollTop = state.refs.viewport.scrollTop;
  }

  function axisSnap(proposals, size, currentStart, kind, activeId) {
    const candidates = [];
    if (kind === 'x') {
      const boardCenter = BOARD_WIDTH / 2;
      candidates.push({ pos: BOARD_PADDING, guide: BOARD_PADDING });
      candidates.push({ pos: boardCenter - (size / 2), guide: boardCenter });
      candidates.push({ pos: BOARD_WIDTH - BOARD_PADDING - size, guide: BOARD_WIDTH - BOARD_PADDING });
    } else {
      const boardCenter = BOARD_HEIGHT / 2;
      candidates.push({ pos: BOARD_PADDING, guide: BOARD_PADDING });
      candidates.push({ pos: boardCenter - (size / 2), guide: boardCenter });
      candidates.push({ pos: BOARD_HEIGHT - BOARD_PADDING - size, guide: BOARD_HEIGHT - BOARD_PADDING });
    }

    state.items.forEach(item => {
      if (item.id === activeId) return;
      const start = kind === 'x' ? item.x : item.y;
      const end = start + (kind === 'x' ? item.w : item.h);
      const center = start + ((kind === 'x' ? item.w : item.h) / 2);
      candidates.push({ pos: start, guide: start });
      candidates.push({ pos: center - (size / 2), guide: center });
      candidates.push({ pos: end - size, guide: end });
    });

    let best = currentStart;
    let bestGuide = null;
    let bestDelta = SNAP_THRESHOLD + 1;
    candidates.forEach(candidate => {
      const delta = Math.abs(proposals - candidate.pos);
      if (delta < bestDelta) {
        bestDelta = delta;
        best = candidate.pos;
        bestGuide = candidate.guide;
      }
    });
    return bestDelta <= SNAP_THRESHOLD
      ? { value: round(best), guide: round(bestGuide) }
      : { value: round(proposals), guide: null };
  }

  function computeSnap(activeId, nextX, nextY, width, height) {
    if (!state.snapEnabled) {
      return { x: round(nextX), y: round(nextY), guides: { vertical: [], horizontal: [] } };
    }
    const snappedX = axisSnap(nextX, width, nextX, 'x', activeId);
    const snappedY = axisSnap(nextY, height, nextY, 'y', activeId);
    return {
      x: clamp(snappedX.value, BOARD_PADDING, BOARD_WIDTH - width - BOARD_PADDING),
      y: clamp(snappedY.value, BOARD_PADDING, BOARD_HEIGHT - height - BOARD_PADDING),
      guides: {
        vertical: snappedX.guide != null ? [snappedX.guide] : [],
        horizontal: snappedY.guide != null ? [snappedY.guide] : []
      }
    };
  }

  function startDrag(event, itemId) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item || event.button !== 0) return;
    bringToFront(item.id);
    state.selectedId = item.id;
    renderBoard();
    const node = getLiveItemNode(item.id);
    state.drag = {
      id: item.id,
      node,
      startX: event.clientX,
      startY: event.clientY,
      originX: item.x,
      originY: item.y,
      width: item.w,
      height: item.h,
      scrollLeft: state.refs.viewport.scrollLeft,
      scrollTop: state.refs.viewport.scrollTop
    };
    if (node) node.classList.add('dragging');
    event.preventDefault();
  }

  function startResize(event, itemId) {
    const item = state.items.find(entry => entry.id === itemId);
    if (!item || event.button !== 0) return;
    bringToFront(item.id);
    state.selectedId = item.id;
    renderBoard();
    const node = getLiveItemNode(item.id);
    state.resize = {
      id: item.id,
      node,
      startX: event.clientX,
      startY: event.clientY,
      originW: item.w,
      originH: item.h,
      originX: item.x,
      originY: item.y,
      aspectRatio: item.aspectRatio || (item.w / Math.max(item.h, 1)),
      lockAspect: !!item.lockAspect,
      scrollLeft: state.refs.viewport.scrollLeft,
      scrollTop: state.refs.viewport.scrollTop
    };
    if (node) node.classList.add('resizing');
    event.preventDefault();
  }

  function autoScroll(event) {
    const viewport = state.refs.viewport;
    if (!viewport) return;
    const rect = viewport.getBoundingClientRect();
    const edge = 72;
    if (event.clientX < rect.left + edge) viewport.scrollLeft -= 18;
    if (event.clientX > rect.right - edge) viewport.scrollLeft += 18;
    if (event.clientY < rect.top + edge) viewport.scrollTop -= 18;
    if (event.clientY > rect.bottom - edge) viewport.scrollTop += 18;
  }

  function handlePointerMove(event) {
    const zoom = state.board.zoom || DEFAULT_ZOOM;
    if (state.drag) {
      autoScroll(event);
      const item = state.items.find(entry => entry.id === state.drag.id);
      if (!item) return;
      const node = state.drag.node && state.drag.node.isConnected ? state.drag.node : getLiveItemNode(state.drag.id);
      state.drag.node = node;
      const dx = ((event.clientX - state.drag.startX) + (state.refs.viewport.scrollLeft - state.drag.scrollLeft)) / zoom;
      const dy = ((event.clientY - state.drag.startY) + (state.refs.viewport.scrollTop - state.drag.scrollTop)) / zoom;
      const snapped = computeSnap(item.id, state.drag.originX + dx, state.drag.originY + dy, item.w, item.h);
      item.x = snapped.x;
      item.y = snapped.y;
      state.guides = snapped.guides;
      if (!node) {
        renderBoard();
        return;
      }
      applyItemFrame(node, item);
      updateGuideLayer();
      return;
    }
    if (state.resize) {
      autoScroll(event);
      const item = state.items.find(entry => entry.id === state.resize.id);
      if (!item) return;
      const node = state.resize.node && state.resize.node.isConnected ? state.resize.node : getLiveItemNode(state.resize.id);
      state.resize.node = node;
      const dx = ((event.clientX - state.resize.startX) + (state.refs.viewport.scrollLeft - state.resize.scrollLeft)) / zoom;
      const dy = ((event.clientY - state.resize.startY) + (state.refs.viewport.scrollTop - state.resize.scrollTop)) / zoom;
      let nextW = clamp(round(state.resize.originW + dx), 140, BOARD_WIDTH - item.x - BOARD_PADDING);
      let nextH = clamp(round(state.resize.originH + dy), 90, BOARD_HEIGHT - item.y - BOARD_PADDING);
      if (state.resize.lockAspect) {
        nextH = clamp(round(nextW / Math.max(state.resize.aspectRatio, 0.1)), 90, BOARD_HEIGHT - item.y - BOARD_PADDING);
      }
      item.w = nextW;
      item.h = nextH;
      item.aspectRatio = nextW / Math.max(nextH, 1);
      state.guides = { vertical: [], horizontal: [] };
      if (!node) {
        renderBoard();
        return;
      }
      applyItemFrame(node, item);
      updateGuideLayer();
    }
  }

  function clearInteractionState() {
    if (state.drag?.node) state.drag.node.classList.remove('dragging');
    if (state.resize?.node) state.resize.node.classList.remove('resizing');
    state.drag = null;
    state.resize = null;
    state.guides = { vertical: [], horizontal: [] };
  }

  function handlePointerUp() {
    if (!state.drag && !state.resize) return;
    clearInteractionState();
    renderBoard();
    syncScrollPosition();
    queueSave();
  }

  function handleRootClick(event) {
    const categoryBtn = event.target.closest('[data-category]');
    if (categoryBtn) {
      state.activeCategory = categoryBtn.dataset.category;
      state.board.activeCategory = state.activeCategory;
      state.board.libraryCollapsed = false;
      updateCategoryUi();
      updateLibraryUi();
      syncEditorLayoutState();
      queueSave();
      return;
    }

    const libraryCard = event.target.closest('[data-library-id]');
    if (libraryCard && !event.target.closest('[data-drag-handle]')) {
      const item = spawnFromLibrary(libraryCard.dataset.libraryId);
      addItem(item);
      return;
    }

    const action = event.target.closest('[data-action]');
    if (action) {
      switch (action.dataset.action) {
        case 'upload-board-photo':
          state.pendingUploadTarget = null;
          openUpload();
          return;
        case 'toggle-library':
          state.board.libraryCollapsed = !state.board.libraryCollapsed;
          syncEditorLayoutState();
          queueSave();
          return;
        case 'toggle-inspector':
          state.board.inspectorCollapsed = !state.board.inspectorCollapsed;
          syncEditorLayoutState();
          queueSave();
          return;
        case 'starter-editorial':
          applyStarterLayout('editorial');
          return;
        case 'starter-focus-map':
          applyStarterLayout('focus-map');
          return;
        case 'starter-mood-story':
          applyStarterLayout('mood-story');
          return;
        case 'quick-headline':
          addItem(spawnFromLibrary('headline'));
          return;
        case 'quick-goal':
          addItem(spawnFromLibrary('goal-focus'));
          return;
        case 'quick-affirmation':
          addItem(spawnFromLibrary('affirmation-card'));
          return;
        case 'toggle-snap':
          state.snapEnabled = !state.snapEnabled;
          rerenderShell();
          return;
        case 'zoom-in':
          setZoom((state.board.zoom || DEFAULT_ZOOM) + 0.08);
          queueSave();
          return;
        case 'zoom-out':
          setZoom((state.board.zoom || DEFAULT_ZOOM) - 0.08);
          queueSave();
          return;
        case 'zoom-fit':
          state.board.scrollLeft = 0;
          state.board.scrollTop = 0;
          setZoom(fitZoomValue(), { preserveCenter: false });
          restoreScroll();
          queueSave();
          return;
        case 'reset-view':
          state.board.scrollLeft = DEFAULT_SCROLL.left;
          state.board.scrollTop = DEFAULT_SCROLL.top;
          restoreScroll();
          queueSave();
          return;
        case 'clear-board':
          if (!state.items.length) return;
          if (!window.confirm('Clear every module from this board?')) return;
          state.items = [];
          state.selectedId = null;
          renderBoard();
          queueSave();
          return;
        case 'center-selection':
          centerSelectedItem();
          return;
        case 'duplicate-selection':
          if (state.selectedId) duplicateItem(state.selectedId);
          return;
        case 'layer-up-selection':
          if (state.selectedId) {
            bringToFront(state.selectedId);
            renderBoard();
            queueSave();
          }
          return;
        case 'layer-down-selection':
          if (state.selectedId) {
            sendBackward(state.selectedId);
            renderBoard();
            queueSave();
          }
          return;
        case 'delete-selection':
          if (state.selectedId) deleteItem(state.selectedId);
          return;
        case 'replace-selected-image':
          if (state.selectedId) {
            state.pendingUploadTarget = state.selectedId;
            openUpload();
          }
          return;
        default:
          return;
      }
    }

    const deleteBtn = event.target.closest('[data-delete-item]');
    if (deleteBtn) {
      deleteItem(deleteBtn.dataset.deleteItem);
      return;
    }

    const duplicateBtn = event.target.closest('[data-duplicate-item]');
    if (duplicateBtn) {
      duplicateItem(duplicateBtn.dataset.duplicateItem);
      return;
    }

    const layerUpBtn = event.target.closest('[data-layer-up]');
    if (layerUpBtn) {
      bringToFront(layerUpBtn.dataset.layerUp);
      renderBoard();
      queueSave();
      return;
    }

    const layerDownBtn = event.target.closest('[data-layer-down]');
    if (layerDownBtn) {
      sendBackward(layerDownBtn.dataset.layerDown);
      renderBoard();
      queueSave();
      return;
    }

    const frameUploadBtn = event.target.closest('[data-frame-upload]');
    if (frameUploadBtn) {
      state.pendingUploadTarget = frameUploadBtn.dataset.frameUpload;
      openUpload();
      return;
    }

    const toggleDay = event.target.closest('[data-toggle-day]');
    if (toggleDay) {
      toggleHabitDay(toggleDay.dataset.toggleDay, toNumber(toggleDay.dataset.index, 0));
      return;
    }

    const itemNode = event.target.closest('.vs-item');
    state.selectedId = itemNode ? itemNode.dataset.itemId : null;
    if (state.selectedId) state.board.inspectorCollapsed = false;
    renderBoard();
  }

  function handleRootInput(event) {
    if (event.target === state.refs.search) {
      state.search = event.target.value || '';
      updateLibraryUi();
      return;
    }
    if (event.target === state.refs.titleInput) {
      state.board.title = (event.target.value || '').trim() || DEFAULT_TITLE;
      updateChrome();
      queueSave();
      return;
    }
    if (event.target === state.refs.zoomRange) {
      setZoom(toNumber(event.target.value, DEFAULT_ZOOM));
      queueSave();
      return;
    }
    if (event.target.matches('[data-selected-rotate]')) {
      const item = selectedItem();
      if (!item) return;
      item.rotate = clamp(toNumber(event.target.value, 0), -24, 24);
      const itemNode = state.refs.board ? state.refs.board.querySelector(`[data-item-id="${item.id}"]`) : null;
      if (itemNode) itemNode.style.setProperty('--vs-rotation', item.rotate + 'deg');
      const valueNode = event.target.parentElement?.querySelector('.vs-inspector-range-value');
      if (valueNode) valueNode.textContent = Math.round(item.rotate || 0) + 'deg';
      queueSave();
      return;
    }
    if (event.target.matches('[data-selected-lock-aspect]')) {
      const item = selectedItem();
      if (!item) return;
      item.lockAspect = !!event.target.checked;
      queueSave();
      return;
    }
    const editable = event.target.closest('[data-edit-item]');
    if (!editable) return;
    updateItemField(
      editable.dataset.editItem,
      editable.dataset.field,
      editable.innerText.trim(),
      toNumber(editable.dataset.index, 0)
    );
  }

  function handleLibraryDragStart(event) {
    const card = event.target.closest('[data-library-id]');
    if (!card || !event.dataTransfer) return;
    event.dataTransfer.effectAllowed = 'copy';
    event.dataTransfer.setData('text/vision-library-id', card.dataset.libraryId);
  }

  function handleDragOver(event) {
    event.preventDefault();
    state.refs.viewport.classList.add('is-drop-active');
  }

  function handleDragLeave(event) {
    if (!state.refs.viewport) return;
    if (event.currentTarget.contains(event.relatedTarget)) return;
    state.refs.viewport.classList.remove('is-drop-active');
  }

  async function handleDrop(event) {
    event.preventDefault();
    state.refs.viewport.classList.remove('is-drop-active');
    const files = Array.from(event.dataTransfer?.files || []).filter(file => String(file.type || '').startsWith('image/'));
    if (files.length) {
      await addImages(files, pointerPlacement(event, { w: 340, h: 420 }));
      return;
    }
    const libraryId = event.dataTransfer?.getData('text/vision-library-id');
    if (!libraryId) return;
    addItem(spawnFromLibrary(libraryId, pointerPlacement(event, { w: 340, h: 260 })));
  }

  function handleBoardPointerDown(event) {
    const resizeHandle = event.target.closest('[data-resize-handle]');
    if (resizeHandle) {
      startResize(event, resizeHandle.dataset.resizeHandle);
      return;
    }
    const dragHandle = event.target.closest('[data-drag-handle]');
    if (dragHandle) {
      startDrag(event, dragHandle.dataset.dragHandle);
    }
  }

  function handleScroll() {
    if (state.drag || state.resize) return;
    syncScrollPosition();
    queueSave();
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  function dataUrlBytes(dataUrl) {
    const base64 = String(dataUrl || '').split(',')[1] || '';
    return Math.ceil((base64.length * 3) / 4);
  }

  async function compressImage(file) {
    const dataUrl = await readFileAsDataUrl(file);
    return new Promise(resolve => {
      const image = new Image();
      image.onload = () => {
        const attempts = [
          { dim: 1800, quality: 0.9 },
          { dim: 1500, quality: 0.84 },
          { dim: 1200, quality: 0.76 },
          { dim: 900, quality: 0.68 }
        ];
        let current = dataUrl;
        for (const step of attempts) {
          const scale = Math.min(1, step.dim / Math.max(image.width, image.height));
          const canvas = document.createElement('canvas');
          canvas.width = Math.max(1, round(image.width * scale));
          canvas.height = Math.max(1, round(image.height * scale));
          const context = canvas.getContext('2d');
          if (!context) continue;
          context.drawImage(image, 0, 0, canvas.width, canvas.height);
          current = canvas.toDataURL('image/jpeg', step.quality);
          if (dataUrlBytes(current) <= OUTPUT_MAX_BYTES) break;
        }
        resolve({ src: current, ratio: image.width / Math.max(image.height, 1) });
      };
      image.onerror = () => resolve({ src: dataUrl, ratio: 1 });
      image.src = dataUrl;
    });
  }

  async function addImages(files, point) {
    const accepted = Array.from(files || []).filter(file => String(file.type || '').startsWith('image/'));
    if (!accepted.length) {
      notify('Choose an image file first.');
      return;
    }
    if (state.pendingUploadTarget) {
      const target = state.items.find(item => item.id === state.pendingUploadTarget && (item.module === 'frame' || item.module === 'photo'));
      if (target) {
        const first = accepted[0];
        if (first.size <= INPUT_MAX_BYTES) {
          const result = await compressImage(first);
          target.src = result.src;
          target.aspectRatio = result.ratio;
          if (target.module === 'photo') {
            target.h = clamp(round(target.w / Math.max(result.ratio, 0.45)), 140, BOARD_HEIGHT - target.y - BOARD_PADDING);
            target.lockAspect = true;
          }
          renderBoard();
          queueSave();
          notify(target.module === 'frame' ? 'Frame updated.' : 'Image replaced.');
        }
      }
      state.pendingUploadTarget = null;
      return;
    }
    const room = Math.max(0, MAX_ITEMS - state.items.length);
    accepted.slice(0, room).forEach(() => {});
    for (let index = 0; index < accepted.slice(0, room).length; index += 1) {
      const file = accepted[index];
      if (file.size > INPUT_MAX_BYTES) continue;
      const result = await compressImage(file);
      const width = 360;
      const height = clamp(round(width / Math.max(result.ratio, 0.6)), 220, 520);
      const itemPoint = point ? {
        x: clamp(point.x + (index * 24), BOARD_PADDING, BOARD_WIDTH - width - BOARD_PADDING),
        y: clamp(point.y + (index * 24), BOARD_PADDING, BOARD_HEIGHT - height - BOARD_PADDING)
      } : viewportPlacement({ w: width, h: height });
      state.items.push(normalizeItem({
        module: 'photo',
        variant: 'photo',
        src: result.src,
        title: file.name ? file.name.replace(/\.[^.]+$/, '') : 'Upload',
        credit: 'Your upload',
        source: 'Upload',
        x: itemPoint.x,
        y: itemPoint.y,
        w: width,
        h: height,
        lockAspect: true,
        aspectRatio: result.ratio
      }, state.items.length));
    }
    renderBoard();
    queueSave();
    notify('Image added to the board.');
  }

  function openUpload() {
    const input = state.refs.upload;
    if (!input) return;
    try {
      if (typeof input.showPicker === 'function') input.showPicker();
      else input.click();
    } catch (error) {
      input.click();
    }
  }

  async function handleUploadChange(event) {
    await addImages(event.target?.files || []);
    if (event.target) event.target.value = '';
  }

  async function handlePaste(event) {
    const page = document.getElementById('page-vision');
    if (!page || !page.classList.contains('active')) return;
    const target = event.target;
    if (target && target.closest('[contenteditable="true"],input,textarea') && !target.closest('.vs-editable')) return;
    const files = Array.from(event.clipboardData?.items || [])
      .filter(item => String(item.type || '').startsWith('image/'))
      .map(item => item.getAsFile())
      .filter(Boolean);
    if (!files.length) return;
    event.preventDefault();
    await addImages(files);
  }

  function bindRootEvents() {
    if (!state.root || state.root.dataset.rootBound === 'true') return;
    state.root.dataset.rootBound = 'true';
    state.root.addEventListener('click', handleRootClick);
    state.root.addEventListener('input', handleRootInput);
    state.root.addEventListener('dragstart', handleLibraryDragStart);
  }

  function bindMountedRefs() {
    if (state.refController) state.refController.abort();
    state.refController = new AbortController();
    const signal = state.refController.signal;
    if (!state.refs.viewport || !state.refs.board || !state.refs.upload) return;
    state.refs.viewport.addEventListener('dragover', handleDragOver, { signal });
    state.refs.viewport.addEventListener('dragleave', handleDragLeave, { signal });
    state.refs.viewport.addEventListener('drop', handleDrop, { signal });
    state.refs.viewport.addEventListener('scroll', handleScroll, { passive: true, signal });
    state.refs.board.addEventListener('pointerdown', handleBoardPointerDown, { signal });
    state.refs.upload.addEventListener('change', handleUploadChange, { signal });
  }

  function bindGlobalEvents() {
    if (state.initialized) return;
    state.initialized = true;
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    document.addEventListener('paste', handlePaste);
    window.addEventListener('resize', () => {
      if (!state.root) return;
      applyViewportMetrics();
      updateChrome();
    });
  }

  function mount() {
    const root = document.getElementById('vision-studio-root');
    if (!root) return;
    state.root = root;
    const incoming = readState();
    state.board = normalizeBoard(incoming.board);
    state.activeCategory = state.board.activeCategory || 'photos';
    state.items = incoming.items || [];
    rerenderShell();
    state.mounted = true;
    bindRootEvents();
    bindGlobalEvents();
  }

  function openBoardUpload() {
    mount();
    state.pendingUploadTarget = null;
    openUpload();
  }

  function clearBoardApi() {
    mount();
    state.items = [];
    state.selectedId = null;
    renderBoard();
    queueSave();
  }

  window.VisionStudio = { mount, openUpload: openBoardUpload, clearBoard: clearBoardApi };
  window.openVisionBoardUpload = openBoardUpload;
  window.clearVisionBoard = clearBoardApi;
  window.initVisionBoard = mount;

  document.addEventListener('DOMContentLoaded', mount);
  if (document.readyState !== 'loading') {
    setTimeout(mount, 180);
  }
})();
