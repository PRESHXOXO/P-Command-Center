(function() {
  if (typeof HUB_TEMPLATES === 'undefined') return;

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
    const normalized = { ...hub, template };

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

  function pccRenderTemplatePreview(templateKey, hubTitle) {
    const title = escapeHtml(hubTitle || 'Your Hub');
    if (templateKey === 'planner') {
      return `
        <div class="hub-preview-shell">
          <div class="hub-preview-hero">
            <div class="hub-preview-kicker">Planner Template</div>
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
        <div class="hub-preview-shell">
          <div class="hub-preview-hero">
            <div class="hub-preview-kicker">Tracker Template</div>
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
      <div class="hub-preview-shell">
        <div class="hub-preview-hero">
          <div class="hub-preview-kicker">Blank Template</div>
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
    const safeTitle = escapeHtmlAttr(hub.title || 'Untitled Hub');
    const data = pccNormalizeHub(hub).data || {};

    if (hub.template === 'planner') {
      return `
        <div class="custom-hub-template-shell">
          <div class="custom-hub-hero">
            <div>
              <div class="custom-hub-kicker">Planner Template</div>
              <div class="custom-hub-hero-title" data-hub-title="${hub.id}">${escapeHtml(hub.title)}</div>
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
              <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${hub.id}', this.value)" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-7">
              <div class="custom-hub-card-label">Mantra</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${hub.id}','mantra',this.value)">${escapeHtml(data.mantra || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-7">
              <div class="custom-hub-card-label">Vision</div>
              <div class="custom-hub-card-copy">Name what this hub is organizing and what a strong month looks like.</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','vision',this.value)">${escapeHtml(data.vision || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-5">
              <div class="custom-hub-card-label">Top Priorities</div>
              <div class="custom-hub-card-copy">One line per priority keeps this list easy to scan.</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','priorities',this.value)">${escapeHtml(data.priorities || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-6">
              <div class="custom-hub-card-label">Milestones</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','milestones',this.value)">${escapeHtml(data.milestones || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-6">
              <div class="custom-hub-card-label">Notes</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','notes',this.value)">${escapeHtml(data.notes || '')}</textarea>
            </div>
          </div>
          <div class="custom-hub-footer-actions">
            <button class="custom-hub-btn" type="button" onclick="deleteHub('${hub.id}')">Delete Hub</button>
          </div>
        </div>
      `;
    }

    if (hub.template === 'tracker') {
      const percent = pccGetTrackerPercent(hub);
      return `
        <div class="custom-hub-template-shell">
          <div class="custom-hub-hero kpi">
            <div>
              <div class="custom-hub-kicker">Tracker Template</div>
              <div class="custom-hub-hero-title" data-hub-title="${hub.id}">${escapeHtml(hub.title)}</div>
              <div class="custom-hub-hero-copy">Keep the metric visible, honor the cadence, and log what is actually working while the pattern is still clear.</div>
            </div>
            <div class="custom-hub-chip-row">
              <span class="custom-hub-chip" id="hub-tracker-metric-chip-${hub.id}">${escapeHtml(data.metric || 'Metric')}</span>
              <span class="custom-hub-chip" id="hub-tracker-cadence-chip-${hub.id}">${escapeHtml(data.cadence || 'Cadence')}</span>
            </div>
          </div>
          <div class="custom-hub-rich-grid">
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Hub Title</div>
              <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${hub.id}', this.value)" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Metric</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.metric || '')}" oninput="updateHubField('${hub.id}','metric',this.value);syncHubTrackerProgress('${hub.id}')" />
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Check-In Cadence</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.cadence || '')}" oninput="updateHubField('${hub.id}','cadence',this.value);syncHubTrackerProgress('${hub.id}')" />
            </div>
          </div>
          <div class="custom-hub-micro-grid">
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Current</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.current || '')}" oninput="updateHubField('${hub.id}','current',this.value);syncHubTrackerProgress('${hub.id}')" />
            </div>
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Target</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.target || '')}" oninput="updateHubField('${hub.id}','target',this.value);syncHubTrackerProgress('${hub.id}')" />
            </div>
            <div class="custom-hub-micro">
              <div class="custom-hub-micro-label">Streak</div>
              <input class="custom-hub-field-input" type="text" value="${escapeHtmlAttr(data.streak || '')}" oninput="updateHubField('${hub.id}','streak',this.value);syncHubTrackerProgress('${hub.id}')" />
            </div>
          </div>
          <div class="custom-hub-progress-wrap">
            <div class="custom-hub-progress-meta">
              <span id="hub-progress-label-${hub.id}">${escapeHtml(data.metric || 'Current progress')}</span>
              <strong id="hub-progress-number-${hub.id}">${percent}%</strong>
            </div>
            <div class="custom-hub-progress-track">
              <div class="custom-hub-progress-fill" id="hub-progress-fill-${hub.id}" style="width:${percent}%"></div>
            </div>
            <div class="custom-hub-progress-caption" id="hub-progress-caption-${hub.id}">Current ${escapeHtml(data.current || '0')} toward ${escapeHtml(data.target || '0')}.</div>
          </div>
          <div class="custom-hub-rich-grid">
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Focus</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${hub.id}','focus',this.value)">${escapeHtml(data.focus || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Insight</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${hub.id}','insight',this.value)">${escapeHtml(data.insight || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-4">
              <div class="custom-hub-card-label">Wins</div>
              <textarea class="custom-hub-field-area compact" oninput="updateHubField('${hub.id}','wins',this.value)">${escapeHtml(data.wins || '')}</textarea>
            </div>
            <div class="custom-hub-rich-card custom-hub-span-12">
              <div class="custom-hub-card-label">Weekly Log</div>
              <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','log',this.value)">${escapeHtml(data.log || '')}</textarea>
            </div>
          </div>
          <div class="custom-hub-footer-actions">
            <button class="custom-hub-btn" type="button" onclick="deleteHub('${hub.id}')">Delete Hub</button>
          </div>
        </div>
      `;
    }

    return `
      <div class="custom-hub-template-shell">
        <div class="custom-hub-hero">
          <div>
            <div class="custom-hub-kicker">Blank Template</div>
            <div class="custom-hub-hero-title" data-hub-title="${hub.id}">${escapeHtml(hub.title)}</div>
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
            <input class="custom-hub-field-input" type="text" value="${safeTitle}" oninput="updateHubTitle('${hub.id}', this.value)" />
          </div>
          <div class="custom-hub-rich-card custom-hub-span-8">
            <div class="custom-hub-card-label">Workspace</div>
            <div class="custom-hub-card-copy">This is the open canvas version. Use it for notes, outlines, links, or rough thinking.</div>
            <textarea class="custom-hub-field-area" oninput="updateHubField('${hub.id}','content',this.value)">${escapeHtml(data.content || '')}</textarea>
          </div>
        </div>
        <div class="custom-hub-footer-actions">
          <button class="custom-hub-btn" type="button" onclick="deleteHub('${hub.id}')">Delete Hub</button>
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
    page.innerHTML = `
      <div class="pg-header">
        <div>
          <div class="eyebrow">Custom Hub</div>
          <h1 data-hub-title="${normalizedHub.id}">${escapeHtml(normalizedHub.title)}</h1>
          <div class="sub">${escapeHtml(`${template.label} template - ${template.description || 'Build this section your way.'}`)}</div>
        </div>
      </div>
      ${pccBuildHubBody(normalizedHub)}
    `;

    if (normalizedHub.template === 'tracker') {
      window.syncHubTrackerProgress(normalizedHub.id);
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

  window.updateHubTemplatePreview = function() {
    const preview = document.getElementById('custom-hub-template-preview');
    if (!preview) return;
    const name = document.getElementById('custom-hub-name')?.value.trim() || 'Your Hub';
    preview.innerHTML = pccRenderTemplatePreview(selectedHubTemplate, name);
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
      originalOpenHubCreator();
      setTimeout(window.updateHubTemplatePreview, 20);
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      ensureHubUpgradeStyles();
      hydrateHubTemplateCards();
      setTimeout(window.renderCustomHubs, 20);
      setTimeout(window.updateHubTemplatePreview, 40);
    });
  } else {
    ensureHubUpgradeStyles();
    hydrateHubTemplateCards();
    setTimeout(window.renderCustomHubs, 20);
    setTimeout(window.updateHubTemplatePreview, 40);
  }
})();
