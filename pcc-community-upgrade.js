(function() {
  const THREADS_KEY = 'pcc-comm-threads-v2';
  const THREAD_DRAFTS_KEY = 'pcc-comm-thread-drafts-v1';
  const GIPHY_KEY = 'pcc-giphy-api-key';
  const GIF_SUGGESTIONS = ['celebration', 'support', 'focus', 'money', 'team win', 'motivation'];
  let threads = [];
  let activeThreadId = '';
  let messageSearch = '';
  let messageFilter = 'all';
  let postGif = null;
  let threadGifDrafts = {};
  let threadDrafts = {};
  let gifTarget = { type: 'post', threadId: '' };

  function esc(text) {
    return typeof escapeHtml === 'function' ? escapeHtml(text || '') : String(text || '');
  }

  function escAttr(text) {
    return typeof escapeHtmlAttr === 'function' ? escapeHtmlAttr(text || '') : esc(text || '');
  }

  function fmtText(text) {
    return esc(text).replace(/\n/g, '<br>');
  }

  function relTime(value) {
    const time = new Date(value).getTime();
    if (!time) return 'just now';
    const diff = Date.now() - time;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return `${Math.max(1, Math.round(diff / 60000))}m ago`;
    if (diff < 86400000) return `${Math.max(1, Math.round(diff / 3600000))}h ago`;
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function clockTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function ensureStyles() {
    if (document.getElementById('pcc-community-upgrade-styles')) return;
    const style = document.createElement('style');
    style.id = 'pcc-community-upgrade-styles';
    style.textContent = `
      .comm-compose-tools{display:flex;align-items:center;gap:.55rem;flex-wrap:wrap;}
      .comm-gif-trigger{background:var(--tint);border:1px solid var(--teal-border);border-radius:999px;padding:.35rem .75rem;font:inherit;font-size:.6rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);cursor:pointer;transition:all .18s ease;}
      .comm-gif-trigger:hover{background:var(--tint-hover);border-color:rgba(var(--teal-rgb),0.34);}
      .comm-gif-preview-row{display:flex;flex-wrap:wrap;gap:.55rem;margin-top:.75rem;}
      .comm-gif-preview-card{display:flex;align-items:center;gap:.7rem;background:var(--tint);border:1px solid var(--teal-border);border-radius:14px;padding:.55rem .65rem;min-width:min(100%,320px);}
      .comm-gif-preview-thumb{width:72px;height:56px;object-fit:cover;border-radius:10px;flex-shrink:0;}
      .comm-gif-preview-meta{min-width:0;flex:1;}
      .comm-gif-preview-title{font-size:.68rem;font-weight:600;color:var(--ink);margin-bottom:.12rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
      .comm-gif-preview-sub{font-size:.56rem;color:var(--muted);}
      .comm-gif-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.75rem;padding:.2rem .3rem;}
      .comm-gif-remove:hover{color:#8B2020;}
      .comm-post-media{margin:.15rem 0 .85rem;}
      .comm-post-media img{width:min(100%,360px);border-radius:16px;display:block;border:1px solid var(--teal-border);}
      .comm-messages-shell{padding:0;overflow:hidden;}
      .comm-messages-layout{display:grid;grid-template-columns:280px minmax(0,1fr);min-height:560px;}
      .comm-thread-sidebar{border-right:1px solid var(--teal-border);background:color-mix(in srgb,var(--surface2) 90%, #fff);}
      .comm-thread-sidebar-head{padding:1rem 1rem .85rem;border-bottom:1px solid var(--teal-border);}
      .comm-thread-search{width:100%;background:var(--input-bg);border:1px solid var(--teal-border);border-radius:12px;color:var(--ink);font:inherit;padding:.72rem .85rem;outline:none;}
      .comm-thread-search:focus{border-color:rgba(var(--teal-rgb),0.36);}
      .comm-thread-search::placeholder{color:var(--muted);}
      .comm-thread-filter-row{display:flex;flex-wrap:wrap;gap:.42rem;margin-top:.75rem;}
      .comm-thread-filter{display:inline-flex;align-items:center;gap:.42rem;background:var(--surface2);border:1px solid var(--teal-border);border-radius:999px;padding:.38rem .68rem;color:var(--charcoal);font:inherit;font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;transition:all .18s ease;}
      .comm-thread-filter:hover{background:var(--tint);border-color:rgba(var(--teal-rgb),0.3);}
      .comm-thread-filter.active{background:rgba(var(--teal-rgb),0.1);border-color:rgba(var(--teal-rgb),0.42);color:var(--teal);}
      .comm-thread-filter-count{display:inline-flex;align-items:center;justify-content:center;min-width:1.15rem;height:1.15rem;border-radius:999px;background:rgba(var(--teal-rgb),0.12);color:var(--teal);font-size:.54rem;padding:0 .26rem;}
      .comm-thread-overview{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.48rem;margin-top:.75rem;}
      .comm-thread-overview-card{background:var(--surface2);border:1px solid var(--teal-border);border-radius:14px;padding:.62rem .68rem;}
      .comm-thread-overview-label{font-size:.5rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--muted);margin-bottom:.25rem;}
      .comm-thread-overview-value{font-family:'Cormorant Garamond',serif;font-size:1.2rem;line-height:1;color:var(--ink);}
      .comm-thread-list{display:flex;flex-direction:column;gap:.45rem;padding:.85rem;max-height:470px;overflow:auto;}
      .comm-thread-item{display:flex;align-items:flex-start;gap:.65rem;padding:.75rem .8rem;border:1px solid var(--teal-border);border-radius:14px;background:var(--surface2);cursor:pointer;transition:all .18s ease;}
      .comm-thread-item:hover{background:var(--tint);border-color:rgba(var(--teal-rgb),0.3);}
      .comm-thread-item.active{background:rgba(var(--teal-rgb),0.08);border-color:rgba(var(--teal-rgb),0.42);}
      .comm-thread-avatar{width:40px;height:40px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,var(--teal),var(--teal-light));color:#fff;font-family:'Cormorant Garamond',serif;font-size:1rem;flex-shrink:0;}
      .comm-thread-copy{min-width:0;flex:1;}
      .comm-thread-name-row{display:flex;justify-content:space-between;gap:.5rem;align-items:flex-start;margin-bottom:.18rem;}
      .comm-thread-name-wrap{min-width:0;flex:1;}
      .comm-thread-name{font-size:.74rem;font-weight:700;color:var(--ink);}
      .comm-thread-time{font-size:.52rem;color:var(--muted);white-space:nowrap;}
      .comm-thread-badges{display:flex;align-items:center;gap:.35rem;flex-shrink:0;}
      .comm-thread-unread{display:inline-flex;align-items:center;justify-content:center;min-width:1.3rem;height:1.3rem;border-radius:999px;background:linear-gradient(135deg,var(--teal),var(--teal-light));color:#fff;font-size:.58rem;font-weight:700;padding:0 .28rem;}
      .comm-thread-pin{font-size:.72rem;color:var(--teal);}
      .comm-thread-sub{font-size:.55rem;color:var(--teal);margin-bottom:.18rem;}
      .comm-thread-chip-row{display:flex;flex-wrap:wrap;gap:.32rem;margin-bottom:.22rem;}
      .comm-thread-chip{display:inline-flex;align-items:center;gap:.28rem;border-radius:999px;padding:.18rem .46rem;background:rgba(var(--teal-rgb),0.09);border:1px solid rgba(var(--teal-rgb),0.16);font-size:.48rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--teal);}
      .comm-thread-chip.soft{background:var(--tint);color:var(--charcoal);}
      .comm-thread-chip.alert{background:rgba(245,158,11,0.12);border-color:rgba(245,158,11,0.2);color:#9A6700;}
      .comm-thread-snippet{font-size:.62rem;color:var(--charcoal);line-height:1.45;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
      .comm-thread-pane{display:flex;flex-direction:column;min-width:0;}
      .comm-thread-pane-head{display:flex;justify-content:space-between;gap:.8rem;align-items:flex-start;padding:1rem 1.15rem;border-bottom:1px solid var(--teal-border);background:var(--surface2);}
      .comm-thread-pane-copy{min-width:0;flex:1;}
      .comm-thread-pane-title{display:flex;gap:.7rem;align-items:center;}
      .comm-thread-pane-title .comm-thread-avatar{width:42px;height:42px;border-radius:16px;}
      .comm-thread-pane-name{font-size:.9rem;font-weight:700;color:var(--ink);}
      .comm-thread-pane-sub{font-size:.58rem;color:var(--muted);margin-top:.12rem;}
      .comm-thread-pane-meta{display:flex;flex-wrap:wrap;gap:.36rem;margin-top:.45rem;}
      .comm-thread-pane-actions{display:flex;gap:.45rem;flex-wrap:wrap;justify-content:flex-end;}
      .comm-thread-pane-action{background:var(--tint);border:1px solid var(--teal-border);border-radius:10px;padding:.45rem .7rem;font:inherit;font-size:.56rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--teal);cursor:pointer;}
      .comm-thread-pane-action:hover{background:var(--tint-hover);}
      .comm-thread-scroll{flex:1;min-height:0;max-height:360px;overflow:auto;padding:1rem 1.15rem;background:linear-gradient(180deg,color-mix(in srgb,var(--surface2) 92%, #fff),transparent);}
      .comm-thread-stack{display:flex;flex-direction:column;gap:.75rem;}
      .comm-thread-msg{display:flex;flex-direction:column;gap:.22rem;max-width:min(78%,340px);}
      .comm-thread-msg.mine{align-self:flex-end;align-items:flex-end;}
      .comm-thread-msg.theirs{align-self:flex-start;align-items:flex-start;}
      .comm-thread-bubble{padding:.65rem .8rem;border-radius:16px;font-size:.84rem;line-height:1.6;box-shadow:var(--shadow-sm);}
      .comm-thread-msg.mine .comm-thread-bubble{background:linear-gradient(135deg,var(--teal),var(--teal-light));color:#fff;border-bottom-right-radius:6px;}
      .comm-thread-msg.theirs .comm-thread-bubble{background:var(--surface2);border:1px solid var(--teal-border);color:var(--ink);border-bottom-left-radius:6px;}
      .comm-thread-media{width:min(100%,260px);border-radius:16px;border:1px solid var(--teal-border);display:block;}
      .comm-thread-meta{font-size:.52rem;color:var(--muted);padding:0 .2rem;}
      .comm-thread-compose{padding:1rem 1.15rem;border-top:1px solid var(--teal-border);background:var(--surface2);}
      .comm-thread-compose textarea{width:100%;min-height:92px;resize:vertical;background:var(--input-bg);border:1px solid var(--teal-border);border-radius:14px;color:var(--ink);font:inherit;line-height:1.65;padding:.8rem .95rem;outline:none;}
      .comm-thread-compose textarea:focus{border-color:rgba(var(--teal-rgb),0.36);}
      .comm-thread-compose-actions{display:flex;justify-content:space-between;gap:.7rem;align-items:center;margin-top:.7rem;flex-wrap:wrap;}
      .comm-thread-compose-tools{display:flex;gap:.5rem;align-items:center;flex-wrap:wrap;}
      .comm-thread-draft-note{font-size:.54rem;color:var(--muted);margin-top:.55rem;}
      .comm-thread-send{background:var(--teal);border:none;border-radius:12px;padding:.58rem .95rem;color:#fff;font:inherit;font-size:.62rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;}
      .comm-thread-send:hover{background:var(--teal-mid);}
      .comm-gif-overlay .comm-modal{max-width:900px;}
      .comm-gif-key-row,.comm-gif-search-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:.55rem;align-items:start;}
      .comm-gif-help{font-size:.6rem;color:var(--muted);line-height:1.55;margin:.45rem 0 .9rem;}
      .comm-gif-suggestion-row{display:flex;flex-wrap:wrap;gap:.42rem;margin:.75rem 0 .35rem;}
      .comm-gif-suggestion{background:var(--surface2);border:1px solid var(--teal-border);border-radius:999px;padding:.34rem .64rem;color:var(--charcoal);font:inherit;font-size:.54rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;}
      .comm-gif-suggestion:hover{background:var(--tint);border-color:rgba(var(--teal-rgb),0.3);}
      .comm-gif-status{font-size:.62rem;color:var(--charcoal);margin:.8rem 0 .7rem;}
      .comm-gif-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:.7rem;max-height:420px;overflow:auto;padding-right:.2rem;}
      .comm-gif-card{background:var(--surface2);border:1px solid var(--teal-border);border-radius:14px;padding:.55rem;display:flex;flex-direction:column;gap:.45rem;}
      .comm-gif-card img{width:100%;height:120px;object-fit:cover;border-radius:10px;}
      .comm-gif-card button{background:var(--tint);border:1px solid var(--teal-border);border-radius:10px;padding:.48rem .65rem;font:inherit;font-size:.56rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--teal);cursor:pointer;}
      .comm-gif-card button:hover{background:var(--tint-hover);}
      .comm-gif-card-title{font-size:.58rem;color:var(--charcoal);line-height:1.45;min-height:2.4em;}
      .comm-dm-panel{width:min(380px,calc(100vw - 1rem));height:540px;bottom:1rem;right:1rem;z-index:740;background:var(--modal-bg);}
      .comm-dm-panel .comm-thread-scroll{max-height:none;height:100%;padding:.95rem;}
      .comm-dm-panel .comm-thread-compose{padding:.85rem;}
      .comm-dm-head{padding:.85rem .95rem;align-items:flex-start;}
      .comm-dm-head-main{display:flex;gap:.65rem;min-width:0;flex:1;}
      .comm-dm-head-copy{min-width:0;flex:1;}
      .comm-dm-head-title{font-size:.74rem;font-weight:700;color:var(--ink);}
      .comm-dm-head-sub{font-size:.54rem;color:var(--muted);margin-top:.12rem;}
      .comm-dm-link{background:none;border:none;color:var(--teal);font:inherit;font-size:.52rem;font-weight:700;letter-spacing:.12em;text-transform:uppercase;cursor:pointer;padding:.1rem 0;}
      .comm-dm-link:hover{text-decoration:underline;}
      @media(max-width:960px){.comm-messages-layout{grid-template-columns:1fr;}.comm-thread-sidebar{border-right:none;border-bottom:1px solid var(--teal-border);}.comm-thread-list{max-height:220px;}.comm-thread-scroll{max-height:320px;}.comm-thread-overview{grid-template-columns:repeat(3,minmax(0,1fr));}}
      @media(max-width:640px){.comm-thread-overview{grid-template-columns:1fr;}.comm-thread-pane-head{flex-direction:column;}.comm-thread-pane-actions{justify-content:flex-start;}}
    `;
    document.head.appendChild(style);
  }

  function ensureTopLevel() {
    const body = document.body;
    if (!body) return;
    ['edit-profile-overlay', 'create-pod-overlay', 'create-challenge-overlay', 'comm-dm-panel', 'comm-gif-overlay'].forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.parentElement !== body) body.appendChild(el);
    });
  }

  function ensureComposer() {
    const footer = document.querySelector('#page-community .comm-composer-footer');
    const charCount = document.getElementById('comm-char-count');
    if (footer && !document.getElementById('comm-post-gif-btn')) {
      const tools = document.createElement('div');
      tools.className = 'comm-compose-tools';
      tools.innerHTML = `<button class="comm-gif-trigger" id="comm-post-gif-btn" type="button" onclick="openGifPicker('post')">GIF</button>`;
      if (charCount) tools.appendChild(charCount);
      footer.prepend(tools);
    }
    if (footer && !document.getElementById('comm-post-gif-preview')) {
      const preview = document.createElement('div');
      preview.id = 'comm-post-gif-preview';
      preview.className = 'comm-gif-preview-row';
      footer.insertAdjacentElement('afterend', preview);
    }
    const podsStat = document.querySelector('.comm-stats .comm-stat:nth-child(2) .comm-stat-n');
    if (podsStat && !podsStat.id) podsStat.id = 'comm-pods-count';
  }

  function ensureGifModal() {
    ensureStyles();
    ensureTopLevel();
    let overlay = document.getElementById('comm-gif-overlay');
    if (overlay) return overlay;
    overlay = document.createElement('div');
    overlay.id = 'comm-gif-overlay';
    overlay.className = 'comm-modal-overlay comm-gif-overlay';
    overlay.innerHTML = `
      <div class="comm-modal">
        <button class="comm-modal-close" type="button" onclick="closeGifPicker()">X</button>
        <div class="comm-modal-title">Add a GIF</div>
        <div class="comm-gif-key-row">
          <input class="comm-modal-input" id="comm-giphy-api-key" placeholder="Paste your GIPHY API key once" />
          <button class="comm-modal-cancel" type="button" onclick="saveGifApiKey()">Save Key</button>
        </div>
        <div class="comm-gif-help">Use a free key from developers.giphy.com. It stays saved in this browser only.</div>
        <div class="comm-gif-search-row">
          <input class="comm-modal-input" id="comm-gif-search" placeholder="Search for celebration, motivation, support..." />
          <button class="comm-modal-submit" type="button" onclick="searchGifPicker()">Search</button>
        </div>
        <div class="comm-gif-suggestion-row">
          ${GIF_SUGGESTIONS.map((term) => `<button class="comm-gif-suggestion" type="button" onclick="applyGifSuggestion('${term.replaceAll("'", "\\'")}')">${term}</button>`).join('')}
          <button class="comm-gif-suggestion" type="button" onclick="searchGifPicker(true)">Trending</button>
        </div>
        <div class="comm-gif-status" id="comm-gif-status">Add your key, then search to start pulling GIFs into the Community.</div>
        <div class="comm-gif-grid" id="comm-gif-grid"></div>
      </div>
    `;
    document.body.appendChild(overlay);
    return overlay;
  }

  function getGifKey() {
    try { return localStorage.getItem(GIPHY_KEY) || ''; } catch (e) { return ''; }
  }

  function loadDrafts() {
    try {
      const raw = JSON.parse(localStorage.getItem(THREAD_DRAFTS_KEY));
      threadDrafts = raw && typeof raw === 'object' ? raw : {};
    } catch (e) {
      threadDrafts = {};
    }
  }

  function saveDrafts() {
    try { localStorage.setItem(THREAD_DRAFTS_KEY, JSON.stringify(threadDrafts)); } catch (e) {}
  }

  function lastMessageAt(thread) {
    return thread?.messages?.[thread.messages.length - 1]?.createdAt || '';
  }

  function sortThreads() {
    threads = threads.sort((a, b) => {
      const pinDelta = Number(!!b.pinned) - Number(!!a.pinned);
      if (pinDelta) return pinDelta;
      return new Date(lastMessageAt(b) || 0) - new Date(lastMessageAt(a) || 0);
    });
  }

  function saveThreads() {
    sortThreads();
    try { localStorage.setItem(THREADS_KEY, JSON.stringify(threads)); } catch (e) {}
  }

  function normalizeThread(thread) {
    return {
      id: thread.id,
      name: thread.name || 'Conversation',
      emoji: thread.emoji || '💬',
      type: thread.type || 'dm',
      subtitle: thread.subtitle || (thread.type === 'pod' ? 'Pod thread' : 'Direct message'),
      accent: thread.accent || '#0A7266',
      unread: Number.isFinite(Number(thread.unread)) ? Number(thread.unread) : 0,
      pinned: !!thread.pinned,
      online: !!thread.online,
      members: Number.isFinite(Number(thread.members)) ? Number(thread.members) : (thread.type === 'pod' ? 2 : 2),
      role: thread.role || (thread.type === 'pod' ? 'Pod thread' : 'Direct message'),
      messages: (thread.messages || []).map((msg, index) => ({
        id: msg.id || `${thread.id}-msg-${index}`,
        sender: msg.sender || thread.name,
        mine: !!msg.mine,
        text: msg.text || '',
        gif: msg.gif || '',
        title: msg.title || '',
        createdAt: msg.createdAt || new Date().toISOString(),
      })),
    };
  }

  function starterPods() {
    return [{ id: 'pod-ceo-squad', name: 'CEO Squad', emoji: '👑', desc: 'Weekly goals, money moves, and execution receipts.', members: 4, createdAt: new Date().toISOString() }];
  }

  function seedThreads() {
    const now = Date.now();
    return [
      { id: 'thread-pod-ceo-squad', name: 'CEO Squad', emoji: '👑', type: 'pod', subtitle: 'You + 3', accent: '#0A7266', messages: [
        { sender: 'Bella P', mine: false, text: 'Checking in. What is the one revenue move you are making today?', createdAt: new Date(now - 55 * 60000).toISOString() },
        { sender: 'You', mine: true, text: 'Already on it. Outreach first, then the proposal follow-up.', createdAt: new Date(now - 42 * 60000).toISOString() },
      ]},
      { id: 'thread-bella-p', name: 'Bella P', emoji: '👑', type: 'dm', subtitle: 'In Streams', accent: '#0A7266', messages: [{ sender: 'Bella P', mine: false, text: 'When you post the case study, send it to me. I want to repost it.', createdAt: new Date(now - 28 * 60000).toISOString() }]},
      { id: 'thread-shila', name: 'Shila', emoji: '🌸', type: 'dm', subtitle: 'Dashboard', accent: '#BE185D', messages: [{ sender: 'Shila', mine: false, text: 'Let us lock the spring drop schedule tonight.', createdAt: new Date(now - 22 * 60000).toISOString() }]},
      { id: 'thread-tay', name: 'Tay', emoji: '✨', type: 'dm', subtitle: 'Life Board', accent: '#7C3AED', messages: [{ sender: 'Tay', mine: false, text: 'Proud of you. The momentum is showing.', createdAt: new Date(now - 12 * 60000).toISOString() }]},
    ].map(normalizeThread);
  }

  function seedThreads() {
    const now = Date.now();
    return [
      {
        id: 'thread-pod-ceo-squad',
        name: 'CEO Squad',
        emoji: 'CS',
        type: 'pod',
        subtitle: 'You + 3',
        accent: '#0A7266',
        unread: 0,
        pinned: true,
        members: 4,
        role: 'Accountability pod',
        messages: [
          { sender: 'Bella P', mine: false, text: 'Checking in. What is the one revenue move you are making today?', createdAt: new Date(now - 55 * 60000).toISOString() },
          { sender: 'You', mine: true, text: 'Already on it. Outreach first, then the proposal follow-up.', createdAt: new Date(now - 42 * 60000).toISOString() },
        ],
      },
      {
        id: 'thread-bella-p',
        name: 'Bella P',
        emoji: 'BP',
        type: 'dm',
        subtitle: 'In Streams',
        accent: '#0A7266',
        unread: 1,
        pinned: true,
        online: true,
        members: 2,
        role: 'Creative partner',
        messages: [
          { sender: 'Bella P', mine: false, text: 'When you post the case study, send it to me. I want to repost it.', createdAt: new Date(now - 28 * 60000).toISOString() },
        ],
      },
      {
        id: 'thread-shila',
        name: 'Shila',
        emoji: 'SH',
        type: 'dm',
        subtitle: 'Dashboard',
        accent: '#BE185D',
        unread: 2,
        online: false,
        members: 2,
        role: 'Co-founder',
        messages: [
          { sender: 'Shila', mine: false, text: 'Let us lock the spring drop schedule tonight.', createdAt: new Date(now - 22 * 60000).toISOString() },
        ],
      },
      {
        id: 'thread-tay',
        name: 'Tay',
        emoji: 'TY',
        type: 'dm',
        subtitle: 'Life Board',
        accent: '#7C3AED',
        unread: 1,
        online: true,
        members: 2,
        role: 'Community friend',
        messages: [
          { sender: 'Tay', mine: false, text: 'Proud of you. The momentum is showing.', createdAt: new Date(now - 12 * 60000).toISOString() },
        ],
      },
    ].map(normalizeThread);
  }

  function loadThreads() {
    try {
      const raw = JSON.parse(localStorage.getItem(THREADS_KEY));
      threads = Array.isArray(raw) && raw.length ? raw.map(normalizeThread) : seedThreads();
    } catch (e) {
      threads = seedThreads();
    }
    saveThreads();
    if (!activeThreadId || !threads.some((thread) => thread.id === activeThreadId)) {
      activeThreadId = threads[0]?.id || '';
    }
  }

  function markThreadRead(threadId) {
    const thread = getThread(threadId);
    if (!thread) return;
    if (thread.unread !== 0) {
      thread.unread = 0;
      saveThreads();
    }
  }

  function unreadTotal() {
    return threads.reduce((sum, thread) => sum + (Number(thread.unread) || 0), 0);
  }

  function messageFilterMatches(thread) {
    if (messageFilter === 'pods') return thread.type === 'pod';
    if (messageFilter === 'dms') return thread.type !== 'pod';
    if (messageFilter === 'unread') return Number(thread.unread) > 0;
    return true;
  }

  function filteredThreads() {
    const needle = (messageSearch || '').trim().toLowerCase();
    return threads.filter((thread) => {
      const matchesSearch = !needle || `${thread.name} ${thread.subtitle} ${thread.role || ''} ${threadSnippet(thread)}`.toLowerCase().includes(needle);
      return matchesSearch && messageFilterMatches(thread);
    });
  }

  function threadTypeLabel(thread) {
    return thread.type === 'pod' ? 'Pod thread' : 'Direct message';
  }

  function threadMembersLabel(thread) {
    if (thread.type === 'pod') return `${Math.max(1, Number(thread.members) || 0)} members`;
    return '1:1 conversation';
  }

  function threadPresenceLabel(thread) {
    return thread.online ? 'Active now' : `Last active ${relTime(lastMessageAt(thread))}`;
  }

  function ensureThread(name, emoji, options) {
    loadThreads();
    const existing = threads.find((thread) => thread.name === name);
    if (existing) {
      Object.assign(existing, normalizeThread({
        ...existing,
        emoji: emoji || existing.emoji,
        subtitle: options?.subtitle || existing.subtitle,
        unread: Number.isFinite(Number(options?.unread)) ? Number(options.unread) : existing.unread,
        pinned: typeof options?.pinned === 'boolean' ? options.pinned : existing.pinned,
        online: typeof options?.online === 'boolean' ? options.online : existing.online,
        members: Number.isFinite(Number(options?.members)) ? Number(options.members) : existing.members,
        role: options?.role || existing.role,
      }));
      saveThreads();
      return existing;
    }
    const thread = normalizeThread({
      id: options?.id || `thread-${Date.now()}`,
      name,
      emoji: emoji || options?.emoji || '💬',
      type: options?.type || 'dm',
      subtitle: options?.subtitle || (options?.type === 'pod' ? 'Pod thread' : 'Direct message'),
      accent: options?.accent || '#0A7266',
      unread: Number.isFinite(Number(options?.unread)) ? Number(options.unread) : 0,
      pinned: !!options?.pinned,
      online: !!options?.online,
      members: Number.isFinite(Number(options?.members)) ? Number(options.members) : (options?.type === 'pod' ? 2 : 2),
      role: options?.role || (options?.type === 'pod' ? 'Pod thread' : 'Direct message'),
      messages: options?.messages || [],
    });
    threads.unshift(thread);
    activeThreadId = thread.id;
    saveThreads();
    return thread;
  }

  function getThread(threadId) {
    return threads.find((thread) => thread.id === threadId) || null;
  }

  function activeThread() {
    return getThread(activeThreadId);
  }

  function threadSnippet(thread) {
    const last = thread?.messages?.[thread.messages.length - 1];
    if (!last) return 'No messages yet.';
    if (last.text) return last.text;
    if (last.gif) return 'Sent a GIF';
    return 'No messages yet.';
  }

  function gifPreviewMarkup(gif, clearCall) {
    if (!gif?.url) return '';
    return `
      <div class="comm-gif-preview-card">
        <img class="comm-gif-preview-thumb" src="${gif.url}" alt="${esc(gif.title || 'GIF')}" />
        <div class="comm-gif-preview-meta">
          <div class="comm-gif-preview-title">${esc(gif.title || 'Selected GIF')}</div>
          <div class="comm-gif-preview-sub">Ready to send</div>
        </div>
        <button class="comm-gif-remove" type="button" onclick="${clearCall}">Remove</button>
      </div>
    `;
  }

  function renderPostGifPreview() {
    const preview = document.getElementById('comm-post-gif-preview');
    if (preview) preview.innerHTML = gifPreviewMarkup(postGif, 'clearPostGif()');
  }

  function renderThreadGifPreview(threadId) {
    const gif = threadGifDrafts[threadId] || null;
    ['comm-thread-gif-preview', 'dm-gif-preview'].forEach((id) => {
      const preview = document.getElementById(id);
      if (preview) preview.innerHTML = gifPreviewMarkup(gif, `clearThreadGif('${threadId}')`);
    });
  }

  function messageMarkup(message) {
    return `
      <div class="comm-thread-msg ${message.mine ? 'mine' : 'theirs'}">
        ${message.text ? `<div class="comm-thread-bubble">${fmtText(message.text)}</div>` : ''}
        ${message.gif ? `<img class="comm-thread-media" src="${message.gif}" alt="${esc(message.title || 'GIF')}" />` : ''}
        <div class="comm-thread-meta">${esc(message.sender)} · ${esc(clockTime(message.createdAt))}</div>
      </div>
    `;
  }

  function rerenderMessagesIfVisible() {
    const panel = document.getElementById('comm-view-panel-container');
    const main = document.getElementById('comm-main');
    if (panel && main?.dataset.view === 'messages') window.renderMessagesView(panel);
  }

  window.ensureCommunityUiTopLevel = ensureTopLevel;

  window.saveGifApiKey = function() {
    const input = document.getElementById('comm-giphy-api-key');
    const key = input?.value.trim();
    if (!key) {
      safeShowToast('Add your GIPHY API key first.');
      return;
    }
    try { localStorage.setItem(GIPHY_KEY, key); } catch (e) {}
    safeShowToast('GIPHY key saved.');
    window.searchGifPicker();
  };

  window.openGifPicker = function(targetType) {
    if (targetType === 'thread' && !activeThreadId) {
      safeShowToast('Open a conversation first.');
      return;
    }
    ensureGifModal();
    ensureTopLevel();
    gifTarget = { type: targetType || 'post', threadId: targetType === 'thread' ? activeThreadId : '' };
    const overlay = document.getElementById('comm-gif-overlay');
    const keyInput = document.getElementById('comm-giphy-api-key');
    if (keyInput) keyInput.value = getGifKey();
    if (overlay) {
      overlay.classList.add('open');
      overlay.style.display = 'flex';
    }
    document.getElementById('comm-gif-search')?.focus();
    if (getGifKey()) window.searchGifPicker(true);
  };

  window.closeGifPicker = function() {
    const overlay = document.getElementById('comm-gif-overlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.style.display = '';
  };

  window.searchGifPicker = async function(forceTrending) {
    ensureGifModal();
    const key = getGifKey() || document.getElementById('comm-giphy-api-key')?.value.trim();
    const query = document.getElementById('comm-gif-search')?.value.trim() || '';
    const status = document.getElementById('comm-gif-status');
    const grid = document.getElementById('comm-gif-grid');
    if (!status || !grid) return;
    if (!key) {
      status.textContent = 'Add your GIPHY API key first, then search.';
      grid.innerHTML = '';
      return;
    }
    try { localStorage.setItem(GIPHY_KEY, key); } catch (e) {}
    const endpoint = (!query || forceTrending)
      ? `https://api.giphy.com/v1/gifs/trending?api_key=${encodeURIComponent(key)}&limit=12&rating=pg-13`
      : `https://api.giphy.com/v1/gifs/search?api_key=${encodeURIComponent(key)}&q=${encodeURIComponent(query)}&limit=12&rating=pg-13`;
    status.textContent = (!query || forceTrending) ? 'Loading trending GIFs...' : `Searching "${query}"...`;
    grid.innerHTML = '';
    try {
      const response = await fetch(endpoint);
      const payload = await response.json();
      if (!response.ok) throw new Error(payload?.meta?.msg || 'Could not reach GIPHY.');
      const results = Array.isArray(payload.data) ? payload.data : [];
      if (!results.length) {
        status.textContent = 'No GIFs matched that search.';
        return;
      }
      status.textContent = 'Pick one to drop into the Community.';
      grid.innerHTML = results.map((gif) => {
        const still = gif?.images?.fixed_width_still?.url || gif?.images?.fixed_width?.url || '';
        const full = gif?.images?.downsized_medium?.url || gif?.images?.fixed_width?.url || gif?.images?.original?.url || '';
        const title = esc(gif?.title || 'GIF');
        return `
          <div class="comm-gif-card">
            <img src="${still || full}" alt="${title}" />
            <div class="comm-gif-card-title">${title}</div>
            <button type="button" onclick="useGifResult('${full}','${title.replaceAll("'", '&#39;')}')">Use GIF</button>
          </div>
        `;
      }).join('');
    } catch (error) {
      status.textContent = `GIPHY search failed: ${error.message}`;
      grid.innerHTML = '';
    }
  };

  window.useGifResult = function(url, title) {
    const gif = { url, title: title || 'GIF' };
    if (gifTarget.type === 'thread') {
      threadGifDrafts[gifTarget.threadId || activeThreadId] = gif;
      renderThreadGifPreview(gifTarget.threadId || activeThreadId);
    } else {
      postGif = gif;
      renderPostGifPreview();
    }
    window.closeGifPicker();
  };

  window.clearPostGif = function() {
    postGif = null;
    renderPostGifPreview();
  };

  window.clearThreadGif = function(threadId) {
    delete threadGifDrafts[threadId];
    renderThreadGifPreview(threadId);
  };

  window.loadPodsAndChallenges = function() {
    try {
      const raw = localStorage.getItem(PODS_KEY);
      userPods = raw ? (JSON.parse(raw) || []) : starterPods();
    } catch (e) {
      userPods = starterPods();
    }
    try {
      userChallenges = JSON.parse(localStorage.getItem(CHALLENGES_KEY)) || [];
    } catch (e) {
      userChallenges = [];
    }
    try { localStorage.setItem(PODS_KEY, JSON.stringify(userPods)); } catch (e) {}
    try { localStorage.setItem(CHALLENGES_KEY, JSON.stringify(userChallenges)); } catch (e) {}
  };

  window.savePodsAndChallenges = function() {
    try { localStorage.setItem(PODS_KEY, JSON.stringify(userPods)); } catch (e) {}
    try { localStorage.setItem(CHALLENGES_KEY, JSON.stringify(userChallenges)); } catch (e) {}
  };

  window.loadCommPosts = function() {
    try {
      const saved = JSON.parse(localStorage.getItem(COMM_KEY));
      commPosts = Array.isArray(saved) ? saved.map((post) => ({ ...post, gif: post.gif || '', title: post.title || '' })) : [];
    } catch (e) {
      commPosts = [];
    }
  };

  window.saveCommPosts = function() {
    try { localStorage.setItem(COMM_KEY, JSON.stringify(commPosts)); } catch (e) {}
  };

  window.renderFeed = function() {
    const feed = document.getElementById('comm-feed');
    if (!feed) return;
    const filtered = commFilter === 'all' ? commPosts : commPosts.filter((post) => post.type === commFilter);
    if (!filtered.length) {
      feed.innerHTML = `<div style="text-align:center;padding:3rem 1rem;"><div style="font-size:2rem;margin-bottom:.75rem;">+</div><div style="font-size:.85rem;font-weight:600;color:var(--ink);margin-bottom:.35rem;">${commFilter === 'all' ? 'Nothing posted yet.' : 'No ' + commFilter + ' posts yet.'}</div><div style="font-size:.72rem;color:var(--muted);">Be the first to share a win, ask for support, or drop a GIF into the room.</div></div>`;
      return;
    }
    const badges = { win: ['badge-win', 'Win'], goal: ['badge-goal', 'Goal'], update: ['badge-update', 'Update'], support: ['badge-support', 'Support'], question: ['badge-question', 'Question'] };
    feed.innerHTML = filtered.map((post, index) => {
      const [badgeClass, badgeLabel] = badges[post.type] || badges.update;
      return `
        <div class="comm-post" style="animation-delay:${index * 0.06}s">
          <div class="comm-post-header">
            <div class="comm-post-avatar" style="background:${post.color || 'linear-gradient(135deg,var(--teal),var(--teal-light))'}">${post.initials || '?'}</div>
            <div class="comm-post-meta">
              <div class="comm-post-name">${esc(post.author)}<span style="font-size:.58rem;color:var(--muted);font-weight:400;margin-left:.3rem;">${esc(post.handle || '')}</span></div>
              <div class="comm-post-time">${esc(post.time || 'just now')}</div>
            </div>
            <span class="comm-post-badge ${badgeClass}">${badgeLabel}</span>
          </div>
          <div class="comm-post-body">${fmtText(post.body)}</div>
          ${post.gif ? `<div class="comm-post-media"><img src="${post.gif}" alt="${esc(post.title || 'GIF')}" /></div>` : ''}
          <div class="comm-post-actions">
            <button class="comm-action-btn ${post.liked ? 'liked' : ''}" onclick="toggleLike('${post.id}',this)"><span class="comm-action-icon">${post.liked ? '♥' : '♡'}</span> ${post.likes}</button>
            <button class="comm-action-btn"><span class="comm-action-icon">💬</span> ${post.comments}</button>
            <button class="comm-action-btn" onclick="safeShowToast('Copied. Share the momentum.')"><span class="comm-action-icon">↗</span> Share</button>
          </div>
        </div>
      `;
    }).join('');
  };

  window.submitPost = function() {
    const text = document.getElementById('comm-compose-text')?.value.trim() || '';
    if (!text && !postGif?.url) return;
    if (typeof loadCommProfile === 'function') loadCommProfile();
    const name = commProfile.name || getCurrentUserName();
    const color = commProfile.color || '#0A7266';
    commPosts.unshift({
      id: `post-${Date.now()}`,
      author: name,
      handle: commProfile.handle || ('@' + name.toLowerCase().replace(/\s+/g, '')),
      initials: name.charAt(0).toUpperCase(),
      color: `linear-gradient(135deg,${color},${color}bb)`,
      type: selectedPostType,
      body: text,
      gif: postGif?.url || '',
      title: postGif?.title || '',
      time: 'just now',
      likes: 0,
      liked: false,
      comments: 0,
      createdAt: new Date().toISOString(),
    });
    window.saveCommPosts();
    const composer = document.getElementById('comm-compose-text');
    if (composer) composer.value = '';
    const count = document.getElementById('comm-char-count');
    if (count) count.textContent = '0 / 500';
    window.clearPostGif();
    window.renderFeed();
    window.updateCommProfile();
    safeShowToast('Posted to the Community.');
  };

  window.updateCommProfile = function() {
    if (typeof loadCommProfile === 'function') loadCommProfile();
    window.loadPodsAndChallenges();
    const name = commProfile.name || getCurrentUserName();
    const handle = commProfile.handle || ('@' + name.toLowerCase().replace(/\s+/g, ''));
    const color = commProfile.color || '#0A7266';
    const initial = name.charAt(0).toUpperCase();
    const gradient = `linear-gradient(135deg,${color},${color}bb)`;
    const avatar = document.getElementById('comm-avatar');
    if (avatar) { avatar.textContent = initial; avatar.style.background = gradient; }
    const composerAvatar = document.getElementById('comm-composer-av');
    if (composerAvatar) { composerAvatar.textContent = initial; composerAvatar.style.background = gradient; }
    const profileName = document.getElementById('comm-profile-name');
    if (profileName) profileName.textContent = name;
    const profileHandle = document.getElementById('comm-profile-handle');
    if (profileHandle) profileHandle.textContent = handle;
    const postsCount = document.getElementById('comm-posts-count');
    if (postsCount) postsCount.textContent = commPosts.filter((post) => post.author === name).length;
    const podsCount = document.getElementById('comm-pods-count');
    if (podsCount) podsCount.textContent = userPods.length;
  };

  window.renderMessagesView = function(container) {
    loadThreads();
    const active = activeThread() || threads[0] || null;
    if (active && !activeThreadId) activeThreadId = active.id;
    const filtered = threads.filter((thread) => `${thread.name} ${thread.subtitle} ${threadSnippet(thread)}`.toLowerCase().includes((messageSearch || '').toLowerCase()));
    const listMarkup = filtered.length ? filtered.map((thread) => `
      <button class="comm-thread-item ${thread.id === activeThreadId ? 'active' : ''}" type="button" onclick="selectMessageThread('${thread.id}')">
        <div class="comm-thread-avatar">${esc(thread.emoji || thread.name.charAt(0).toUpperCase())}</div>
        <div class="comm-thread-copy">
          <div class="comm-thread-name-row">
            <div class="comm-thread-name">${esc(thread.name)}</div>
            <div class="comm-thread-time">${esc(relTime(thread.messages[thread.messages.length - 1]?.createdAt))}</div>
          </div>
          <div class="comm-thread-sub">${esc(thread.subtitle || '')}</div>
          <div class="comm-thread-snippet">${esc(threadSnippet(thread))}</div>
        </div>
      </button>
    `).join('') : `<div class="comm-empty-state"><div class="comm-empty-icon">...</div><div style="font-size:.82rem;font-weight:600;color:var(--ink);margin-bottom:.3rem">No conversations found</div><div>Try a different search or open a new thread from the right panel.</div></div>`;
    const paneMarkup = active ? `
      <div class="comm-thread-pane-head">
        <div class="comm-thread-pane-title">
          <div class="comm-thread-avatar">${esc(active.emoji || active.name.charAt(0).toUpperCase())}</div>
          <div>
            <div class="comm-thread-pane-name">${esc(active.name)}</div>
            <div class="comm-thread-pane-sub">${esc(active.subtitle || '')}</div>
          </div>
        </div>
        <button class="comm-thread-pane-action" type="button" onclick="openDM('${escAttr(active.name)}','${escAttr(active.emoji || '')}')">Pop Out</button>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${(active.messages || []).map(messageMarkup).join('')}</div></div>
      <div class="comm-thread-compose">
        <textarea id="comm-message-input" placeholder="Send a message into this thread..."></textarea>
        <div class="comm-gif-preview-row" id="comm-thread-gif-preview"></div>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-tools">
            <button class="comm-gif-trigger" type="button" onclick="openGifPicker('thread')">GIF</button>
            <span class="comm-char-count">${esc(active.type === 'pod' ? 'Pod thread' : 'Direct message')}</span>
          </div>
          <button class="comm-thread-send" type="button" onclick="sendThreadMessageFromView()">Send</button>
        </div>
      </div>
    ` : `<div class="comm-thread-empty"><div><strong>No conversation selected</strong>Open a pod or person from the thread list to start messaging.</div></div>`;
    container.innerHTML = `
      <div class="comm-view-panel comm-messages-shell">
        <div class="comm-messages-layout">
          <div class="comm-thread-sidebar">
            <div class="comm-thread-sidebar-head">
              <div class="comm-view-title">Messages</div>
              <div class="comm-view-sub">Your pods and direct threads live here now.</div>
              <input class="comm-thread-search" value="${escAttr(messageSearch)}" placeholder="Search conversations..." oninput="filterMessageThreads(this.value)" />
            </div>
            <div class="comm-thread-list">${listMarkup}</div>
          </div>
          <div class="comm-thread-pane">${paneMarkup}</div>
        </div>
      </div>
      ${BACK_BTN}
    `;
    if (active) renderThreadGifPreview(active.id);
  };

  window.filterMessageThreads = function(value) {
    messageSearch = value || '';
    rerenderMessagesIfVisible();
  };

  window.selectMessageThread = function(threadId) {
    activeThreadId = threadId;
    rerenderMessagesIfVisible();
    renderPanel();
  };

  function renderPanel() {
    const panel = document.getElementById('comm-dm-panel');
    const thread = activeThread();
    if (!panel || !thread) return;
    panel.innerHTML = `
      <div class="comm-dm-head">
        <div class="comm-dm-head-main">
          <div class="comm-thread-avatar">${esc(thread.emoji || thread.name.charAt(0).toUpperCase())}</div>
          <div class="comm-dm-head-copy">
            <div class="comm-dm-head-title">${esc(thread.name)}</div>
            <div class="comm-dm-head-sub">${esc(thread.subtitle || '')}</div>
          </div>
        </div>
        <button class="comm-dm-link" type="button" onclick="switchCommView('messages');closeDM()">Inbox</button>
        <button class="comm-dm-close" type="button" onclick="closeDM()">X</button>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${(thread.messages || []).map(messageMarkup).join('')}</div></div>
      <div class="comm-thread-compose">
        <div class="comm-gif-preview-row" id="dm-gif-preview"></div>
        <textarea id="dm-input" placeholder="Send a message..."></textarea>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-tools">
            <button class="comm-gif-trigger" type="button" onclick="openGifPicker('thread')">GIF</button>
            <span class="comm-char-count">${esc(thread.type === 'pod' ? 'Pod thread' : 'Direct message')}</span>
          </div>
          <button class="comm-thread-send" type="button" onclick="sendDM()">Send</button>
        </div>
      </div>
    `;
    renderThreadGifPreview(thread.id);
  }

  function sendThreadMessage(inputId) {
    const thread = activeThread();
    const input = document.getElementById(inputId);
    const text = input?.value.trim() || '';
    const gif = threadGifDrafts[thread?.id];
    if (!thread || (!text && !gif?.url)) return;
    thread.messages.push({ id: `msg-${Date.now()}`, sender: commProfile.name || getCurrentUserName(), mine: true, text, gif: gif?.url || '', title: gif?.title || '', createdAt: new Date().toISOString() });
    saveThreads();
    if (input) input.value = '';
    delete threadGifDrafts[thread.id];
    rerenderMessagesIfVisible();
    renderPanel();
  }

  window.openDM = function(name, emoji) {
    ensureStyles();
    ensureTopLevel();
    const thread = ensureThread(name, emoji, { type: name === 'CEO Squad' ? 'pod' : 'dm', subtitle: name === 'CEO Squad' ? 'You + 3' : 'Direct message' });
    activeThreadId = thread.id;
    const panel = document.getElementById('comm-dm-panel');
    if (!panel) return;
    renderPanel();
    panel.classList.add('open');
    dmOpen = true;
    rerenderMessagesIfVisible();
    setTimeout(() => document.getElementById('dm-input')?.focus(), 50);
  };

  window.closeDM = function() {
    document.getElementById('comm-dm-panel')?.classList.remove('open');
    dmOpen = false;
  };

  window.sendDM = function() { sendThreadMessage('dm-input'); };
  window.sendThreadMessageFromView = function() { sendThreadMessage('comm-message-input'); };

  window.submitCreatePod = function() {
    const name = document.getElementById('pod-name-input')?.value.trim();
    const emoji = document.getElementById('pod-emoji-input')?.value.trim() || '🤝';
    const desc = document.getElementById('pod-desc-input')?.value.trim() || '';
    if (!name) {
      safeShowToast('Give your pod a name first.');
      return;
    }
    window.loadPodsAndChallenges();
    if (!userPods.some((pod) => pod.name === name)) {
      userPods.unshift({ id: `pod-${Date.now()}`, name, emoji, desc, members: 1, createdAt: new Date().toISOString() });
      window.savePodsAndChallenges();
    }
    ensureThread(name, emoji, { id: `thread-${Date.now()}`, type: 'pod', subtitle: 'You + 0', messages: [{ sender: name, mine: false, text: `Welcome to ${name}. Drop the first goal so the pod has a starting line.`, createdAt: new Date().toISOString() }] });
    if (typeof closeCreatePod === 'function') closeCreatePod();
    window.updateCommProfile();
    safeShowToast(`Pod "${name}" created.`);
    if (typeof switchCommView === 'function') switchCommView('pods');
    window.openDM(name, emoji);
  };

  window.joinPod = function(name) {
    window.loadPodsAndChallenges();
    const details = {
      'Creative Builders': { emoji: '✦', desc: 'Built for creators shipping ideas into the world.', members: 5 },
      'Paralegal Prep': { emoji: '⚖', desc: 'Study structure, accountability, and prep notes.', members: 2 },
      'Side Hustle Stack': { emoji: '💰', desc: 'Money moves, offers, and momentum.', members: 8 },
    }[name] || { emoji: '🤝', desc: 'Accountability pod', members: 2 };
    if (!userPods.some((pod) => pod.name === name)) {
      userPods.unshift({ id: `pod-${Date.now()}`, name, emoji: details.emoji, desc: details.desc, members: details.members, createdAt: new Date().toISOString() });
      window.savePodsAndChallenges();
    }
    ensureThread(name, details.emoji, { type: 'pod', subtitle: `You + ${Math.max(0, details.members - 1)}` });
    window.updateCommProfile();
    safeShowToast(`Joined ${name}.`);
    if (typeof switchCommView === 'function') switchCommView('pods');
  };

  window.applyGifSuggestion = function(term) {
    const input = document.getElementById('comm-gif-search');
    if (input) input.value = term || '';
    window.searchGifPicker();
  };

  window.setMessageFilter = function(filter) {
    messageFilter = filter || 'all';
    rerenderMessagesIfVisible();
  };

  window.updateThreadDraft = function(threadId, value) {
    if (!threadId) return;
    if (value && value.trim()) threadDrafts[threadId] = value;
    else delete threadDrafts[threadId];
    saveDrafts();
  };

  window.toggleThreadPin = function(threadId) {
    loadThreads();
    const thread = getThread(threadId);
    if (!thread) return;
    thread.pinned = !thread.pinned;
    saveThreads();
    rerenderMessagesIfVisible();
    renderPanel();
  };

  function messageMarkup(message) {
    return `
      <div class="comm-thread-msg ${message.mine ? 'mine' : 'theirs'}">
        ${message.text ? `<div class="comm-thread-bubble">${fmtText(message.text)}</div>` : ''}
        ${message.gif ? `<img class="comm-thread-media" src="${message.gif}" alt="${esc(message.title || 'GIF')}" />` : ''}
        <div class="comm-thread-meta">${esc(message.sender)} | ${esc(clockTime(message.createdAt))}</div>
      </div>
    `;
  }

  function renderPanel() {
    loadThreads();
    const panel = document.getElementById('comm-dm-panel');
    const thread = activeThread();
    if (!panel || !thread) return;
    markThreadRead(thread.id);
    const draft = threadDrafts[thread.id] || '';
    panel.innerHTML = `
      <div class="comm-dm-head">
        <div class="comm-dm-head-main">
          <div class="comm-thread-avatar">${esc(thread.emoji || thread.name.charAt(0).toUpperCase())}</div>
          <div class="comm-dm-head-copy">
            <div class="comm-dm-head-title">${esc(thread.name)}</div>
            <div class="comm-dm-head-sub">${esc(thread.subtitle || '')}</div>
            <div class="comm-thread-pane-meta">
              <span class="comm-thread-chip">${esc(threadTypeLabel(thread))}</span>
              <span class="comm-thread-chip soft">${esc(threadMembersLabel(thread))}</span>
              <span class="comm-thread-chip ${thread.online ? '' : 'soft'}">${esc(threadPresenceLabel(thread))}</span>
            </div>
          </div>
        </div>
        <button class="comm-dm-link" type="button" onclick="switchCommView('messages');closeDM()">Inbox</button>
        <button class="comm-dm-close" type="button" onclick="closeDM()">X</button>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${(thread.messages || []).map(messageMarkup).join('')}</div></div>
      <div class="comm-thread-compose">
        <div class="comm-gif-preview-row" id="dm-gif-preview"></div>
        <textarea id="dm-input" placeholder="Send a message..." oninput="updateThreadDraft('${thread.id}', this.value)">${esc(draft)}</textarea>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-tools">
            <button class="comm-gif-trigger" type="button" onclick="openGifPicker('thread')">GIF</button>
            <span class="comm-char-count">${esc(thread.role || threadTypeLabel(thread))}</span>
          </div>
          <button class="comm-thread-send" type="button" onclick="sendDM()">Send</button>
        </div>
        <div class="comm-thread-draft-note">${draft ? 'Draft saved for this thread.' : 'Send text, a GIF, or both.'}</div>
      </div>
    `;
    renderThreadGifPreview(thread.id);
  }

  function sendThreadMessage(inputId) {
    const thread = activeThread();
    const input = document.getElementById(inputId);
    const text = input?.value.trim() || '';
    const gif = threadGifDrafts[thread?.id];
    if (!thread || (!text && !gif?.url)) return;
    if (typeof loadCommProfile === 'function') loadCommProfile();
    thread.messages.push({
      id: `msg-${Date.now()}`,
      sender: commProfile.name || getCurrentUserName(),
      mine: true,
      text,
      gif: gif?.url || '',
      title: gif?.title || '',
      createdAt: new Date().toISOString()
    });
    thread.unread = 0;
    saveThreads();
    if (input) input.value = '';
    delete threadDrafts[thread.id];
    saveDrafts();
    delete threadGifDrafts[thread.id];
    rerenderMessagesIfVisible();
    renderPanel();
  }

  window.filterMessageThreads = function(value) {
    messageSearch = value || '';
    rerenderMessagesIfVisible();
  };

  window.selectMessageThread = function(threadId) {
    activeThreadId = threadId;
    markThreadRead(threadId);
    rerenderMessagesIfVisible();
    renderPanel();
  };

  window.renderMessagesView = function(container) {
    loadThreads();
    const visibleThreads = filteredThreads();
    if (!activeThreadId || !visibleThreads.some((thread) => thread.id === activeThreadId)) {
      activeThreadId = visibleThreads[0]?.id || '';
    }
    const active = activeThread();
    if (active) markThreadRead(active.id);

    const totalThreads = threads.length;
    const podThreads = threads.filter((thread) => thread.type === 'pod').length;
    const directThreads = threads.filter((thread) => thread.type !== 'pod').length;
    const unreadThreads = unreadTotal();

    const listMarkup = visibleThreads.length ? visibleThreads.map((thread) => `
      <button class="comm-thread-item ${thread.id === activeThreadId ? 'active' : ''}" type="button" onclick="selectMessageThread('${thread.id}')">
        <div class="comm-thread-avatar">${esc(thread.emoji || thread.name.charAt(0).toUpperCase())}</div>
        <div class="comm-thread-copy">
          <div class="comm-thread-name-row">
            <div class="comm-thread-name-wrap">
              <div class="comm-thread-name">${esc(thread.name)}</div>
              <div class="comm-thread-sub">${esc(thread.subtitle || '')}</div>
            </div>
            <div class="comm-thread-badges">
              ${thread.pinned ? '<span class="comm-thread-pin">Pinned</span>' : ''}
              ${thread.unread ? `<span class="comm-thread-unread">${thread.unread}</span>` : ''}
              <div class="comm-thread-time">${esc(relTime(lastMessageAt(thread)))}</div>
            </div>
          </div>
          <div class="comm-thread-chip-row">
            <span class="comm-thread-chip">${esc(threadTypeLabel(thread))}</span>
            <span class="comm-thread-chip soft">${esc(threadMembersLabel(thread))}</span>
            <span class="comm-thread-chip ${thread.online ? '' : 'soft'}">${esc(threadPresenceLabel(thread))}</span>
            ${thread.role ? `<span class="comm-thread-chip soft">${esc(thread.role)}</span>` : ''}
          </div>
          <div class="comm-thread-snippet">${esc(threadSnippet(thread))}</div>
        </div>
      </button>
    `).join('') : `<div class="comm-empty-state"><div class="comm-empty-icon">...</div><div style="font-size:.82rem;font-weight:600;color:var(--ink);margin-bottom:.3rem">No conversations found</div><div>Try a different filter or open a new thread from the Community.</div></div>`;

    const paneMarkup = active ? `
      <div class="comm-thread-pane-head">
        <div class="comm-thread-pane-copy">
          <div class="comm-thread-pane-title">
            <div class="comm-thread-avatar">${esc(active.emoji || active.name.charAt(0).toUpperCase())}</div>
            <div>
              <div class="comm-thread-pane-name">${esc(active.name)}</div>
              <div class="comm-thread-pane-sub">${esc(active.subtitle || '')}</div>
            </div>
          </div>
          <div class="comm-thread-pane-meta">
            <span class="comm-thread-chip">${esc(threadTypeLabel(active))}</span>
            <span class="comm-thread-chip soft">${esc(threadMembersLabel(active))}</span>
            <span class="comm-thread-chip ${active.online ? '' : 'soft'}">${esc(threadPresenceLabel(active))}</span>
            ${active.role ? `<span class="comm-thread-chip soft">${esc(active.role)}</span>` : ''}
          </div>
        </div>
        <div class="comm-thread-pane-actions">
          <button class="comm-thread-pane-action" type="button" onclick="toggleThreadPin('${active.id}')">${active.pinned ? 'Unpin' : 'Pin'}</button>
          <button class="comm-thread-pane-action" type="button" onclick="openDM('${escAttr(active.name)}','${escAttr(active.emoji || '')}')">Pop Out</button>
        </div>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${(active.messages || []).map(messageMarkup).join('')}</div></div>
      <div class="comm-thread-compose">
        <textarea id="comm-message-input" placeholder="Send a message into this thread..." oninput="updateThreadDraft('${active.id}', this.value)">${esc(threadDrafts[active.id] || '')}</textarea>
        <div class="comm-gif-preview-row" id="comm-thread-gif-preview"></div>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-tools">
            <button class="comm-gif-trigger" type="button" onclick="openGifPicker('thread')">GIF</button>
            <span class="comm-char-count">${esc(active.role || threadTypeLabel(active))}</span>
          </div>
          <button class="comm-thread-send" type="button" onclick="sendThreadMessageFromView()">Send</button>
        </div>
        <div class="comm-thread-draft-note">${threadDrafts[active.id] ? 'Draft saved for this thread.' : 'Send text, a GIF, or both.'}</div>
      </div>
    ` : `<div class="comm-thread-empty"><div><strong>No conversation selected</strong><div>Open a pod or person from the thread list to start messaging.</div></div></div>`;

    container.innerHTML = `
      <div class="comm-view-panel comm-messages-shell">
        <div class="comm-messages-layout">
          <div class="comm-thread-sidebar">
            <div class="comm-thread-sidebar-head">
              <div class="comm-view-title">Messages</div>
              <div class="comm-view-sub">Pods, direct messages, unread follow-ups, and saved drafts all live here.</div>
              <input class="comm-thread-search" value="${escAttr(messageSearch)}" placeholder="Search conversations..." oninput="filterMessageThreads(this.value)" />
              <div class="comm-thread-filter-row">
                <button class="comm-thread-filter ${messageFilter === 'all' ? 'active' : ''}" type="button" onclick="setMessageFilter('all')">All <span class="comm-thread-filter-count">${totalThreads}</span></button>
                <button class="comm-thread-filter ${messageFilter === 'pods' ? 'active' : ''}" type="button" onclick="setMessageFilter('pods')">Pods <span class="comm-thread-filter-count">${podThreads}</span></button>
                <button class="comm-thread-filter ${messageFilter === 'dms' ? 'active' : ''}" type="button" onclick="setMessageFilter('dms')">Direct <span class="comm-thread-filter-count">${directThreads}</span></button>
                <button class="comm-thread-filter ${messageFilter === 'unread' ? 'active' : ''}" type="button" onclick="setMessageFilter('unread')">Unread <span class="comm-thread-filter-count">${unreadThreads}</span></button>
              </div>
              <div class="comm-thread-overview">
                <div class="comm-thread-overview-card">
                  <div class="comm-thread-overview-label">Unread</div>
                  <div class="comm-thread-overview-value">${unreadThreads}</div>
                </div>
                <div class="comm-thread-overview-card">
                  <div class="comm-thread-overview-label">Pod Threads</div>
                  <div class="comm-thread-overview-value">${podThreads}</div>
                </div>
                <div class="comm-thread-overview-card">
                  <div class="comm-thread-overview-label">Direct</div>
                  <div class="comm-thread-overview-value">${directThreads}</div>
                </div>
              </div>
            </div>
            <div class="comm-thread-list">${listMarkup}</div>
          </div>
          <div class="comm-thread-pane">${paneMarkup}</div>
        </div>
      </div>
      ${BACK_BTN}
    `;

    if (active) renderThreadGifPreview(active.id);
  };

  window.openDM = function(name, emoji) {
    ensureStyles();
    ensureTopLevel();
    const thread = ensureThread(name, emoji, {
      type: name === 'CEO Squad' ? 'pod' : 'dm',
      subtitle: name === 'CEO Squad' ? 'You + 3' : 'Direct message',
      members: name === 'CEO Squad' ? 4 : 2,
      role: name === 'CEO Squad' ? 'Accountability pod' : 'Direct message'
    });
    activeThreadId = thread.id;
    markThreadRead(thread.id);
    const panel = document.getElementById('comm-dm-panel');
    if (!panel) return;
    renderPanel();
    panel.classList.add('open');
    dmOpen = true;
    rerenderMessagesIfVisible();
    setTimeout(() => document.getElementById('dm-input')?.focus(), 50);
  };

  window.submitCreatePod = function() {
    const name = document.getElementById('pod-name-input')?.value.trim();
    const emoji = document.getElementById('pod-emoji-input')?.value.trim() || 'POD';
    const desc = document.getElementById('pod-desc-input')?.value.trim() || '';
    if (!name) {
      safeShowToast('Give your pod a name first.');
      return;
    }
    window.loadPodsAndChallenges();
    if (!userPods.some((pod) => pod.name === name)) {
      userPods.unshift({ id: `pod-${Date.now()}`, name, emoji, desc, members: 1, createdAt: new Date().toISOString() });
      window.savePodsAndChallenges();
    }
    ensureThread(name, emoji, {
      id: `thread-${Date.now()}`,
      type: 'pod',
      subtitle: 'You + 0',
      members: 1,
      role: 'New pod',
      messages: [{ sender: name, mine: false, text: `Welcome to ${name}. Drop the first goal so the pod has a starting line.`, createdAt: new Date().toISOString() }]
    });
    if (typeof closeCreatePod === 'function') closeCreatePod();
    window.updateCommProfile();
    safeShowToast(`Pod "${name}" created.`);
    if (typeof switchCommView === 'function') switchCommView('pods');
    window.openDM(name, emoji);
  };

  window.joinPod = function(name) {
    window.loadPodsAndChallenges();
    const details = {
      'Creative Builders': { emoji: 'CB', desc: 'Built for creators shipping ideas into the world.', members: 5, role: 'Creative pod' },
      'Paralegal Prep': { emoji: 'PP', desc: 'Study structure, accountability, and prep notes.', members: 2, role: 'Study pod' },
      'Side Hustle Stack': { emoji: 'SH', desc: 'Money moves, offers, and momentum.', members: 8, role: 'Business pod' },
    }[name] || { emoji: 'POD', desc: 'Accountability pod', members: 2, role: 'Community pod' };
    if (!userPods.some((pod) => pod.name === name)) {
      userPods.unshift({ id: `pod-${Date.now()}`, name, emoji: details.emoji, desc: details.desc, members: details.members, createdAt: new Date().toISOString() });
      window.savePodsAndChallenges();
    }
    ensureThread(name, details.emoji, { type: 'pod', subtitle: `You + ${Math.max(0, details.members - 1)}`, members: details.members, role: details.role, unread: 1 });
    window.updateCommProfile();
    safeShowToast(`Joined ${name}.`);
    if (typeof switchCommView === 'function') switchCommView('pods');
  };

  window.initCommunity = function() {
    ensureStyles();
    ensureComposer();
    ensureGifModal();
    ensureTopLevel();
    window.loadCommPosts();
    window.loadPodsAndChallenges();
    loadThreads();
    loadDrafts();
    if (typeof loadCommProfile === 'function') loadCommProfile();
    window.updateCommProfile();
    if (typeof loadChallengeState === 'function') loadChallengeState();
    commFilter = 'all';
    messageSearch = '';
    messageFilter = 'all';
    renderPostGifPreview();
    document.querySelectorAll('.comm-feed-tab').forEach((button, index) => button.classList.toggle('active', index === 0));
    document.querySelectorAll('.comm-nav-item').forEach((item, index) => item.classList.toggle('active', index === 0));
    const feedTabsRow = document.querySelector('.comm-feed-tabs');
    const composerEl = document.querySelector('.comm-composer');
    const feedEl = document.getElementById('comm-feed');
    if (feedTabsRow) feedTabsRow.style.display = 'flex';
    if (composerEl) composerEl.style.display = 'block';
    if (feedEl) feedEl.style.display = 'block';
    document.getElementById('comm-view-panel-container')?.remove();
    window.renderFeed();
    renderPanel();
    const hash = String(window.location.hash || '').toLowerCase();
    if (hash.includes('community-messages-debug') && typeof switchCommView === 'function') {
      switchCommView('messages');
    }
    if (hash.includes('community-dm-debug')) {
      window.openDM('Bella P', '👑');
    }
    if (hash.includes('community-gif-debug')) {
      window.openGifPicker('post');
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey && document.activeElement?.id === 'comm-message-input') {
      event.preventDefault();
      window.sendThreadMessageFromView();
    }
    if (event.key === 'Enter' && !event.shiftKey && document.activeElement?.id === 'dm-input') {
      event.preventDefault();
      window.sendDM();
    }
    if (event.key === 'Enter' && document.activeElement?.id === 'comm-gif-search') {
      event.preventDefault();
      window.searchGifPicker();
    }
  });

  document.addEventListener('click', (event) => {
    if (event.target.id === 'comm-gif-overlay') window.closeGifPicker();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      setTimeout(window.initCommunity, 30);
    });
  } else {
    setTimeout(window.initCommunity, 30);
  }
})();
