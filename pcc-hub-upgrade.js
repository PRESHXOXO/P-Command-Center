(function() {
  if (typeof HUB_TEMPLATES === 'undefined') return;
  const HUB_STYLE_THEMES = {
    editorial: {
      label: 'Editorial',
      kicker: 'Polished',
      description: 'Glossy, poised, and airy. Think luxury notes with clean structure.',
    },
    aurora: {
      label: 'Aurora',
      kicker: 'Dreamy',
      description: 'Soft glow, layered gradients, and luminous glass panels.',
    },
    confetti: {
      label: 'Confetti',
      kicker: 'Playful',
      description: 'Celebratory dots, bold cards, and bright energy without losing elegance.',
    },
  };
  let selectedHubStyleTheme = 'editorial';

  HUB_TEMPLATES.blank.description = 'A clean canvas with one big flexible workspace.';
  HUB_TEMPLATES.planner.description = 'Built for priorities, milestones, and the next move.';
  HUB_TEMPLATES.tracker.description = 'Designed for metrics, check-ins, and momentum.';

  function ensureHubUpgradeStyles() {
    if (document.getElementById('pcc-hub-upgrade-styles')) return;
    const style = document.createElement('style');
    style.id = 'pcc-hub-upgrade-styles';
    style.textContent = `
      .custom-hub-template-card{overflow:hidden;padding:.88rem;}
      .custom-hub-template-card.active{transform:translateY(-2px);}
      .custom-hub-template-visual{display:grid;gap:.5rem;background:linear-gradient(145deg,color-mix(in srgb,var(--surface2) 92%, #fff),color-mix(in srgb,var(--tint) 68%, #fff));border:1px solid var(--teal-border);border-radius:14px;padding:.75rem;min-height:110px;margin-bottom:.7rem;}
      .custom-hub-template-visual.blank{grid-template-rows:auto 1fr;}
      .custom-hub-template-visual.planner{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:auto 1fr;}
      .custom-hub-template-visual.tracker{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:auto auto 1fr;}
      .custom-hub-template-mini-hero{grid-column:1 / -1;border-radius:12px;padding:.68rem .72rem;background:linear-gradient(135deg,color-mix(in srgb,var(--teal) 22%, #fff),color-mix(in srgb,var(--teal-light) 24%, #fff));}
      .custom-hub-template-mini-kicker{font-size:.42rem;font-weight:700;letter-spacing:.18em;text-transform:uppercase;color:var(--teal);margin-bottom:.2rem;}
      .custom-hub-template-mini-title{font-family:'Cormorant Garamond',serif;font-size:1rem;line-height:1.05;color:var(--ink);}
      .custom-hub-template-mini-card{border-radius:12px;border:1px solid var(--teal-border);background:var(--surface2);padding:.6rem;}
      .custom-hub-template-mini-label{font-size:.42rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--teal);margin-bottom:.28rem;}
      .custom-hub-template-mini-lines{display:grid;gap:.22rem;}
      .custom-hub-template-mini-line{height:6px;border-radius:999px;background:rgba(var(--teal-rgb),0.14);}
      .custom-hub-template-mini-line.long{width:100%;}
      .custom-hub-template-mini-line.mid{width:74%;}
      .custom-hub-template-mini-line.short{width:48%;}
      .custom-hub-template-mini-stat{display:grid;place-items:center;border-radius:12px;border:1px solid var(--teal-border);background:var(--surface2);padding:.55rem;}
      .custom-hub-template-mini-num{font-family:'Cormorant Garamond',serif;font-size:1rem;line-height:1;color:var(--ink);}
      .custom-hub-template-mini-sub{font-size:.42rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-top:.2rem;}
      .custom-hub-template-mini-progress{grid-column:1 / -1;border-radius:12px;border:1px solid var(--teal-border);background:var(--surface2);padding:.6rem;}
      .custom-hub-template-mini-track{height:7px;border-radius:999px;background:rgba(var(--teal-rgb),0.12);overflow:hidden;margin-top:.35rem;}
      .custom-hub-template-mini-fill{height:100%;width:58%;border-radius:999px;background:linear-gradient(90deg,var(--teal),var(--teal-light));}
      .custom-hub-style-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.75rem;margin-top:.12rem;}
      .custom-hub-style-card{overflow:hidden;padding:.88rem;text-align:left;border:1px solid var(--teal-border);border-radius:16px;background:var(--surface2);cursor:pointer;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease;}
      .custom-hub-style-card:hover{transform:translateY(-2px);box-shadow:var(--shadow-sm);border-color:color-mix(in srgb,var(--teal) 32%, transparent);}
      .custom-hub-style-card.active{transform:translateY(-2px);box-shadow:var(--shadow);border-color:color-mix(in srgb,var(--teal) 42%, transparent);}
      .custom-hub-style-visual{position:relative;min-height:118px;border-radius:16px;padding:.75rem;display:grid;gap:.45rem;overflow:hidden;margin-bottom:.7rem;}
      .custom-hub-style-visual::before{content:'';position:absolute;inset:0;background:var(--hub-shell-bg,linear-gradient(145deg,var(--surface2),var(--tint)));opacity:.98;pointer-events:none;}
      .custom-hub-style-visual::after{content:'';position:absolute;inset:0;background:var(--hub-decor-a,transparent);pointer-events:none;opacity:.95;}
      .custom-hub-style-visual > *{position:relative;z-index:1;}
      .custom-hub-style-head{display:flex;align-items:center;justify-content:space-between;gap:.45rem;}
      .custom-hub-style-pill{display:inline-flex;align-items:center;justify-content:center;padding:.18rem .5rem;border-radius:999px;border:1px solid color-mix(in srgb,var(--teal) 24%, transparent);background:color-mix(in srgb,var(--surface2) 85%, transparent);font-size:.42rem;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--teal);}
      .custom-hub-style-pill.soft{color:var(--muted);letter-spacing:.12em;}
      .custom-hub-style-panels{display:grid;gap:.45rem;grid-template-columns:repeat(2,minmax(0,1fr));}
      .custom-hub-style-panel{border-radius:14px;min-height:28px;border:1px solid var(--hub-card-border,var(--teal-border));background:var(--hub-card-bg,var(--surface2));box-shadow:0 8px 24px rgba(var(--teal-rgb),0.06);}
      .custom-hub-style-panel.hero{grid-column:1 / -1;min-height:42px;background:var(--hub-hero-bg,var(--tint));}
      .custom-hub-style-panel.short{min-height:22px;}
      .custom-hub-style-panel.dots{position:relative;overflow:hidden;}
      .custom-hub-style-panel.dots::after{content:'';position:absolute;inset:0;background:radial-gradient(circle at 18% 40%, rgba(var(--teal-rgb),0.18) 0 2px, transparent 2px),radial-gradient(circle at 55% 62%, rgba(var(--teal-rgb),0.15) 0 2px, transparent 2px),radial-gradient(circle at 82% 28%, rgba(var(--teal-rgb),0.12) 0 2px, transparent 2px);background-size:48px 32px;}
      .custom-hub-themeable,.hub-preview-shell{position:relative;overflow:hidden;background:var(--hub-shell-bg,var(--surface2));border:1px solid var(--hub-card-border,var(--teal-border));box-shadow:var(--shadow);}
      .custom-hub-themeable::before,.hub-preview-shell::before{content:'';position:absolute;inset:0;background:var(--hub-decor-a,transparent);pointer-events:none;opacity:.95;}
      .custom-hub-themeable::after,.hub-preview-shell::after{content:'';position:absolute;left:8%;right:8%;bottom:0;height:1px;background:var(--hub-decor-b,linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.18),transparent));pointer-events:none;}
      .custom-hub-themeable > *, .hub-preview-shell > *{position:relative;z-index:1;}
      .custom-hub-themeable .custom-hub-hero,.hub-preview-shell .hub-preview-hero{background:var(--hub-hero-bg,var(--tint));border:1px solid var(--hub-card-border,var(--teal-border));box-shadow:0 14px 32px var(--hub-glow,rgba(var(--teal-rgb),0.08));}
      .custom-hub-themeable .custom-hub-rich-card,.custom-hub-themeable .custom-hub-micro,.hub-preview-shell .hub-preview-card{background:var(--hub-card-bg,var(--surface2));border:1px solid var(--hub-card-border,var(--teal-border));box-shadow:0 10px 24px rgba(var(--teal-rgb),0.06);}
      .custom-hub-themeable .custom-hub-chip{background:var(--hub-chip-bg,var(--tint));border-color:var(--hub-card-border,var(--teal-border));}
      .hub-look-editorial{
        --hub-shell-bg:
          linear-gradient(180deg,color-mix(in srgb,var(--surface2) 94%, #fff),color-mix(in srgb,var(--tint) 62%, #fff)),
          repeating-linear-gradient(180deg,rgba(var(--teal-rgb),0.03) 0 1px,transparent 1px 34px);
        --hub-hero-bg:linear-gradient(135deg,color-mix(in srgb,var(--teal-light) 18%, #fff),color-mix(in srgb,var(--surface2) 92%, #fff));
        --hub-card-bg:color-mix(in srgb,var(--surface2) 94%, #fff);
        --hub-card-border:color-mix(in srgb,var(--teal) 24%, transparent);
        --hub-chip-bg:color-mix(in srgb,var(--teal-light) 12%, #fff);
        --hub-glow:rgba(var(--teal-rgb),0.08);
        --hub-decor-a:linear-gradient(120deg,rgba(var(--teal-rgb),0.03) 0%,transparent 32%,rgba(var(--teal-rgb),0.05) 100%);
        --hub-decor-b:linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.18),transparent);
      }
      .hub-look-aurora{
        --hub-shell-bg:
          radial-gradient(circle at 12% 12%, rgba(var(--teal-rgb),0.18), transparent 34%),
          radial-gradient(circle at 88% 14%, rgba(var(--teal-rgb),0.10), transparent 28%),
          linear-gradient(145deg,color-mix(in srgb,var(--bg) 88%, var(--teal-light) 12%),color-mix(in srgb,var(--surface2) 90%, var(--teal) 10%));
        --hub-hero-bg:linear-gradient(135deg,color-mix(in srgb,var(--teal-light) 26%, #fff),color-mix(in srgb,var(--teal) 18%, #fff));
        --hub-card-bg:color-mix(in srgb,var(--surface2) 84%, rgba(var(--teal-rgb),0.08));
        --hub-card-border:color-mix(in srgb,var(--teal-light) 36%, transparent);
        --hub-chip-bg:rgba(var(--teal-rgb),0.12);
        --hub-glow:rgba(var(--teal-rgb),0.18);
        --hub-decor-a:radial-gradient(circle at 18% 32%, rgba(var(--teal-rgb),0.12), transparent 26%),radial-gradient(circle at 82% 18%, rgba(var(--teal-rgb),0.08), transparent 22%);
        --hub-decor-b:linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.26),transparent);
      }
      .hub-look-confetti{
        --hub-shell-bg:
          linear-gradient(150deg,color-mix(in srgb,var(--surface2) 90%, #fff),color-mix(in srgb,var(--tint) 72%, #fff)),
          radial-gradient(circle at 14% 16%, rgba(var(--teal-rgb),0.16) 0 4px, transparent 4px),
          radial-gradient(circle at 82% 22%, rgba(var(--teal-rgb),0.12) 0 5px, transparent 5px),
          radial-gradient(circle at 72% 78%, rgba(var(--teal-rgb),0.10) 0 4px, transparent 4px),
          radial-gradient(circle at 26% 72%, rgba(var(--teal-rgb),0.14) 0 3px, transparent 3px);
        --hub-hero-bg:linear-gradient(135deg,color-mix(in srgb,var(--teal-light) 30%, #fff),color-mix(in srgb,var(--teal) 14%, #fff));
        --hub-card-bg:color-mix(in srgb,var(--surface2) 92%, #fff);
        --hub-card-border:color-mix(in srgb,var(--teal) 28%, transparent);
        --hub-chip-bg:color-mix(in srgb,var(--teal-light) 16%, #fff);
        --hub-glow:rgba(var(--teal-rgb),0.12);
        --hub-decor-a:
          radial-gradient(circle at 12% 24%, rgba(var(--teal-rgb),0.14) 0 3px, transparent 3px),
          radial-gradient(circle at 85% 16%, rgba(var(--teal-rgb),0.10) 0 4px, transparent 4px),
          linear-gradient(120deg,transparent 0 44%, rgba(var(--teal-rgb),0.04) 44% 50%, transparent 50% 100%);
        --hub-decor-b:linear-gradient(90deg,transparent,rgba(var(--teal-rgb),0.22),transparent);
      }
      .hub-look-confetti .custom-hub-chip:nth-child(2){transform:translateY(-2px);}
      .hub-look-confetti .custom-hub-chip:nth-child(3){transform:translateY(2px);}
      .hub-look-aurora .custom-hub-hero,.hub-look-aurora .hub-preview-hero{backdrop-filter:blur(18px);}
      @media(max-width:860px){.custom-hub-style-grid{grid-template-columns:1fr;}}
    `;
    document.head.appendChild(style);
  }

  function pccRenderTemplateCard(templateKey) {
    const copy = HUB_TEMPLATES[templateKey] || HUB_TEMPLATES.blank;
    if (templateKey === 'planner') {
      return `
        <div class="custom-hub-template-visual planner">
          <div class="custom-hub-template-mini-hero">
            <div class="custom-hub-template-mini-kicker">Planner</div>
            <div class="custom-hub-template-mini-title">Priorities and milestones</div>
          </div>
          <div class="custom-hub-template-mini-card">
            <div class="custom-hub-template-mini-label">Vision</div>
            <div class="custom-hub-template-mini-lines">
              <div class="custom-hub-template-mini-line long"></div>
              <div class="custom-hub-template-mini-line mid"></div>
            </div>
          </div>
          <div class="custom-hub-template-mini-card">
            <div class="custom-hub-template-mini-label">Top Three</div>
            <div class="custom-hub-template-mini-lines">
              <div class="custom-hub-template-mini-line long"></div>
              <div class="custom-hub-template-mini-line mid"></div>
              <div class="custom-hub-template-mini-line short"></div>
            </div>
          </div>
        </div>
        <div class="custom-hub-template-name">Planner</div>
        <div class="custom-hub-template-desc">${escapeHtml(copy.description)}</div>
      `;
    }
    if (templateKey === 'tracker') {
      return `
        <div class="custom-hub-template-visual tracker">
          <div class="custom-hub-template-mini-hero">
            <div class="custom-hub-template-mini-kicker">Tracker</div>
            <div class="custom-hub-template-mini-title">Metrics with momentum</div>
          </div>
          <div class="custom-hub-template-mini-stat"><div class="custom-hub-template-mini-num">3</div><div class="custom-hub-template-mini-sub">Current</div></div>
          <div class="custom-hub-template-mini-stat"><div class="custom-hub-template-mini-num">10</div><div class="custom-hub-template-mini-sub">Target</div></div>
          <div class="custom-hub-template-mini-stat"><div class="custom-hub-template-mini-num">4</div><div class="custom-hub-template-mini-sub">Streak</div></div>
          <div class="custom-hub-template-mini-progress">
            <div class="custom-hub-template-mini-label">Progress</div>
            <div class="custom-hub-template-mini-track"><div class="custom-hub-template-mini-fill"></div></div>
          </div>
        </div>
        <div class="custom-hub-template-name">Tracker</div>
        <div class="custom-hub-template-desc">${escapeHtml(copy.description)}</div>
      `;
    }
    return `
      <div class="custom-hub-template-visual blank">
        <div class="custom-hub-template-mini-hero">
          <div class="custom-hub-template-mini-kicker">Blank</div>
          <div class="custom-hub-template-mini-title">Open workspace</div>
        </div>
        <div class="custom-hub-template-mini-card">
          <div class="custom-hub-template-mini-label">Canvas</div>
          <div class="custom-hub-template-mini-lines">
            <div class="custom-hub-template-mini-line long"></div>
            <div class="custom-hub-template-mini-line long"></div>
            <div class="custom-hub-template-mini-line mid"></div>
            <div class="custom-hub-template-mini-line short"></div>
          </div>
        </div>
      </div>
      <div class="custom-hub-template-name">Blank</div>
      <div class="custom-hub-template-desc">${escapeHtml(copy.description)}</div>
    `;
  }

  function hydrateHubTemplateCards() {
    ensureHubUpgradeStyles();
    document.querySelectorAll('.custom-hub-template-card').forEach((card) => {
      const templateKey = card.dataset.template || 'blank';
      if (card.dataset.hydrated === 'true') return;
      card.innerHTML = pccRenderTemplateCard(templateKey);
      card.dataset.hydrated = 'true';
    });
  }

  function pccRenderStyleThemeCard(themeKey) {
    const theme = HUB_STYLE_THEMES[themeKey] || HUB_STYLE_THEMES.editorial;
    return `
      <div class="custom-hub-style-visual hub-look-${themeKey}">
        <div class="custom-hub-style-head">
          <span class="custom-hub-style-pill">${escapeHtml(theme.kicker)}</span>
          <span class="custom-hub-style-pill soft">${escapeHtml(theme.label)}</span>
        </div>
        <div class="custom-hub-style-panels">
          <div class="custom-hub-style-panel hero"></div>
          <div class="custom-hub-style-panel ${themeKey === 'confetti' ? 'dots' : ''}"></div>
          <div class="custom-hub-style-panel short"></div>
        </div>
      </div>
      <div class="custom-hub-template-name">${escapeHtml(theme.label)}</div>
      <div class="custom-hub-template-desc">${escapeHtml(theme.description)}</div>
    `;
  }

  function hydrateHubStyleCards() {
    ensureHubUpgradeStyles();
    document.querySelectorAll('.custom-hub-style-card').forEach((card) => {
      const themeKey = card.dataset.styleTheme || 'editorial';
      if (card.dataset.hydrated === 'true') return;
      card.innerHTML = pccRenderStyleThemeCard(themeKey);
      card.dataset.hydrated = 'true';
    });
  }

  function ensureHubStyleThemePicker() {
    const preview = document.getElementById('custom-hub-template-preview');
    const templateGrid = document.querySelector('.custom-hub-template-grid');
    if (!preview || !templateGrid) return;

    let label = document.getElementById('custom-hub-style-label');
    let grid = document.getElementById('custom-hub-style-grid');
    if (!label) {
      label = document.createElement('div');
      label.id = 'custom-hub-style-label';
      label.className = 'theme-section-label';
      label.style.marginTop = '1rem';
      label.textContent = 'Choose a Look';
    }
    if (!grid) {
      grid = document.createElement('div');
      grid.id = 'custom-hub-style-grid';
      grid.className = 'custom-hub-style-grid';
      grid.innerHTML = Object.keys(HUB_STYLE_THEMES).map((themeKey, index) => `
        <button class="custom-hub-style-card${index === 0 ? ' active' : ''}" type="button" data-style-theme="${themeKey}" onclick="selectHubStyleTheme(this)"></button>
      `).join('');
    }
    if (!label.parentNode) preview.parentNode.insertBefore(label, preview);
    if (!grid.parentNode) preview.parentNode.insertBefore(grid, preview);
    hydrateHubStyleCards();
  }

  function setActiveHubStyleTheme(themeKey) {
    selectedHubStyleTheme = HUB_STYLE_THEMES[themeKey] ? themeKey : 'editorial';
    document.querySelectorAll('.custom-hub-style-card').forEach((card) => {
      card.classList.toggle('active', card.dataset.styleTheme === selectedHubStyleTheme);
    });
  }

  function pccCreateDefaultHubData(templateKey, hubTitle) {
    const title = hubTitle || 'Your Hub';
    if (templateKey === 'planner') {
      return {
        vision: `${title} exists to keep the next important move visible and moving.`,
        mantra: 'Clear priorities. Calm energy. Forward motion.',
        priorities: 'Lock the top three priorities.\nProtect time for deep work.\nShip before overthinking.',
        milestones: 'Milestone 1 - Define the next win.\nMilestone 2 - Block the calendar.\nMilestone 3 - Close the loop.',
        notes: 'Use this area for reminders, links, and loose thoughts that still matter.',
      };
    }
    if (templateKey === 'tracker') {
      return {
        metric: 'Revenue actions',
        cadence: 'Daily check-in',
        current: '3',
        target: '10',
        streak: '4',
        focus: 'Track the behavior that actually moves the number.',
        log: 'Mon - \nTue - \nWed - \nThu - \nFri - ',
        wins: 'Write the wins down while they are fresh.',
        insight: 'What pattern are you noticing this week?',
      };
    }
    return { content: '' };
  }

  function pccNormalizeHub(hub) {
    if (!hub) return hub;
    const template = HUB_TEMPLATES[hub.template] ? hub.template : 'blank';
    const styleTheme = HUB_STYLE_THEMES[hub.styleTheme] ? hub.styleTheme : 'editorial';
    const normalized = { ...hub, template, styleTheme };

    if (template === 'blank') {
      const content = typeof normalized?.data?.content === 'string'
        ? normalized.data.content
        : (typeof normalized.content === 'string' ? normalized.content : '');
      normalized.data = { content };
      normalized.content = content;
      return normalized;
    }

    const defaults = pccCreateDefaultHubData(template, normalized.title || 'Your Hub');
    const existingData = normalized.data && typeof normalized.data === 'object' ? normalized.data : {};
    normalized.data = { ...defaults, ...existingData };
    if (!normalized.data.notes && typeof normalized.content === 'string' && normalized.content.trim()) {
      normalized.data.notes = normalized.content;
    }
    return normalized;
  }

  function pccGetTrackerPercent(hub) {
    const data = pccNormalizeHub(hub)?.data || {};
    const current = parseFloat(String(data.current || '').replace(/[^0-9.-]/g, ''));
    const target = parseFloat(String(data.target || '').replace(/[^0-9.-]/g, ''));
    if (!Number.isFinite(current) || !Number.isFinite(target) || target <= 0) return 0;
    return Math.max(0, Math.min(100, Math.round((current / target) * 100)));
  }

  function pccRenderTemplatePreview(templateKey, hubTitle, styleTheme) {
    const title = escapeHtml(hubTitle || 'Your Hub');
    const look = HUB_STYLE_THEMES[styleTheme] || HUB_STYLE_THEMES.editorial;
    const lookClass = `hub-look-${look === HUB_STYLE_THEMES[styleTheme] ? styleTheme : 'editorial'}`;
    if (templateKey === 'planner') {
      return `
        <div class="hub-preview-shell ${lookClass}">
          <div class="hub-preview-hero">
            <div class="hub-preview-kicker">Planner Template - ${escapeHtml(look.label)} Look</div>
            <div class="hub-preview-title">${title}</div>
            <div class="hub-preview-copy">A visual workspace for priorities, milestones, and the next right move.</div>
          </div>
          <div class="hub-preview-grid">
            <div class="hub-preview-card wide">
              <div class="hub-preview-label">Vision</div>
              <div class="hub-preview-lines">
                <div class="hub-preview-line long"></div>
                <div class="hub-preview-line mid"></div>
              </div>
            </div>
            <div class="hub-preview-card wide">
              <div class="hub-preview-label">Top Priorities</div>
              <div class="hub-preview-lines">
                <div class="hub-preview-line long"></div>
                <div class="hub-preview-line mid"></div>
                <div class="hub-preview-line short"></div>
              </div>
            </div>
          </div>
        </div>
      `;
    }
    if (templateKey === 'tracker') {
      return `
        <div class="hub-preview-shell ${lookClass}">
          <div class="hub-preview-hero">
            <div class="hub-preview-kicker">Tracker Template - ${escapeHtml(look.label)} Look</div>
            <div class="hub-preview-title">${title}</div>
            <div class="hub-preview-copy">Watch a metric, keep the streak visible, and log the lessons while they are fresh.</div>
          </div>
          <div class="hub-preview-grid">
            <div class="hub-preview-card">
              <div class="hub-preview-label">Current</div>
              <div class="hub-preview-lines"><div class="hub-preview-line short"></div></div>
            </div>
            <div class="hub-preview-card">
              <div class="hub-preview-label">Target</div>
              <div class="hub-preview-lines"><div class="hub-preview-line short"></div></div>
            </div>
            <div class="hub-preview-card">
              <div class="hub-preview-label">Streak</div>
              <div class="hub-preview-lines"><div class="hub-preview-line short"></div></div>
            </div>
          </div>
        </div>
      `;
    }
    return `
      <div class="hub-preview-shell ${lookClass}">
        <div class="hub-preview-hero">
          <div class="hub-preview-kicker">Blank Template - ${escapeHtml(look.label)} Look</div>
          <div class="hub-preview-title">${title}</div>
          <div class="hub-preview-copy">One open workspace with room to build anything you want.</div>
        </div>
        <div class="hub-preview-grid">
          <div class="hub-preview-card wide">
            <div class="hub-preview-label">Workspace</div>
            <div class="hub-preview-lines">
              <div class="hub-preview-line long"></div>
              <div class="hub-preview-line long"></div>
              <div class="hub-preview-line mid"></div>
              <div class="hub-preview-line short"></div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function pccBuildHubBody(hub) {
    const normalizedHub = pccNormalizeHub(hub);
    const safeTitle = escapeHtmlAttr(normalizedHub.title || 'Untitled Hub');
    const data = normalizedHub.data || {};
    const look = HUB_STYLE_THEMES[normalizedHub.styleTheme] || HUB_STYLE_THEMES.editorial;
    const lookClass = `hub-look-${normalizedHub.styleTheme}`;

    if (normalizedHub.template === 'planner') {
      return `
        <div class="custom-hub-template-shell custom-hub-themeable ${lookClass}">
          <div class="custom-hub-hero">
            <div>
              <div class="custom-hub-kicker">Planner Template - ${escapeHtml(look.label)} Look</div>
              <div class="custom-hub-hero-title" data-hub-title="${normalizedHub.id}">${escapeHtml(normalizedHub.title)}</div>
              <div class="custom-hub-hero-copy">Keep the vision clean, the priorities visible, and the next milestone close enough to act on.</div>
            </div>
            <div class="custom-hub-chip-row">
              <span class="custom-hub-chip">Priority Map</span>
              <span class="custom-hub-chip">Milestones</span>
              <span class="custom-hub-chip">Notes</span>
            </div>
          </div>
          <div class="custom-hub-rich-grid">
            <div class="custom-hub-rich-card custom-hub-span-5">
              <div class="custom-hub-card-label">Hub Title</div>
              <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${normalizedHub.id}', this.value)" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-7">
              <div class="custom-hub-card-label">Mantra</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${normalizedHub.id}','mantra',this.value)">${escapeHtml(data.mantra || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-7">
              <div class="custom-hub-card-label">Vision</div>
              <div class="custom-hub-card-copy">Name what this hub is organizing and what a strong month looks like.</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','vision',this.value)">${escapeHtml(data.vision || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-5">
              <div class="custom-hub-card-label">Top Priorities</div>
              <div class="custom-hub-card-copy">One line per priority keeps this list easy to scan.</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','priorities',this.value)">${escapeHtml(data.priorities || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-6">
              <div class="custom-hub-card-label">Milestones</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','milestones',this.value)">${escapeHtml(data.milestones || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-6">
              <div class="custom-hub-card-label">Notes</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','notes',this.value)">${escapeHtml(data.notes || '')}</textarea>
            </div>
          </div>
          <div class="custom-hub-footer-actions">
            <button class="custom-hub-btn" type="button" onclick="deleteHub('${normalizedHub.id}')">Delete Hub</button>
          </div>
        </div>
      `;
    }

    if (normalizedHub.template === 'tracker') {
      const percent = pccGetTrackerPercent(normalizedHub);
      return `
        <div class="custom-hub-template-shell custom-hub-themeable ${lookClass}">
          <div class="custom-hub-hero kpi">
            <div>
              <div class="custom-hub-kicker">Tracker Template - ${escapeHtml(look.label)} Look</div>
              <div class="custom-hub-hero-title" data-hub-title="${normalizedHub.id}">${escapeHtml(normalizedHub.title)}</div>
              <div class="custom-hub-hero-copy">Keep the metric visible, honor the cadence, and log what is actually working while the pattern is still clear.</div>
            </div>
            <div class="custom-hub-chip-row">
              <span class="custom-hub-chip" id="hub-tracker-metric-chip-${normalizedHub.id}">${escapeHtml(data.metric || 'Metric')}</span>
              <span class="custom-hub-chip" id="hub-tracker-cadence-chip-${normalizedHub.id}">${escapeHtml(data.cadence || 'Cadence')}</span>
            </div>
          </div>
          <div class="custom-hub-rich-grid">
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Hub Title</div>
              <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${normalizedHub.id}', this.value)" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Metric</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.metric || '')}" oninput="updateHubField('${normalizedHub.id}','metric',this.value);syncHubTrackerProgress('${normalizedHub.id}')" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Check-In Cadence</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.cadence || '')}" oninput="updateHubField('${normalizedHub.id}','cadence',this.value);syncHubTrackerProgress('${normalizedHub.id}')" />
            </div>
          </div>
          <div class="custom-hub-micro-grid">
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Current</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.current || '')}" oninput="updateHubField('${normalizedHub.id}','current',this.value);syncHubTrackerProgress('${normalizedHub.id}')" />
            </div>
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Target</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.target || '')}" oninput="updateHubField('${normalizedHub.id}','target',this.value);syncHubTrackerProgress('${normalizedHub.id}')" />
            </div>
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Streak</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.streak || '')}" oninput="updateHubField('${normalizedHub.id}','streak',this.value);syncHubTrackerProgress('${normalizedHub.id}')" />
            </div>
          </div>
          <div class="custom-hub-progress-wrap">
            <div class="custom-hub-progress-meta">
              <span id="hub-progress-label-${normalizedHub.id}">${escapeHtml(data.metric || 'Current progress')}</span>
              <strong id="hub-progress-number-${normalizedHub.id}">${percent}%</strong>
            </div>
            <div class="custom-hub-progress-track">
              <div class="custom-hub-progress-fill" id="hub-progress-fill-${normalizedHub.id}" style="width:${percent}%"></div>
            </div>
            <div class="custom-hub-progress-caption" id="hub-progress-caption-${normalizedHub.id}">Current ${escapeHtml(data.current || '0')} toward ${escapeHtml(data.target || '0')}.</div>
          </div>
          <div class="custom-hub-rich-grid">
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Focus</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${normalizedHub.id}','focus',this.value)">${escapeHtml(data.focus || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Insight</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${normalizedHub.id}','insight',this.value)">${escapeHtml(data.insight || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Wins</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${normalizedHub.id}','wins',this.value)">${escapeHtml(data.wins || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-12">
              <div class="custom-hub-card-label">Weekly Log</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','log',this.value)">${escapeHtml(data.log || '')}</textarea>
            </div>
          </div>
          <div class="custom-hub-footer-actions">
            <button class="custom-hub-btn" type="button" onclick="deleteHub('${normalizedHub.id}')">Delete Hub</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="custom-hub-template-shell custom-hub-themeable ${lookClass}">
        <div class="custom-hub-hero">
          <div>
            <div class="custom-hub-kicker">Blank Template - ${escapeHtml(look.label)} Look</div>
            <div class="custom-hub-hero-title" data-hub-title="${normalizedHub.id}">${escapeHtml(normalizedHub.title)}</div>
            <div class="custom-hub-hero-copy">A clean workspace with room for plans, notes, links, or whatever this hub needs to become.</div>
          </div>
          <div class="custom-hub-chip-row">
            <span class="custom-hub-chip">Flexible</span>
            <span class="custom-hub-chip">Freeform</span>
            <span class="custom-hub-chip">Anything Goes</span>
          </div>
        </div>
        <div class="custom-hub-rich-grid">
          <div class="custom-hub-rich-card custom-hub-span-4">
            <div class="custom-hub-card-label">Hub Title</div>
            <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${normalizedHub.id}', this.value)" />
          </div>
          <div class="custom-hub-rich-card custom-hub-span-8">
            <div class="custom-hub-card-label">Workspace</div>
            <div class="custom-hub-card-copy">This is the open canvas version. Use it for notes, outlines, links, or rough thinking.</div>
            <textarea class="custom-hub-field-area" oninput="updateHubField('${normalizedHub.id}','content',this.value)">${escapeHtml(data.content || '')}</textarea>
          </div>
        </div>
        <div class="custom-hub-footer-actions">
          <button class="custom-hub-btn" type="button" onclick="deleteHub('${normalizedHub.id}')">Delete Hub</button>
        </div>
      </div>
    `;
  }

  function pccRenderHubPage(hub) {
    const normalizedHub = pccNormalizeHub(hub);
    let page = document.getElementById('page-' + normalizedHub.id);
    if (!page) {
      page = document.createElement('div');
      page.className = 'page';
      page.id = 'page-' + normalizedHub.id;
      const anchor = document.getElementById('page-home');
      if (anchor && anchor.parentNode) anchor.parentNode.insertBefore(page, anchor.nextSibling);
      else document.body.appendChild(page);
    }

    const template = getHubTemplate(normalizedHub.template);
    const look = HUB_STYLE_THEMES[normalizedHub.styleTheme] || HUB_STYLE_THEMES.editorial;
    page.innerHTML = `
      <div class="pg-header">
        <div>
          <div class="eyebrow">Custom Hub</div>
          <h1 data-hub-title="${normalizedHub.id}">${escapeHtml(normalizedHub.title)}</h1>
          <div class="sub">${escapeHtml(`${template.label} template - ${look.label} look`)}</div>
        </div>
      </div>
      ${pccBuildHubBody(normalizedHub)}
    `;

    if (normalizedHub.template === 'tracker') {
      window.syncHubTrackerProgress(normalizedHub.id);
    }
    if (typeof window.normalizePageHeaderTitles === 'function') {
      window.normalizePageHeaderTitles(page);
    }
  }

  window.loadCustomHubs = function() {
    try {
      const raw = JSON.parse(localStorage.getItem(CUSTOM_HUBS_KEY)) || [];
      return Array.isArray(raw) ? raw.map(pccNormalizeHub) : [];
    } catch (e) {
      return [];
    }
  };

  window.saveCustomHubs = function(hubs) {
    localStorage.setItem(CUSTOM_HUBS_KEY, JSON.stringify((hubs || []).map(pccNormalizeHub)));
  };

  window.selectHubStyleTheme = function(buttonOrKey) {
    const themeKey = typeof buttonOrKey === 'string'
      ? buttonOrKey
      : (buttonOrKey?.dataset.styleTheme || 'editorial');
    setActiveHubStyleTheme(themeKey);
    window.updateHubTemplatePreview();
  };

  window.updateHubTemplatePreview = function() {
    ensureHubStyleThemePicker();
    const preview = document.getElementById('custom-hub-template-preview');
    if (!preview) return;
    const name = document.getElementById('custom-hub-name')?.value.trim() || 'Your Hub';
    preview.innerHTML = pccRenderTemplatePreview(selectedHubTemplate, name, selectedHubStyleTheme);
  };

  window.submitHubCreate = function() {
    const name = document.getElementById('custom-hub-name')?.value;
    if (!name || !name.trim()) {
      alert('Give your hub a name first.');
      return;
    }
    const cleanName = name.trim();
    const pageId = slugifyHubName(cleanName);
    const hubs = window.loadCustomHubs();
    if (hubs.some((hub) => hub.id === pageId) || document.getElementById('page-' + pageId)) {
      alert('That hub already exists. Try a different name.');
      return;
    }
    const hub = pccNormalizeHub({
      id: pageId,
      title: cleanName,
      template: selectedHubTemplate,
      styleTheme: selectedHubStyleTheme,
      data: pccCreateDefaultHubData(selectedHubTemplate, cleanName),
    });
    if (hub.template === 'blank') hub.content = hub.data.content;
    hubs.push(hub);
    window.saveCustomHubs(hubs);
    window.createHubTabAndPage(hub);
    if (typeof saveTabOrder === 'function') saveTabOrder();
    if (typeof closeHubCreator === 'function') closeHubCreator();
    const tab = document.querySelector(`.nav-tab[data-page="${pageId}"]`);
    if (tab && typeof showPage === 'function') showPage(pageId, tab);
  };

  window.createHubTabAndPage = function(hub) {
    const normalizedHub = pccNormalizeHub(hub);
    const tabsBar = document.getElementById('nav-tabs');
    if (!tabsBar) return;
    if (!tabsBar.querySelector(`.nav-tab[data-page="${normalizedHub.id}"]`)) {
      const tab = document.createElement('button');
      tab.className = 'nav-tab';
      tab.type = 'button';
      tab.setAttribute('draggable', 'true');
      tab.dataset.page = normalizedHub.id;
      tab.textContent = normalizedHub.title;
      const addBtn = tabsBar.querySelector('.nav-tab-add');
      if (addBtn) tabsBar.insertBefore(tab, addBtn);
      else tabsBar.appendChild(tab);
    }
    pccRenderHubPage(normalizedHub);
    if (typeof initTabDrag === 'function') initTabDrag();
  };

  window.updateHubTitle = function(hubId, value) {
    const hubs = window.loadCustomHubs();
    const hub = hubs.find((entry) => entry.id === hubId);
    if (!hub) return;
    hub.title = (value && value.trim()) || 'Untitled Hub';
    if (hub.template && hub.template !== 'blank') {
      hub.data = { ...pccCreateDefaultHubData(hub.template, hub.title), ...(hub.data || {}) };
    }
    window.saveCustomHubs(hubs);
    const tab = document.querySelector(`.nav-tab[data-page="${hubId}"]`);
    if (tab) tab.textContent = hub.title;
    document.querySelectorAll(`[data-hub-title="${hubId}"]`).forEach((el) => { el.textContent = hub.title; });
  };

  window.updateHubField = function(hubId, field, value) {
    const hubs = window.loadCustomHubs();
    const hub = hubs.find((entry) => entry.id === hubId);
    if (!hub) return;
    const normalizedHub = pccNormalizeHub(hub);
    normalizedHub.data = { ...(normalizedHub.data || {}), [field]: value };
    if (normalizedHub.template === 'blank' && field === 'content') {
      normalizedHub.content = value;
    }
    Object.assign(hub, normalizedHub);
    window.saveCustomHubs(hubs);
  };

  window.updateHubContent = function(hubId, value) {
    window.updateHubField(hubId, 'content', value);
  };

  window.syncHubTrackerProgress = function(hubId) {
    const hub = window.loadCustomHubs().find((entry) => entry.id === hubId);
    if (!hub || hub.template !== 'tracker') return;
    const percent = pccGetTrackerPercent(hub);
    const data = hub.data || {};
    const fill = document.getElementById(`hub-progress-fill-${hubId}`);
    const label = document.getElementById(`hub-progress-label-${hubId}`);
    const number = document.getElementById(`hub-progress-number-${hubId}`);
    const caption = document.getElementById(`hub-progress-caption-${hubId}`);
    const metricChip = document.getElementById(`hub-tracker-metric-chip-${hubId}`);
    const cadenceChip = document.getElementById(`hub-tracker-cadence-chip-${hubId}`);
    if (fill) fill.style.width = percent + '%';
    if (label) label.textContent = data.metric || 'Current progress';
    if (number) number.textContent = percent + '%';
    if (caption) caption.textContent = `Current ${data.current || '0'} toward ${data.target || '0'}.`;
    if (metricChip) metricChip.textContent = data.metric || 'Metric';
    if (cadenceChip) cadenceChip.textContent = data.cadence || 'Cadence';
  };

  window.renderCustomHubs = function() {
    window.loadCustomHubs().forEach(window.createHubTabAndPage);
    if (typeof initTabDrag === 'function') initTabDrag();
  };

  if (typeof window.openHubCreator === 'function') {
    const originalOpenHubCreator = window.openHubCreator;
    window.openHubCreator = function() {
      ensureHubUpgradeStyles();
      hydrateHubTemplateCards();
      ensureHubStyleThemePicker();
      originalOpenHubCreator();
      setTimeout(() => {
        ensureHubStyleThemePicker();
        hydrateHubStyleCards();
        window.selectHubStyleTheme('editorial');
      }, 20);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureHubUpgradeStyles();
      hydrateHubTemplateCards();
      ensureHubStyleThemePicker();
      hydrateHubStyleCards();
      setTimeout(window.renderCustomHubs, 20);
      setTimeout(() => {
        window.selectHubStyleTheme(selectedHubStyleTheme);
      }, 40);
    });
  } else {
    ensureHubUpgradeStyles();
    hydrateHubTemplateCards();
    ensureHubStyleThemePicker();
    hydrateHubStyleCards();
    setTimeout(window.renderCustomHubs, 20);
    setTimeout(() => {
      window.selectHubStyleTheme(selectedHubStyleTheme);
    }, 40);
  }
})();
