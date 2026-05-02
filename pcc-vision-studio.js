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
    { id: 'uploads', label: 'Uploads', copy: 'Your own screenshots, reference images, and saved board media', icon: 'upload' },
    { id: 'photos', label: 'Photos', copy: 'Free licensed imagery for atmosphere, destination, and lifestyle direction', icon: 'photo' },
    { id: 'frames', label: 'Frames', copy: 'Editorial containers for photography, screenshots, and art direction', icon: 'frame' },
    { id: 'textures', label: 'Textures', copy: 'Paper grain, marble, linen, silk, and dimensional surface layers', icon: 'texture' },
    { id: 'paper', label: 'Paper', copy: 'Tape, torn edges, tags, cards, receipts, and analog composition pieces', icon: 'paper' },
    { id: 'labels', label: 'Labels', copy: 'Captions, date stamps, arrows, highlights, and quiet guidance marks', icon: 'tag' },
    { id: 'notes', label: 'Notes', copy: 'Direction cards, planning blocks, quotes, and reflective paper objects', icon: 'note' },
    { id: 'typography', label: 'Typography', copy: 'Headlines, pull quotes, annotations, and editorial voice', icon: 'type' },
    { id: 'templates', label: 'Templates', copy: 'Premium starter compositions for moodboards, goals, and visual worlds', icon: 'spark' },
    { id: 'backgrounds', label: 'Backgrounds', copy: 'Board surfaces and spatial moods for how the composition should feel', icon: 'palette' }
  ];

  const PHOTO_BANK = [
    {
      id: 'soft-paper',
      title: 'Soft Paper',
      copy: 'Bright texture layer',
      source: 'Pexels',
      libraryCategory: 'textures',
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
      libraryCategory: 'textures',
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
      libraryCategory: 'textures',
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
      libraryCategory: 'photos',
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
      libraryCategory: 'textures',
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
      libraryCategory: 'photos',
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
      libraryCategory: 'photos',
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
      libraryCategory: 'photos',
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
      libraryCategory: 'textures',
      thumb: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=520',
      src: 'https://images.pexels.com/photos/30903808/pexels-photo-30903808.jpeg?auto=compress&cs=tinysrgb&w=1400',
      width: 360,
      height: 420
    }
  ];

  const STATIC_LIBRARY = [
    { id: 'gallery-frame', category: 'frames', title: 'Gallery Frame', copy: 'Clean exhibition mount for hero imagery', preview: 'gallery-frame' },
    { id: 'polaroid-frame', category: 'frames', title: 'Polaroid Frame', copy: 'Soft instant-photo edge with caption space', preview: 'polaroid-frame' },
    { id: 'glass-frame', category: 'frames', title: 'Glass Frame', copy: 'Airy glass card for modern image stories', preview: 'glass-frame' },
    { id: 'torn-edge-frame', category: 'frames', title: 'Torn Edge Frame', copy: 'Organic editorial crop with a paper edge', preview: 'torn-edge-frame' },
    { id: 'film-strip-frame', category: 'frames', title: 'Film Strip', copy: 'Cinematic sequence frame for reference stills', preview: 'film-strip-frame' },
    { id: 'phone-frame', category: 'frames', title: 'Phone Screen', copy: 'A luxe device frame for screenshots and routines', preview: 'phone-frame' },
    { id: 'torn-paper-strip', category: 'paper', title: 'Torn Paper Strip', copy: 'Soft ripped edge for layering over photography', preview: 'torn-paper-strip' },
    { id: 'tape-strip', category: 'paper', title: 'Tape Strip', copy: 'Matte tape for holding a composition together', preview: 'tape-strip' },
    { id: 'receipt-slip', category: 'paper', title: 'Receipt Slip', copy: 'A narrow paper object for details or totals', preview: 'receipt-slip' },
    { id: 'gallery-card', category: 'paper', title: 'Gallery Card', copy: 'Museum label energy for intentional context', preview: 'gallery-card' },
    { id: 'postcard-edge', category: 'paper', title: 'Postcard Edge', copy: 'Travel-style card with a quiet stamp treatment', preview: 'postcard-edge' },
    { id: 'luxury-label', category: 'labels', title: 'Luxury Label', copy: 'Minimal uppercase label for naming a section', preview: 'luxury-label' },
    { id: 'date-stamp', category: 'labels', title: 'Date Stamp', copy: 'Small archival timestamp for grounding a chapter', preview: 'date-stamp' },
    { id: 'travel-tag', category: 'labels', title: 'Travel Tag', copy: 'Directional tag with room for a location or mood', preview: 'travel-tag' },
    { id: 'highlight-stroke', category: 'labels', title: 'Highlight Stroke', copy: 'Soft marker band for emphasis without noise', preview: 'highlight-stroke' },
    { id: 'minimal-arrow', category: 'labels', title: 'Minimal Arrow', copy: 'A quiet cue for sequence, motion, or attention', preview: 'minimal-arrow' },
    { id: 'cream-note', category: 'notes', title: 'Cream Note', copy: 'Warm paper note for reflection, memory, or intention', preview: 'cream-note' },
    { id: 'glass-note', category: 'notes', title: 'Black Glass Note', copy: 'Dark glass card for sharper contrast and command', preview: 'glass-note' },
    { id: 'quote-card', category: 'notes', title: 'Quote Card', copy: 'Large quote object with editorial pull-quote energy', preview: 'quote-card' },
    { id: 'checklist-card', category: 'notes', title: 'Checklist Card', copy: 'Small planning object for a concise action list', preview: 'checklist-card' },
    { id: 'goal-focus', category: 'notes', title: 'Goal Block', copy: 'A destination card with room for milestones', preview: 'goal-focus' },
    { id: 'streak-strip', category: 'notes', title: 'Habit Strip', copy: 'A compact rhythm object for consistent routines', preview: 'streak-strip' },
    { id: 'week-planner', category: 'notes', title: 'Week Planner', copy: 'A horizontal planning strip for next actions', preview: 'week-planner' },
    { id: 'affirmation-card', category: 'notes', title: 'Affirmation Card', copy: 'A reflective statement card with presence', preview: 'affirmation-card' },
    { id: 'editorial-headline', category: 'typography', title: 'Editorial Headline', copy: 'Big, cinematic, magazine-style board language', preview: 'editorial-headline' },
    { id: 'serif-quote', category: 'typography', title: 'Serif Quote', copy: 'A refined quote block with emotional weight', preview: 'serif-quote' },
    { id: 'caption-label', category: 'typography', title: 'Caption Label', copy: 'Small uppercase caption for photo and frame notes', preview: 'caption-label' },
    { id: 'handwritten-note', category: 'typography', title: 'Handwritten Note', copy: 'A looser note style for commentary and feeling', preview: 'handwritten-note' }
  ];

  const BACKGROUND_PRESETS = [
    { id: 'gallery-ivory', label: 'Gallery Ivory', copy: 'Soft editorial paper with a clean gallery feeling.', preview: 'gallery-ivory' },
    { id: 'graphite-studio', label: 'Graphite Studio', copy: 'A dark cinematic board surface with stronger contrast.', preview: 'graphite-studio' },
    { id: 'linen-stone', label: 'Linen Stone', copy: 'Muted warm texture for home, wellness, and interior boards.', preview: 'linen-stone' },
    { id: 'dusk-gradient', label: 'Dusk Gradient', copy: 'Lavender-blue light for more atmospheric moodboards.', preview: 'dusk-gradient' },
    { id: 'mocha-suite', label: 'Mocha Suite', copy: 'A rich cocoa surface for fashion, legacy, and brand boards.', preview: 'mocha-suite' },
    { id: 'midnight-glass', label: 'Midnight Glass', copy: 'A dark luxe board for cinematic, premium compositions.', preview: 'midnight-glass' }
  ];

  const TEMPLATE_LIBRARY = [
    { id: 'founder-era', title: 'Founder Era', kicker: 'Template', copy: 'A premium composition for direction, launches, offers, and a business world that feels lived in.' },
    { id: 'soft-life-blueprint', title: 'Soft Life Blueprint', kicker: 'Template', copy: 'Textures, calm photos, and breathing room for a gentler but intentional future.' },
    { id: 'dream-apartment', title: 'Dream Apartment', kicker: 'Template', copy: 'Moodboard surfaces for interiors, textures, home details, and a lived-in dream space.' },
    { id: 'passport-season', title: 'Passport Season', kicker: 'Template', copy: 'Travel references, movement, and destination framing for a board that feels like motion.' },
    { id: 'wealth-legacy', title: 'Wealth & Legacy', kicker: 'Template', copy: 'A richer arrangement for long-view goals, money direction, and expansive standards.' },
    { id: 'creative-director', title: 'Creative Director', kicker: 'Template', copy: 'A fashion-forward, editorial structure for visual direction and aesthetic leadership.' },
    { id: 'wellness-reset', title: 'Wellness Reset', kicker: 'Template', copy: 'A calmer layout for routines, nourishment, restoration, and body-centered goals.' },
    { id: 'brand-moodboard', title: 'Brand Moodboard', kicker: 'Template', copy: 'A brand-world starting point with hierarchy, captions, and polished framing.' },
    { id: 'main-character-year', title: 'Main Character Year', kicker: 'Template', copy: 'A bold visual world for identity, style, memory, and emotionally charged aspiration.' },
    { id: 'luxury-routine', title: 'Luxury Routine', kicker: 'Template', copy: 'A rhythm-focused board for schedule, rituals, beauty, and elevated daily systems.' }
  ];

  const LIBRARY_ITEMS = STATIC_LIBRARY.concat(PHOTO_BANK.map(photo => ({
    id: photo.id,
    category: photo.libraryCategory || 'photos',
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
    saveTimer: null,
    saveState: 'saved',
    history: {
      past: [],
      future: [],
      lastSerialized: '',
      restoring: false
    }
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
      case 'upload': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V5M12 5l-4 4M12 5l4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M5 16v2a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'type': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 6h14M12 6v12M8 18h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'photo': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="9" cy="10" r="2" fill="currentColor"/><path d="M7 17l4-4 3 3 3-2 3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      case 'frame': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><rect x="8" y="8" width="8" height="8" rx="2" fill="currentColor" opacity=".7"/></svg>';
      case 'texture': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7c2-1 4-1 6 0s4 1 6 0 4-1 4 0M4 12c2-1 4-1 6 0s4 1 6 0 4-1 4 0M4 17c2-1 4-1 6 0s4 1 6 0 4-1 4 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'paper': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 3h8l4 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="2" fill="none"/><path d="M15 3v4h4" stroke="currentColor" stroke-width="2" fill="none"/></svg>';
      case 'tag': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M11 3H5a2 2 0 0 0-2 2v6l9 9 9-9-9-8z" stroke="currentColor" stroke-width="2" fill="none" stroke-linejoin="round"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor"/></svg>';
      case 'note': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M8 9h8M8 13h8M8 17h5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'spark': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2l2.6 6.4L21 11l-6.4 2.6L12 20l-2.6-6.4L3 11l6.4-2.6z" fill="currentColor"/></svg>';
      case 'target': return '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="2" fill="none"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>';
      case 'habit': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12l4 4L19 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" stroke-width="2" fill="none" opacity=".5"/></svg>';
      case 'calendar': return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="5" width="18" height="16" rx="3" stroke="currentColor" stroke-width="2" fill="none"/><path d="M3 9h18" stroke="currentColor" stroke-width="2"/><path d="M8 3v4M16 3v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
      case 'quote': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 17A4.5 4.5 0 0 1 4 12.5C4 9 6.5 6.7 10 6v2c-2.3.5-3.7 2-3.7 4.1 0 .2 0 .4.1.6H10V17zm9 0A4.5 4.5 0 0 1 13 12.5c0-3.5 2.5-5.8 6-6.5v2c-2.3.5-3.7 2-3.7 4.1 0 .2 0 .4.1.6H19V17z" fill="currentColor"/></svg>';
      case 'palette': return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18h1.4a2.6 2.6 0 0 0 0-5.2H12a1.8 1.8 0 0 1 0-3.6h1.3A4.7 4.7 0 0 0 18 7.5 4.5 4.5 0 0 0 12 3z" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="7" cy="10" r="1.2" fill="currentColor"/><circle cx="10" cy="7" r="1.2" fill="currentColor"/><circle cx="14" cy="7.4" r="1.2" fill="currentColor"/><circle cx="16.5" cy="11" r="1.2" fill="currentColor"/></svg>';
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
        background: 'linen-stone',
        libraryCollapsed: false,
        inspectorCollapsed: false,
        focusMode: false
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
      background: BACKGROUND_PRESETS.some((entry) => entry.id === board?.background) ? board.background : 'linen-stone',
      libraryCollapsed: board?.libraryCollapsed === true,
      inspectorCollapsed: false,
      focusMode: board?.focusMode === true
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

  function renderLibraryPane() {
    const category = currentCategory();
    return `
      <div class="vs-library-pane-head">
        <div>
          <div class="vs-kicker">Studio Library</div>
          <h2 class="vs-title">${escapeHtml(category.label)}</h2>
          <p class="vs-subtitle">${escapeHtml(category.copy)}. Curate first, then place with intention.</p>
        </div>
        <div class="vs-pane-badge">${state.items.length} module${state.items.length === 1 ? '' : 's'}</div>
      </div>
      <label class="vs-search">
        <span class="vs-search-icon" aria-hidden="true"></span>
        <input id="vs-search" type="text" placeholder="Search textures, frames, notes..." value="${escapeHtmlAttr(state.search)}" />
      </label>
      <div class="vs-library-meta">
        <span class="vs-mini-chip">Visual bank</span>
        <span class="vs-mini-chip">Drag to place</span>
        <span class="vs-mini-chip">Layer freely</span>
      </div>
      <div class="vs-library">
        <div class="vs-library-head">
          <div class="vs-library-title">${escapeHtml(category.label)} Bank</div>
          <div class="vs-library-caption">Built for real composition, not toy decoration.</div>
        </div>
        <div class="vs-library-grid" id="vs-library-grid">${renderLibraryGrid()}</div>
      </div>
    `;
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
    if (item.module === 'frame') {
      switch (item.variant) {
        case 'gallery-frame': return 'Gallery Frame';
        case 'torn-edge-frame': return 'Torn Edge Frame';
        case 'film-strip-frame': return 'Film Strip';
        case 'phone-frame': return 'Phone Frame';
        case 'glass-frame': return 'Glass Frame';
        default: return item.title || 'Frame';
      }
    }
    if (item.module === 'goal') return item.variant === 'milestone-map' ? 'Milestone Map' : 'Goal Block';
    if (item.module === 'habit') return item.variant === 'streak-strip' ? 'Streak Strip' : 'Habit Tracker';
    if (item.module === 'calendar') return item.mode === 'month' ? 'Month Snapshot' : 'Week Planner';
    if (item.module === 'affirmation') return item.variant === 'intention-card' ? 'Intention Card' : 'Affirmation Card';
    if (item.module === 'decor') {
      switch (item.variant) {
        case 'torn-paper-strip': return 'Torn Paper Strip';
        case 'tape-strip': return 'Tape Strip';
        case 'receipt-slip': return 'Receipt Slip';
        case 'gallery-card': return 'Gallery Card';
        case 'postcard-edge': return 'Postcard Edge';
        case 'highlight-stroke': return 'Highlight Stroke';
        case 'minimal-arrow': return 'Minimal Arrow';
        default: return 'Accent';
      }
    }
    switch (item.variant) {
      case 'editorial-headline': return 'Editorial Headline';
      case 'serif-quote': return 'Serif Quote';
      case 'caption-label': return 'Caption Label';
      case 'handwritten-note': return 'Handwritten Note';
      case 'luxury-label': return 'Luxury Label';
      case 'date-stamp': return 'Date Stamp';
      case 'travel-tag': return 'Travel Tag';
      case 'cream-note': return 'Cream Note';
      case 'glass-note': return 'Black Glass Note';
      case 'quote-card': return 'Quote Card';
      case 'checklist-card': return 'Checklist Card';
      default: return 'Note Card';
    }
  }

  function itemSupportCopy(item) {
    if (!item) return 'Select something on the board to edit it with more precision.';
    switch (item.module) {
      case 'photo':
        return 'Let photography do the emotional heavy lifting. Use it for atmosphere, proof, memory, or the destination itself.';
      case 'frame':
        return 'Frames give an image more point of view. Use them when you want the board to feel art-directed instead of casually dropped in.';
      case 'goal':
        return 'Goal blocks work best when they read like direction, not pressure. Keep them short, visual, and honest.';
      case 'habit':
        return 'Habit modules are strongest as supporting rhythm, not as the loudest thing on the board.';
      case 'calendar':
        return 'Planning widgets are useful when one part of the board needs structure without flattening the mood everywhere else.';
      case 'affirmation':
        return 'The best language sounds believable in your own voice. Write something you would actually pause to read again.';
      case 'decor':
        return 'Use paper objects and accents like an art director. They should guide the eye, not shout over the work.';
      default:
        return 'Text sets the editorial voice of the board. Let it feel deliberate, restrained, and visually calm.';
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
        ${TEMPLATE_LIBRARY.map(template => `
          <button class="vs-template-card" type="button" data-template-id="${escapeHtmlAttr(template.id)}">
            <span class="vs-template-kicker">${escapeHtml(template.kicker)}</span>
            <span class="vs-template-title">${escapeHtml(template.title)}</span>
            <span class="vs-template-copy">${escapeHtml(template.copy)}</span>
          </button>
        `).join('')}
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
      { module: 'text', variant: 'editorial-headline', x: 1000, y: 210, w: 820, h: 250, title: '', body: '' },
      { module: 'text', variant: 'caption-label', x: 1060, y: 490, w: 250, h: 116, title: '', body: '' },
      { module: 'affirmation', variant: 'affirmation-card', x: 1115, y: 565, w: 520, h: 240, text: '', caption: '' },
      { module: 'frame', variant: 'gallery-frame', x: 1880, y: 210, w: 430, h: 300, title: '', caption: '', src: softPaper.src },
      { module: 'decor', variant: 'torn-paper-strip', x: 1710, y: 690, w: 410, h: 110, lockAspect: false },
      { module: 'decor', variant: 'highlight-stroke', x: 1480, y: 1000, w: 420, h: 120, lockAspect: false },
      { module: 'text', variant: 'cream-note', x: 1870, y: 560, w: 360, h: 260, title: '', body: '' }
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
      { module: 'text', variant: 'editorial-headline', x: 240, y: 760, w: 660, h: 210, title: '', body: '' },
      { module: 'affirmation', variant: 'intention-card', x: 1510, y: 620, w: 440, h: 220, text: '', caption: '' },
      { module: 'decor', variant: 'receipt-slip', x: 1790, y: 900, w: 320, h: 230, lockAspect: false },
      { module: 'text', variant: 'date-stamp', x: 240, y: 1030, w: 260, h: 110, title: '', body: '' }
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
      { module: 'text', variant: 'glass-note', x: 835, y: 250, w: 430, h: 320, title: '', body: '' },
      { module: 'affirmation', variant: 'affirmation-card', x: 820, y: 640, w: 530, h: 250, text: '', caption: '' },
      { module: 'text', variant: 'travel-tag', x: 345, y: 800, w: 260, h: 118, title: '', body: '' },
      { module: 'decor', variant: 'postcard-edge', x: 1370, y: 920, w: 360, h: 220, lockAspect: false },
      { module: 'decor', variant: 'tape-strip', x: 2020, y: 930, w: 240, h: 90, lockAspect: false }
    ];
    const living = [
      {
        module: 'photo',
        variant: 'photo',
        src: rose.src,
        title: rose.title,
        credit: 'Free image',
        source: rose.source,
        x: 220,
        y: 230,
        w: 620,
        h: 520,
        lockAspect: true,
        aspectRatio: rose.width / rose.height
      },
      { module: 'frame', variant: 'torn-edge-frame', x: 960, y: 210, w: 400, h: 460, title: '', caption: '', src: softPaper.src },
      { module: 'text', variant: 'quote-card', x: 1470, y: 250, w: 560, h: 300, title: '', body: '' },
      { module: 'text', variant: 'editorial-headline', x: 920, y: 720, w: 820, h: 200, title: '', body: '' },
      { module: 'decor', variant: 'torn-paper-strip', x: 1510, y: 940, w: 420, h: 110, lockAspect: false },
      { module: 'text', variant: 'luxury-label', x: 260, y: 820, w: 250, h: 110, title: '', body: '' }
    ];
    const travel = [
      {
        module: 'photo',
        variant: 'photo',
        src: clouds.src,
        title: clouds.title,
        credit: 'Free image',
        source: clouds.source,
        x: 220,
        y: 240,
        w: 720,
        h: 480,
        lockAspect: true,
        aspectRatio: clouds.width / clouds.height
      },
      { module: 'frame', variant: 'film-strip-frame', x: 1030, y: 240, w: 470, h: 320, title: '', caption: '', src: plant.src },
      { module: 'text', variant: 'travel-tag', x: 1030, y: 600, w: 290, h: 130, title: '', body: '' },
      { module: 'text', variant: 'editorial-headline', x: 1540, y: 260, w: 630, h: 220, title: '', body: '' },
      { module: 'text', variant: 'cream-note', x: 1520, y: 570, w: 420, h: 290, title: '', body: '' },
      { module: 'decor', variant: 'postcard-edge', x: 1760, y: 910, w: 360, h: 220, lockAspect: false }
    ];
    const seed = ['founder-era', 'wealth-legacy', 'brand-moodboard'].includes(kind)
      ? focus
      : ['soft-life-blueprint', 'wellness-reset', 'luxury-routine'].includes(kind)
        ? moodStory
        : ['dream-apartment', 'main-character-year'].includes(kind)
          ? living
          : ['passport-season'].includes(kind)
            ? travel
            : ['creative-director'].includes(kind)
              ? editorial
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
    state.board.background = ['wealth-legacy', 'creative-director'].includes(kind)
      ? 'midnight-glass'
      : ['dream-apartment', 'soft-life-blueprint', 'wellness-reset'].includes(kind)
        ? 'linen-stone'
        : ['passport-season'].includes(kind)
          ? 'dusk-gradient'
          : 'gallery-ivory';
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
            <div class="vs-kicker">Board Settings</div>
            <h3 class="vs-inspector-title">Make the board feel like a place.</h3>
            <p class="vs-inspector-copy">Use the background mood, templates, and canvas controls to shape the emotional tone before you add too much detail.</p>
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
            <div class="vs-inspector-chip-row">
              ${BACKGROUND_PRESETS.map(background => `
                <button class="vs-inspector-chip${background.id === state.board.background ? ' is-active' : ''}" type="button" data-board-background="${escapeHtmlAttr(background.id)}">${escapeHtml(background.label)}</button>
              `).join('')}
            </div>
          </section>
          <section class="vs-inspector-section">
            <div class="vs-kicker">Compositions</div>
            <h3 class="vs-inspector-title">Start with shape, not filler.</h3>
            <p class="vs-inspector-copy">Every starter is built to feel like a real board, not a demo. Replace the imagery and language with your own world.</p>
            ${renderTemplateCards()}
          </section>
          <section class="vs-inspector-section">
            <div class="vs-kicker">Direction</div>
            <div class="vs-inspector-chip-row">
              <span class="vs-inspector-chip">Soft luxury</span>
              <span class="vs-inspector-chip">Career elevation</span>
              <span class="vs-inspector-chip">Dream apartment</span>
              <span class="vs-inspector-chip">Founder era</span>
              <span class="vs-inspector-chip">Travel season</span>
            </div>
          </section>
          <section class="vs-inspector-section">
            <div class="vs-kicker">Session</div>
            <div class="vs-inspector-chip-row">
              <span class="vs-inspector-chip">${zoomLabel()} zoom</span>
              <span class="vs-inspector-chip">${state.snapEnabled ? 'Snap enabled' : 'Free placement'}</span>
              <span class="vs-inspector-chip">${counts.words} text layer${counts.words === 1 ? '' : 's'}</span>
              <span class="vs-inspector-chip">${state.board.focusMode ? 'Focus mode on' : 'Edit mode on'}</span>
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
            <span class="vs-inspector-field-label">Opacity</span>
            <div class="vs-inspector-range-row">
              <input type="range" min="0.15" max="1" step="0.01" value="${Number(item.opacity || 1).toFixed(2)}" data-selected-opacity="true" />
              <span class="vs-inspector-range-value">${Math.round((item.opacity || 1) * 100)}%</span>
            </div>
          </label>
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
          <label class="vs-inspector-check">
            <input type="checkbox" data-selected-locked="true"${item.locked ? ' checked' : ''} />
            <span>Lock module on the board</span>
          </label>
          <div class="vs-inspector-actions">
            <button class="vs-inspector-btn" type="button" data-action="center-selection">Center</button>
            <button class="vs-inspector-btn" type="button" data-action="duplicate-selection">Duplicate</button>
            <button class="vs-inspector-btn" type="button" data-action="layer-up-selection">Bring forward</button>
            <button class="vs-inspector-btn" type="button" data-action="layer-down-selection">Send back</button>
            <button class="vs-inspector-btn" type="button" data-action="toggle-lock-selection">${item.locked ? 'Unlock' : 'Lock'}</button>
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
      case 'ribbon': return 'torn-paper-strip';
      case 'flutter':
      case 'butterfly': return 'minimal-arrow';
      case 'crown': return 'gallery-card';
      case 'bloom':
      case 'blossom': return 'highlight-stroke';
      case 'spark':
      case 'burst':
      case 'starburst': return 'gallery-card';
      default: return 'tape-strip';
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
      aspectRatio: toNumber(item.aspectRatio, toNumber(item.w || item.width, 320) / Math.max(toNumber(item.h || item.height, 220), 1)),
      opacity: clamp(toNumber(item.opacity, 1), 0.15, 1),
      locked: item.locked === true
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
        background: state.board.background,
        libraryCollapsed: !!state.board.libraryCollapsed,
        inspectorCollapsed: !!state.board.inspectorCollapsed,
        focusMode: !!state.board.focusMode
      },
      items: state.items.map(item => JSON.parse(JSON.stringify(item)))
    };
  }

  function queueSave() {
    if (state.saveTimer) clearTimeout(state.saveTimer);
    state.saveState = 'saving';
    updateChrome();
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
      commitHistory();
      state.saveState = 'saved';
      updateChrome();
    }, SAVE_DELAY);
  }

  function snapshotString() {
    return JSON.stringify(savePayload());
  }

  function initializeHistory() {
    state.history.past = [];
    state.history.future = [];
    state.history.lastSerialized = snapshotString();
    state.history.restoring = false;
  }

  function commitHistory() {
    if (state.history.restoring) return;
    const next = snapshotString();
    if (!next || next === state.history.lastSerialized) return;
    if (state.history.lastSerialized) {
      state.history.past.push(state.history.lastSerialized);
      if (state.history.past.length > 40) state.history.past.shift();
    }
    state.history.lastSerialized = next;
    state.history.future = [];
  }

  function persistSnapshot(raw) {
    try {
      localStorage.setItem(STORAGE_KEY, raw);
    } catch (error) {}
    if (typeof window.syncToCloud === 'function') {
      try {
        window.syncToCloud('vision-board', JSON.parse(raw));
      } catch (error) {}
    }
  }

  function applySnapshotString(raw) {
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      state.history.restoring = true;
      state.board = normalizeBoard(parsed.board);
      state.activeCategory = state.board.activeCategory || 'photos';
      state.items = Array.isArray(parsed.items) ? parsed.items.map(normalizeItem).filter(Boolean) : [];
      state.selectedId = null;
      rerenderShell();
      state.history.restoring = false;
    } catch (error) {
      state.history.restoring = false;
    }
  }

  function undoHistory() {
    const previous = state.history.past.pop();
    if (!previous) return;
    state.history.future.push(snapshotString());
    applySnapshotString(previous);
    state.history.lastSerialized = previous;
    persistSnapshot(previous);
    state.saveState = 'saved';
    updateChrome();
  }

  function redoHistory() {
    const next = state.history.future.pop();
    if (!next) return;
    state.history.past.push(snapshotString());
    applySnapshotString(next);
    state.history.lastSerialized = next;
    persistSnapshot(next);
    state.saveState = 'saved';
    updateChrome();
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
      case 'editorial-headline':
        return normalizeItem({ module: 'text', variant: 'editorial-headline', x: basePoint.x, y: basePoint.y, w: 560, h: 220, title: '', body: '' }, state.items.length);
      case 'serif-quote':
        return normalizeItem({ module: 'text', variant: 'serif-quote', x: basePoint.x, y: basePoint.y, w: 420, h: 250, title: '', body: '' }, state.items.length);
      case 'caption-label':
        return normalizeItem({ module: 'text', variant: 'caption-label', x: basePoint.x, y: basePoint.y, w: 250, h: 110, title: '', body: '' }, state.items.length);
      case 'handwritten-note':
        return normalizeItem({ module: 'text', variant: 'handwritten-note', x: basePoint.x, y: basePoint.y, w: 340, h: 220, title: '', body: '' }, state.items.length);
      case 'cream-note':
        return normalizeItem({ module: 'text', variant: 'cream-note', x: basePoint.x, y: basePoint.y, w: 360, h: 280, title: '', body: '' }, state.items.length);
      case 'glass-note':
        return normalizeItem({ module: 'text', variant: 'glass-note', x: basePoint.x, y: basePoint.y, w: 360, h: 280, title: '', body: '' }, state.items.length);
      case 'quote-card':
        return normalizeItem({ module: 'text', variant: 'quote-card', x: basePoint.x, y: basePoint.y, w: 420, h: 260, title: '', body: '' }, state.items.length);
      case 'checklist-card':
        return normalizeItem({ module: 'text', variant: 'checklist-card', x: basePoint.x, y: basePoint.y, w: 340, h: 250, title: '', body: '' }, state.items.length);
      case 'luxury-label':
        return normalizeItem({ module: 'text', variant: 'luxury-label', x: basePoint.x, y: basePoint.y, w: 260, h: 118, title: '', body: '' }, state.items.length);
      case 'date-stamp':
        return normalizeItem({ module: 'text', variant: 'date-stamp', x: basePoint.x, y: basePoint.y, w: 260, h: 118, title: '', body: '' }, state.items.length);
      case 'travel-tag':
        return normalizeItem({ module: 'text', variant: 'travel-tag', x: basePoint.x, y: basePoint.y, w: 280, h: 130, title: '', body: '' }, state.items.length);
      case 'gallery-frame':
        return normalizeItem({ module: 'frame', variant: 'gallery-frame', x: basePoint.x, y: basePoint.y, w: 360, h: 300, title: '', caption: '' }, state.items.length);
      case 'polaroid-frame':
        return normalizeItem({ module: 'frame', variant: 'polaroid-frame', x: basePoint.x, y: basePoint.y, w: 320, h: 400, title: '', caption: '' }, state.items.length);
      case 'glass-frame':
        return normalizeItem({ module: 'frame', variant: 'glass-frame', x: basePoint.x, y: basePoint.y, w: 360, h: 280, title: '', caption: '' }, state.items.length);
      case 'torn-edge-frame':
        return normalizeItem({ module: 'frame', variant: 'torn-edge-frame', x: basePoint.x, y: basePoint.y, w: 360, h: 420, title: '', caption: '' }, state.items.length);
      case 'film-strip-frame':
        return normalizeItem({ module: 'frame', variant: 'film-strip-frame', x: basePoint.x, y: basePoint.y, w: 520, h: 300, title: '', caption: '' }, state.items.length);
      case 'phone-frame':
        return normalizeItem({ module: 'frame', variant: 'phone-frame', x: basePoint.x, y: basePoint.y, w: 270, h: 540, title: '', caption: '' }, state.items.length);
      case 'goal-focus':
        return normalizeItem({ module: 'goal', variant: 'goal-focus', x: basePoint.x, y: basePoint.y, w: 360, h: 308, title: '', focus: '', steps: ['', '', ''] }, state.items.length);
      case 'milestone-map':
        return normalizeItem({ module: 'goal', variant: 'milestone-map', x: basePoint.x, y: basePoint.y, w: 390, h: 320, title: '', focus: '', steps: ['', '', ''] }, state.items.length);
      case 'streak-strip':
        return normalizeItem({ module: 'habit', variant: 'streak-strip', x: basePoint.x, y: basePoint.y, w: 420, h: 150, title: '', mode: 'strip', days: [false, false, false, false, false, false, false] }, state.items.length);
      case 'week-planner':
        return normalizeItem({ module: 'calendar', variant: 'week-planner', x: basePoint.x, y: basePoint.y, w: 540, h: 260, title: '', mode: 'week', week: weekNotes() }, state.items.length);
      case 'affirmation-card':
        return normalizeItem({ module: 'affirmation', variant: 'affirmation-card', x: basePoint.x, y: basePoint.y, w: 420, h: 250, text: '', caption: '' }, state.items.length);
      case 'torn-paper-strip':
        return normalizeItem({ module: 'decor', variant: 'torn-paper-strip', x: basePoint.x, y: basePoint.y, w: 420, h: 110, lockAspect: false }, state.items.length);
      case 'tape-strip':
        return normalizeItem({ module: 'decor', variant: 'tape-strip', x: basePoint.x, y: basePoint.y, w: 240, h: 92, lockAspect: false }, state.items.length);
      case 'receipt-slip':
        return normalizeItem({ module: 'decor', variant: 'receipt-slip', x: basePoint.x, y: basePoint.y, w: 240, h: 320, lockAspect: false }, state.items.length);
      case 'gallery-card':
        return normalizeItem({ module: 'decor', variant: 'gallery-card', x: basePoint.x, y: basePoint.y, w: 320, h: 180, lockAspect: false }, state.items.length);
      case 'postcard-edge':
        return normalizeItem({ module: 'decor', variant: 'postcard-edge', x: basePoint.x, y: basePoint.y, w: 340, h: 220, lockAspect: false }, state.items.length);
      case 'highlight-stroke':
        return normalizeItem({ module: 'decor', variant: 'highlight-stroke', x: basePoint.x, y: basePoint.y, w: 340, h: 90, lockAspect: false }, state.items.length);
      case 'minimal-arrow':
        return normalizeItem({ module: 'decor', variant: 'minimal-arrow', x: basePoint.x, y: basePoint.y, w: 220, h: 110, lockAspect: false }, state.items.length);
      default:
        return normalizeItem({ module: 'decor', variant: libraryId, x: basePoint.x, y: basePoint.y, w: 230, h: 180, lockAspect: true }, state.items.length);
    }
  }

  function renderCategoryButtons() {
    return CATEGORY_DEFS.map(category => `
      <button class="vs-category-btn${category.id === state.activeCategory ? ' is-active' : ''}" type="button" data-category="${escapeHtmlAttr(category.id)}" title="${escapeHtmlAttr(category.label)}" aria-pressed="${category.id === state.activeCategory ? 'true' : 'false'}">
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

  function uploadedLibraryItems() {
    return state.items
      .filter(item => item.module === 'photo' && item.src && (item.source === 'Upload' || item.credit === 'Your upload'))
      .slice()
      .sort((a, b) => (b.z || 0) - (a.z || 0))
      .slice(0, 12)
      .map(item => ({
        id: item.id,
        title: item.title || 'Upload',
        src: item.src,
        copy: 'Reuse this image on the board again.',
        source: 'Upload'
      }));
  }

  function renderUploadsGrid() {
    const uploads = uploadedLibraryItems();
    const query = state.search.trim().toLowerCase();
    const visible = uploads.filter(item => !query || [item.title, item.copy].join(' ').toLowerCase().includes(query));
    return `
      <button class="vs-library-card vs-library-upload-card" type="button" data-action="upload-board-photo">
        <div class="vs-library-preview preview-upload-hero">
          <span class="vs-mini-label">Bring in media</span>
        </div>
        <span class="vs-library-body">
          <span class="vs-library-overline">Uploads</span>
          <span class="vs-library-label">Add images from your device</span>
          <span class="vs-library-copy">Drop in photos, screenshots, interiors, itineraries, and references that make the board feel lived in.</span>
        </span>
      </button>
      ${visible.length ? visible.map(item => `
        <button class="vs-library-card is-photo" type="button" data-upload-reuse="${escapeHtmlAttr(item.id)}">
          <div class="vs-library-preview photo">
            <img src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.title)}" loading="lazy" />
            <span class="vs-mini-label">Saved upload</span>
          </div>
          <span class="vs-library-body">
            <span class="vs-library-overline">Uploads</span>
            <span class="vs-library-label">${escapeHtml(item.title)}</span>
            <span class="vs-library-copy">${escapeHtml(item.copy)}</span>
          </span>
        </button>
      `).join('') : `
        <div class="vs-library-empty">
          <div class="vs-library-empty-title">No uploads yet</div>
          <div class="vs-library-empty-copy">Start with your own imagery first. It instantly makes the board feel more real.</div>
        </div>
      `}
    `;
  }

  function renderTemplateLibrary() {
    const query = state.search.trim().toLowerCase();
    const visible = TEMPLATE_LIBRARY.filter(item => !query || [item.title, item.copy].join(' ').toLowerCase().includes(query));
    return `
      <div class="vs-template-grid">
        ${visible.map(template => `
          <button class="vs-template-card" type="button" data-template-id="${escapeHtmlAttr(template.id)}">
            <span class="vs-template-kicker">${escapeHtml(template.kicker)}</span>
            <span class="vs-template-title">${escapeHtml(template.title)}</span>
            <span class="vs-template-copy">${escapeHtml(template.copy)}</span>
          </button>
        `).join('')}
      </div>
    `;
  }

  function renderBackgroundLibrary() {
    const query = state.search.trim().toLowerCase();
    const visible = BACKGROUND_PRESETS.filter(item => !query || [item.label, item.copy].join(' ').toLowerCase().includes(query));
    return visible.map(background => `
      <button class="vs-library-card vs-background-card${background.id === state.board.background ? ' is-active' : ''}" type="button" data-board-background="${escapeHtmlAttr(background.id)}">
        <div class="vs-library-preview preview-${escapeHtmlAttr(background.preview)}">
          <span class="vs-mini-label">Board mood</span>
        </div>
        <span class="vs-library-body">
          <span class="vs-library-overline">Background</span>
          <span class="vs-library-label">${escapeHtml(background.label)}</span>
          <span class="vs-library-copy">${escapeHtml(background.copy)}</span>
        </span>
      </button>
    `).join('');
  }

  function renderLibraryGrid() {
    if (state.activeCategory === 'uploads') return renderUploadsGrid();
    if (state.activeCategory === 'templates') return renderTemplateLibrary();
    if (state.activeCategory === 'backgrounds') return renderBackgroundLibrary();
    const items = visibleLibraryItems();
    if (!items.length) {
      return '<div class="vs-empty-copy">No modules match this search yet.</div>';
    }
    return items.map(item => `
      <button class="vs-library-card${item.preview === 'photo' ? ' is-photo' : ' is-module'}" type="button" draggable="true" data-library-id="${escapeHtmlAttr(item.id)}">
        ${renderLibraryPreview(item)}
        <span class="vs-library-body">
          <span class="vs-library-overline">${escapeHtml(item.category.replace('-', ' '))}</span>
          <span class="vs-library-label">${escapeHtml(item.title)}</span>
          <span class="vs-library-copy">${escapeHtml(item.copy)}</span>
        </span>
      </button>
    `).join('');
  }

  function saveStatusLabel() {
    if (state.saveState === 'saving') return 'Saving…';
    return 'Saved';
  }

  function renderSelectionToolbar() {
    const item = selectedItem();
    if (!item) return '';
    return `
      <div class="vs-floating-toolbar-inner">
        <div class="vs-floating-meta">
          <span class="vs-floating-kicker">Selected</span>
          <strong>${escapeHtml(itemLabel(item))}</strong>
        </div>
        <div class="vs-floating-actions">
          <button class="vs-floating-btn" type="button" data-action="duplicate-selection">Duplicate</button>
          <button class="vs-floating-btn" type="button" data-action="layer-up-selection">Forward</button>
          <button class="vs-floating-btn" type="button" data-action="layer-down-selection">Backward</button>
          <button class="vs-floating-btn" type="button" data-action="toggle-lock-selection">${item.locked ? 'Unlock' : 'Lock'}</button>
          <button class="vs-floating-btn danger" type="button" data-action="delete-selection">Delete</button>
        </div>
      </div>
    `;
  }

  function boardShell() {
    const libraryLabel = state.board.libraryCollapsed ? 'Open Library' : 'Hide Library';
    const inspectorLabel = state.board.inspectorCollapsed ? 'Open Inspector' : 'Hide Inspector';
    const focusLabel = state.board.focusMode ? 'Exit Focus' : 'Focus Preview';
    return `
      <section class="vs-editor">
        <header class="vs-appbar">
          <div class="vs-appbar-left">
            <div class="vs-brand-mark">P</div>
            <div class="vs-brand-copy">
              <div class="vs-brand-kicker">Command Center</div>
              <div class="vs-brand-name">Vision Studio</div>
            </div>
          </div>
          <div class="vs-appbar-center">
            <input id="vs-board-title" class="vs-board-title-input" type="text" value="${escapeHtmlAttr(state.board.title || DEFAULT_TITLE)}" placeholder="Untitled vision board" />
            <div class="vs-board-title-sub">Build the world you are moving toward.</div>
          </div>
          <div class="vs-appbar-actions">
            <div class="vs-save-pill" id="vs-save-pill">${saveStatusLabel()}</div>
            <button class="vs-top-btn" type="button" data-action="undo-history">Undo</button>
            <button class="vs-top-btn" type="button" data-action="redo-history">Redo</button>
            <button class="vs-top-btn" type="button" data-action="toggle-library">${libraryLabel}</button>
            <button class="vs-top-btn" type="button" data-action="toggle-inspector">${inspectorLabel}</button>
            <button class="vs-top-btn" type="button" data-action="toggle-focus">${focusLabel}</button>
            <button class="vs-top-btn primary" type="button" data-action="upload-board-photo">Upload</button>
            <button class="vs-top-btn" type="button" data-action="toggle-snap">${state.snapEnabled ? 'Snap On' : 'Snap Off'}</button>
            <input id="vs-upload-input" type="file" accept="image/*" multiple hidden />
          </div>
        </header>
        <div class="vs-editor-body">
          <aside class="vs-rail">
            <div class="vs-rail-stack" id="vs-category-grid">${renderCategoryButtons()}</div>
          </aside>
          <aside class="vs-library-pane" id="vs-library-pane">${renderLibraryPane()}</aside>
          <div class="vs-stage-shell">
            <div class="vs-stage-topbar">
              <div class="vs-stage-pill">Canvas Studio</div>
              <div class="vs-stage-copy">Start with a photo, a label, a paper object, or a feeling. Let the composition come together in layers.</div>
              <button class="vs-stage-btn" type="button" data-action="reset-view">Reset View</button>
            </div>
            <div class="vs-stage">
              <div class="vs-stage-quickdock">
                <button class="vs-quickdock-btn" type="button" data-action="upload-board-photo">Add Image</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-headline">Add Text</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-note">Add Note</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-frame">Add Frame</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-goal">Add Goal</button>
                <button class="vs-quickdock-btn" type="button" data-action="quick-affirmation">Add Quote</button>
              </div>
              <div class="vs-viewport-shell">
                <div class="vs-viewport" id="vs-viewport">
                  <div class="vs-board-scale" id="vs-board-scale">
                    <div class="vs-board" id="vs-board"></div>
                  </div>
                </div>
              </div>
              <div class="vs-floating-toolbar" id="vs-floating-toolbar">${renderSelectionToolbar()}</div>
            </div>
            <div class="vs-stage-footer">
              <div class="vs-stage-footer-copy">
                <strong>${escapeHtml(state.board.title || DEFAULT_TITLE)}</strong>
                <span>Curate the mood. Frame the vision. Let the canvas stay in charge.</span>
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
      case 'torn-paper-strip':
        return '<svg viewBox="0 0 260 90" aria-hidden="true"><path d="M14 27c23 6 42 7 58 4 17-4 34-4 52 0 18 5 38 6 61 2 23-4 41-2 61 8v37c-23-7-42-8-59-3-18 4-38 4-59-1-20-5-39-5-56 1-18 6-36 6-58-1z" fill="#fff9ee"/><path d="M13 27c24 4 43 5 58 2 18-4 36-4 54 0 19 4 39 5 60 1 18-3 38-1 61 8" stroke="#ecdcc0" stroke-width="2" fill="none"/></svg>';
      case 'tape-strip':
        return '<svg viewBox="0 0 200 90" aria-hidden="true"><rect x="22" y="22" width="156" height="46" rx="14" fill="rgba(255,244,216,0.86)" stroke="rgba(221,201,156,0.8)" stroke-width="2"/><path d="M38 32h124" stroke="rgba(255,255,255,0.42)" stroke-width="4" stroke-linecap="round"/></svg>';
      case 'receipt-slip':
        return '<svg viewBox="0 0 160 280" aria-hidden="true"><path d="M18 18h124v228l-13-9-13 9-13-9-13 9-13-9-13 9-13-9-13 9z" fill="#fffaf1" stroke="#eadcc0" stroke-width="2"/><path d="M40 54h82M40 82h62M40 116h82M40 144h62M40 178h82" stroke="#c9ba98" stroke-width="6" stroke-linecap="round" opacity=".62"/></svg>';
      case 'gallery-card':
        return '<svg viewBox="0 0 220 140" aria-hidden="true"><rect x="16" y="18" width="188" height="104" rx="24" fill="#f4efe5"/><path d="M34 42h88" stroke="#1e2d55" stroke-width="8" stroke-linecap="round"/><path d="M34 68h148M34 92h112" stroke="#88795f" stroke-width="4" stroke-linecap="round" opacity=".72"/></svg>';
      case 'postcard-edge':
        return '<svg viewBox="0 0 220 150" aria-hidden="true"><rect x="20" y="20" width="180" height="110" rx="20" fill="#f7f1e8"/><path d="M40 44h72M40 66h92" stroke="#65543a" stroke-width="5" stroke-linecap="round"/><rect x="152" y="38" width="24" height="24" rx="6" fill="#d1b899"/><path d="M34 102h150" stroke="#cfb895" stroke-width="3" stroke-linecap="round"/></svg>';
      case 'highlight-stroke':
        return '<svg viewBox="0 0 240 70" aria-hidden="true"><path d="M22 35c38-8 66-11 91-11 37 0 73 4 105 10-32 8-68 12-105 12-24 0-55-4-91-11z" fill="rgba(255,225,141,0.64)"/></svg>';
      case 'minimal-arrow':
        return '<svg viewBox="0 0 180 80" aria-hidden="true"><path d="M18 40h112" stroke="#283b79" stroke-width="5" stroke-linecap="round"/><path d="M110 24l28 16-28 16" fill="none" stroke="#283b79" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      default:
        return '<svg viewBox="0 0 220 180" aria-hidden="true"><circle cx="110" cy="90" r="70" fill="#d7e7ff"/></svg>';
    }
  }

  function renderEmptyState() {
    return `
      <div class="vs-empty">
        <div class="vs-empty-inner">
          <div class="vs-empty-mark">Vision Studio</div>
          <div class="vs-empty-title">Start building your world.</div>
          <div class="vs-empty-copy">Drop in images, textures, paper, notes, and language to create a board that feels like your next chapter instead of a blank assignment.</div>
          <div class="vs-empty-actions">
            <button class="vs-empty-btn primary" type="button" data-template-id="creative-director">Start from Template</button>
            <button class="vs-empty-btn" type="button" data-action="upload-board-photo">Upload Image</button>
            <button class="vs-empty-btn" type="button" data-action="quick-headline">Add Text</button>
            <button class="vs-empty-btn" type="button" data-category="backgrounds">Choose Board Style</button>
          </div>
        </div>
      </div>
    `;
  }

  function itemToolbar(item, label) {
    return `
      <div class="vs-item-toolbar">
        <div class="vs-item-badge">${escapeHtml(label)}${item.locked ? ' / Locked' : ''}</div>
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

  function editableFlag(item) {
    return item.locked ? 'false' : 'true';
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
    const variantClass = item.variant === 'polaroid-frame'
      ? 'polaroid'
      : item.variant === 'glass-frame'
        ? 'glass'
        : item.variant === 'torn-edge-frame'
          ? 'torn'
          : item.variant === 'film-strip-frame'
            ? 'film'
            : item.variant === 'phone-frame'
              ? 'phone'
              : 'gallery';
    return `
      <div class="vs-item-shell vs-module-frame">
        ${itemToolbar(item, 'Frame')}
        <div class="vs-content">
          <div class="vs-frame-shell ${variantClass}">
            <div class="vs-frame-inner">
              ${item.src
                ? `<img class="vs-frame-image" src="${escapeHtmlAttr(item.src)}" alt="${escapeHtmlAttr(item.title || 'Framed image')}" />`
                : `<button class="vs-frame-placeholder" type="button" data-frame-upload="${escapeHtmlAttr(item.id)}"${item.locked ? ' disabled' : ''}><span><span class="vs-frame-placeholder-title">Add image</span><span class="vs-frame-placeholder-copy">Upload a photo into this frame.</span></span></button>`
              }
            </div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderText(item) {
    if (item.variant === 'editorial-headline' || item.variant === 'headline') {
      return `
        <div class="vs-item-shell vs-module-headline">
          ${itemToolbar(item, 'Headline')}
          <div class="vs-content">
            <div class="vs-editable vs-headline-text" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add a headline">${escapeHtml(item.title || '')}</div>
            <div class="vs-editable vs-headline-sub" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Optional subline">${escapeHtml(item.body || '')}</div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'serif-quote') {
      return `
        <div class="vs-item-shell vs-module-affirmation">
          ${itemToolbar(item, 'Quote')}
          <div class="vs-content">
            <div class="vs-affirmation-surface is-quote">
              <div class="vs-editable vs-affirmation-text" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add a quote or statement">${escapeHtml(item.title || '')}</div>
              <div class="vs-editable vs-affirmation-caption" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Optional source or note">${escapeHtml(item.body || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'caption-label' || item.variant === 'micro-label' || item.variant === 'luxury-label' || item.variant === 'date-stamp' || item.variant === 'travel-tag') {
      const labelClass = item.variant === 'travel-tag'
        ? 'is-tag'
        : item.variant === 'date-stamp'
          ? 'is-stamp'
          : item.variant === 'luxury-label'
            ? 'is-luxury'
            : 'is-caption';
      return `
        <div class="vs-item-shell vs-module-text vs-module-label ${labelClass}">
          ${itemToolbar(item, 'Label')}
          <div class="vs-content">
            <div class="vs-note-surface">
              <div class="vs-editable vs-note-body" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add label">${escapeHtml(item.title || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'checklist-card') {
      return `
        <div class="vs-item-shell vs-module-note">
          ${itemToolbar(item, 'Checklist')}
          <div class="vs-content">
            <div class="vs-note-surface is-checklist">
              <div class="vs-note-title">Action List</div>
              <div class="vs-editable vs-note-body" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="List the next three things that matter.">${escapeHtml(item.body || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'quote-card') {
      return `
        <div class="vs-item-shell vs-module-note">
          ${itemToolbar(item, 'Quote Card')}
          <div class="vs-content">
            <div class="vs-note-surface is-quote-card">
              <div class="vs-editable vs-headline-text" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Add a quote that moves something in you.">${escapeHtml(item.title || '')}</div>
              <div class="vs-editable vs-headline-sub" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Optional context">${escapeHtml(item.body || '')}</div>
            </div>
          </div>
          <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
        </div>
      `;
    }
    if (item.variant === 'handwritten-note') {
      return `
        <div class="vs-item-shell vs-module-note">
          ${itemToolbar(item, 'Annotation')}
          <div class="vs-content">
            <div class="vs-note-surface is-handwritten">
              <div class="vs-editable vs-note-body" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Add a handwritten-style thought.">${escapeHtml(item.body || '')}</div>
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
          <div class="vs-note-surface${item.variant === 'glass-note' ? ' is-glass' : (item.variant === 'cream-note' || item.variant === 'note-card') ? ' is-cream' : ''}">
            <div class="vs-note-title">${item.variant === 'glass-note' ? 'Direction' : item.variant === 'note-card' ? 'Note Card' : 'Notes'}</div>
            <div class="vs-editable vs-note-body" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="body" data-placeholder="Write something real, useful, or motivating.">${escapeHtml(item.body || '')}</div>
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
            <div class="vs-editable vs-goal-title" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Goal title">${escapeHtml(item.title || '')}</div>
            <div class="vs-editable vs-goal-focus" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="focus" data-placeholder="What are you moving toward?">${escapeHtml(item.focus || '')}</div>
            <div class="vs-goal-list">
              ${item.steps.map((step, index) => `
                <div class="vs-goal-row">
                  <span class="vs-goal-dot"></span>
                  <div class="vs-editable vs-goal-step" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="steps" data-index="${index}" data-placeholder="Milestone ${index + 1}">${escapeHtml(step || '')}</div>
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
            <div class="vs-editable vs-habit-title" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Habit title">${escapeHtml(item.title || '')}</div>
            <div class="vs-habit-track">
              ${item.days.map((done, index) => `
                <div class="vs-habit-day">
                  <span class="vs-habit-day-label">${['M','T','W','T','F','S','S'][index]}</span>
                  <button class="vs-habit-toggle${done ? ' is-done' : ''}" type="button" data-toggle-day="${escapeHtmlAttr(item.id)}" data-index="${index}"${item.locked ? ' disabled' : ''}></button>
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
              <div class="vs-editable vs-calendar-title" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Month snapshot">${escapeHtml(item.title || '')}</div>
              <div class="vs-calendar-grid">
                ${['S','M','T','W','T','F','S'].map(day => `<div class="vs-calendar-head">${day}</div>`).join('')}
                ${item.cells.map(cell => `
                  <div class="vs-calendar-cell">
                    <span class="vs-calendar-date">${escapeHtml(cell.day || '')}</span>
                    <span class="vs-calendar-note">${escapeHtml(cell.note || '')}</span>
                  </div>
                `).join('')}
              </div>
              <div class="vs-editable vs-goal-focus" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="footer" data-placeholder="Add one focus for this month.">${escapeHtml(item.footer || '')}</div>
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
            <div class="vs-editable vs-calendar-title" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="title" data-placeholder="Week planner">${escapeHtml(item.title || '')}</div>
            <div class="vs-calendar-grid">
              ${item.week.map((day, index) => `
                <div class="vs-calendar-cell">
                  <div class="vs-calendar-head">${escapeHtml(day.label || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][index])}</div>
                  <div class="vs-editable vs-calendar-note" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="week" data-index="${index}" data-placeholder="Plan">${escapeHtml(day.note || '')}</div>
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
            <div class="vs-editable vs-affirmation-text" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="text" data-placeholder="Write an affirmation that feels true when you read it.">${escapeHtml(item.text || '')}</div>
            <div class="vs-editable vs-affirmation-caption" contenteditable="${editableFlag(item)}" spellcheck="true" data-edit-item="${escapeHtmlAttr(item.id)}" data-field="caption" data-placeholder="Optional caption">${escapeHtml(item.caption || '')}</div>
          </div>
        </div>
        <div class="vs-resize-handle" data-resize-handle="${escapeHtmlAttr(item.id)}"></div>
      </div>
    `;
  }

  function renderDecor(item) {
    return `
      <div class="vs-item-shell vs-module-decor">
        ${itemToolbar(item, itemLabel(item))}
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
    if (item.locked) classes.push('is-locked');
    const style = `left:${item.x}px;top:${item.y}px;width:${item.w}px;height:${item.h}px;z-index:${item.z};--vs-rotation:${item.rotate}deg;opacity:${item.opacity || 1};`;
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
    node.style.opacity = String(item.opacity || 1);
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
    state.root.dataset.boardBackground = state.board.background || 'gallery-ivory';
    state.root.dataset.focusMode = state.board.focusMode ? 'true' : 'false';
    const libraryToggle = state.root.querySelector('[data-action="toggle-library"]');
    const inspectorToggle = state.root.querySelector('[data-action="toggle-inspector"]');
    const focusToggle = state.root.querySelector('[data-action="toggle-focus"]');
    if (libraryToggle) libraryToggle.textContent = state.board.libraryCollapsed ? 'Open Library' : 'Hide Library';
    if (inspectorToggle) inspectorToggle.textContent = state.board.inspectorCollapsed ? 'Open Inspector' : 'Hide Inspector';
    if (focusToggle) focusToggle.textContent = state.board.focusMode ? 'Exit Focus' : 'Focus Preview';
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
    if (state.refs.savePill) state.refs.savePill.textContent = saveStatusLabel();
    if (state.refs.floatingToolbar) state.refs.floatingToolbar.innerHTML = renderSelectionToolbar();
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
      libraryPane: state.root.querySelector('#vs-library-pane'),
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
      guideLayer: state.root.querySelector('.vs-guides'),
      savePill: state.root.querySelector('#vs-save-pill'),
      floatingToolbar: state.root.querySelector('#vs-floating-toolbar')
    };
  }

  function updateCategoryUi() {
    if (!state.refs.categoryGrid) return;
    state.refs.categoryGrid.innerHTML = renderCategoryButtons();
  }

  function updateLibraryUi() {
    if (!state.refs.libraryPane) return;
    state.refs.libraryPane.innerHTML = renderLibraryPane();
    state.refs.libraryGrid = state.root.querySelector('#vs-library-grid');
    state.refs.search = state.root.querySelector('#vs-search');
    state.refs.paneBadge = state.root.querySelector('.vs-pane-badge');
    if (state.refs.libraryGrid) {
      state.refs.libraryGrid.className = 'vs-library-grid is-' + state.activeCategory;
      state.refs.libraryGrid.scrollTop = 0;
    }
  }

  function restoreScroll() {
    if (!state.refs.viewport) return;
    state.refs.viewport.scrollLeft = state.board.scrollLeft;
    state.refs.viewport.scrollTop = state.board.scrollTop;
    ensureVisibleBoardContent();
    updateChrome();
  }

  function ensureVisibleBoardContent() {
    const viewport = state.refs.viewport;
    if (!viewport || !state.items.length) return;
    if (state.selectedId) {
      revealItemInViewport(state.selectedId, { ifNeeded: true, padding: 60 });
      return;
    }
    const zoom = state.board.zoom || DEFAULT_ZOOM;
    const left = viewport.scrollLeft / zoom;
    const top = viewport.scrollTop / zoom;
    const right = left + (viewport.clientWidth / zoom);
    const bottom = top + (viewport.clientHeight / zoom);
    const hasVisibleItem = state.items.some((item) => {
      const itemRight = item.x + item.w;
      const itemBottom = item.y + item.h;
      return itemRight >= left && item.x <= right && itemBottom >= top && item.y <= bottom;
    });
    if (hasVisibleItem) return;

    const bounds = state.items.reduce((acc, item) => {
      acc.left = Math.min(acc.left, item.x);
      acc.top = Math.min(acc.top, item.y);
      acc.right = Math.max(acc.right, item.x + item.w);
      acc.bottom = Math.max(acc.bottom, item.y + item.h);
      return acc;
    }, { left: Infinity, top: Infinity, right: 0, bottom: 0 });

    if (!Number.isFinite(bounds.left) || !Number.isFinite(bounds.top)) return;
    const targetX = Math.max(0, Math.round((((bounds.left + bounds.right) / 2) * zoom) - (viewport.clientWidth / 2)));
    const targetY = Math.max(0, Math.round((((bounds.top + bounds.bottom) / 2) * zoom) - (viewport.clientHeight / 2)));
    viewport.scrollLeft = targetX;
    viewport.scrollTop = targetY;
    syncScrollPosition();
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
    revealItemInViewport(item.id);
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
    revealItemInViewport(clone.id);
    queueSave();
  }

  function centerSelectedItem() {
    const item = selectedItem();
    if (!item) return;
    item.x = round((BOARD_WIDTH - item.w) / 2);
    item.y = round((BOARD_HEIGHT - item.h) / 2);
    renderBoard();
    revealItemInViewport(item.id);
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
    if (!item || item.locked || item.module !== 'habit') return;
    item.days[index] = !item.days[index];
    renderBoard();
    queueSave();
  }

  function syncScrollPosition() {
    if (!state.refs.viewport) return;
    state.board.scrollLeft = state.refs.viewport.scrollLeft;
    state.board.scrollTop = state.refs.viewport.scrollTop;
  }

  function revealItemInViewport(itemId, options) {
    const viewport = state.refs.viewport;
    const item = state.items.find(entry => entry.id === itemId);
    if (!viewport || !item) return;
    const zoom = state.board.zoom || DEFAULT_ZOOM;
    const viewportLeft = viewport.scrollLeft / zoom;
    const viewportTop = viewport.scrollTop / zoom;
    const viewportRight = viewportLeft + (viewport.clientWidth / zoom);
    const viewportBottom = viewportTop + (viewport.clientHeight / zoom);
    const itemLeft = item.x;
    const itemTop = item.y;
    const itemRight = item.x + item.w;
    const itemBottom = item.y + item.h;
    const padding = options?.padding ?? 90;
    const alreadyVisible = itemLeft >= (viewportLeft + 20)
      && itemTop >= (viewportTop + 20)
      && itemRight <= (viewportRight - 20)
      && itemBottom <= (viewportBottom - 20);
    if (options?.ifNeeded && alreadyVisible) return;
    const targetLeft = Math.max(0, ((itemLeft + itemRight) / 2) - ((viewport.clientWidth / zoom) / 2));
    const targetTop = Math.max(0, ((itemTop + itemBottom) / 2) - ((viewport.clientHeight / zoom) / 2));
    viewport.scrollLeft = Math.max(0, Math.round((targetLeft - padding) * zoom));
    viewport.scrollTop = Math.max(0, Math.round((targetTop - padding) * zoom));
    syncScrollPosition();
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
    if (!item || item.locked || event.button !== 0) return;
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
    if (!item || item.locked || event.button !== 0) return;
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
    const backgroundBtn = event.target.closest('[data-board-background]');
    if (backgroundBtn) {
      state.board.background = backgroundBtn.dataset.boardBackground;
      updateChrome();
      queueSave();
      return;
    }

    const templateBtn = event.target.closest('[data-template-id]');
    if (templateBtn) {
      applyStarterLayout(templateBtn.dataset.templateId);
      return;
    }

    const uploadReuseBtn = event.target.closest('[data-upload-reuse]');
    if (uploadReuseBtn) {
      const source = state.items.find(item => item.id === uploadReuseBtn.dataset.uploadReuse && item.module === 'photo' && item.src);
      if (source) {
        addItem(normalizeItem({
          module: 'photo',
          variant: 'photo',
          src: source.src,
          title: source.title || 'Upload',
          credit: source.credit || 'Your upload',
          source: source.source || 'Upload',
          x: clamp(source.x + 36, BOARD_PADDING, BOARD_WIDTH - source.w - BOARD_PADDING),
          y: clamp(source.y + 36, BOARD_PADDING, BOARD_HEIGHT - source.h - BOARD_PADDING),
          w: source.w,
          h: source.h,
          lockAspect: true,
          aspectRatio: source.aspectRatio || (source.w / Math.max(source.h, 1)),
          opacity: source.opacity || 1
        }, state.items.length));
      }
      return;
    }

    const categoryBtn = event.target.closest('[data-category]');
    if (categoryBtn) {
      const nextCategory = categoryBtn.dataset.category;
      const changed = nextCategory !== state.activeCategory;
      state.activeCategory = nextCategory;
      state.board.activeCategory = state.activeCategory;
      state.board.libraryCollapsed = false;
      if (changed) state.search = '';
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
        case 'undo-history':
          undoHistory();
          return;
        case 'redo-history':
          redoHistory();
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
        case 'toggle-focus':
          state.board.focusMode = !state.board.focusMode;
          syncEditorLayoutState();
          queueSave();
          return;
        case 'quick-headline':
          addItem(spawnFromLibrary('editorial-headline'));
          return;
        case 'quick-note':
          addItem(spawnFromLibrary('cream-note'));
          return;
        case 'quick-goal':
          addItem(spawnFromLibrary('goal-focus'));
          return;
        case 'quick-frame':
          addItem(spawnFromLibrary('gallery-frame'));
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
        case 'toggle-lock-selection':
          if (state.selectedId) {
            const selected = selectedItem();
            if (selected) {
              selected.locked = !selected.locked;
              renderBoard();
              queueSave();
            }
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
    if (state.selectedId) revealItemInViewport(state.selectedId, { ifNeeded: true, padding: 60 });
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
    if (event.target.matches('[data-selected-opacity]')) {
      const item = selectedItem();
      if (!item) return;
      item.opacity = clamp(toNumber(event.target.value, 1), 0.15, 1);
      const itemNode = state.refs.board ? state.refs.board.querySelector(`[data-item-id="${item.id}"]`) : null;
      if (itemNode) itemNode.style.opacity = String(item.opacity);
      const valueNode = event.target.parentElement?.querySelector('.vs-inspector-range-value');
      if (valueNode) valueNode.textContent = Math.round(item.opacity * 100) + '%';
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
    if (event.target.matches('[data-selected-locked]')) {
      const item = selectedItem();
      if (!item) return;
      item.locked = !!event.target.checked;
      renderBoard();
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
    const isStandalone = window.__PCC_VISION_STANDALONE_PAGE__ === true;
    if (!isStandalone) {
      const page = document.getElementById('page-vision');
      if (!page || !page.classList.contains('active')) return;
    }
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
    if (window.__PCC_VISION_PREFLIGHT__ && window.__PCC_VISION_PREFLIGHT_DONE__ !== true) {
      if (!state.waitingForPreflight) {
        state.waitingForPreflight = true;
        Promise.resolve(window.__PCC_VISION_PREFLIGHT__).finally(() => {
          state.waitingForPreflight = false;
          mount();
        });
      }
      return;
    }
    const root = document.getElementById('vision-studio-root');
    if (!root) return;
    state.root = root;
    const incoming = readState();
    state.board = normalizeBoard(incoming.board);
    state.activeCategory = state.board.activeCategory || 'photos';
    state.items = incoming.items || [];
    rerenderShell();
    initializeHistory();
    state.saveState = 'saved';
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
  document.addEventListener('pcc:pagecontentloaded', function (event) {
    if (event?.detail?.pageId === 'vision') mount();
  });
  window.addEventListener('pcc:pagechange', function (event) {
    if (event?.detail?.pageId === 'vision') mount();
  });
  if (document.readyState !== 'loading') {
    setTimeout(mount, 180);
  }
})();
