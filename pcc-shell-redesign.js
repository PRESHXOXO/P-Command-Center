(function () {
  const QUICK_NOTE_PREFIX = 'pcc-dashboard-quick-note';
  let refreshTimer = null;

  function safeJsonParse(raw, fallback) {
    try {
      return JSON.parse(raw);
    } catch (error) {
      return fallback;
    }
  }

  function getSessionUserId() {
    const session = safeJsonParse(localStorage.getItem('pcc-auth-session') || 'null', null);
    return session && session.id ? String(session.id) : 'guest';
  }

  function getQuickNoteKey() {
    return QUICK_NOTE_PREFIX + '::' + getSessionUserId();
  }

  async function goToPage(pageId) {
    const tab = document.querySelector('.nav-tab[data-page="' + pageId + '"]');
    const page = document.getElementById('page-' + pageId);
    if (
      page &&
      page.dataset.pageLazy === 'true' &&
      (page.dataset.pageLoaded !== 'true' || page.dataset.pageAssetsLoaded !== 'true') &&
      typeof window.ensurePageReady === 'function'
    ) {
      try {
        await window.ensurePageReady(pageId);
      } catch (error) {}
    }
    if (typeof window.showPage === 'function') {
      window.showPage(pageId, tab || undefined);
    }
  }

  function formatUpcomingDate(value) {
    const date = new Date(value + 'T00:00:00');
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      weekday: 'short'
    });
  }

  function getUpcomingEvents() {
    const eventList = Array.isArray(window.events)
      ? window.events
      : safeJsonParse(localStorage.getItem('pcc-calendar-events') || '[]', []);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return (Array.isArray(eventList) ? eventList : [])
      .filter((event) => event && typeof event.date === 'string' && typeof event.title === 'string')
      .map((event) => {
        const parsed = new Date(event.date + 'T00:00:00');
        return {
          title: event.title,
          tag: event.tag || 'Schedule',
          date: event.date,
          time: parsed.getTime()
        };
      })
      .filter((event) => !Number.isNaN(event.time) && event.time >= today.getTime())
      .sort((a, b) => a.time - b.time)
      .slice(0, 4);
  }

  function getVisionCount() {
    const items = safeJsonParse(localStorage.getItem('pcc-vision-board') || '[]', []);
    return Array.isArray(items) ? items.length : 0;
  }

  function getGoalMetrics() {
    const total = typeof window.getGoals === 'function' ? window.getGoals().length : document.querySelectorAll('#goals-list .goal').length;
    const done = Number.parseInt(document.getElementById('goals-done')?.textContent || '0', 10) || 0;
    return { total, done };
  }

  function getStreamCount() {
    return Number.parseInt(document.getElementById('streams-active-pill')?.textContent || '0', 10) || 0;
  }

  function createPanel(className, html) {
    const panel = document.createElement('section');
    panel.className = className;
    panel.innerHTML = html;
    return panel;
  }

  function ensureDashboardShell() {
    const page = document.getElementById('page-dashboard');
    if (!page) return null;
    if (page.dataset.osEnhanced === 'true') return page;

    const header = page.querySelector('.pg-header');
    const affirmation = page.querySelector('.aff-bar');
    const bento = page.querySelector('.bento');
    const quote = page.querySelector('.quote-card');
    const footer = page.querySelector('.footer');
    if (!header || !affirmation || !bento) return page;

    const cards = Array.from(bento.children).filter((node) => node.nodeType === 1);
    const focus = cards[0];
    const pillars = cards[1];
    const checkIn = cards[2];
    const weeks = cards[3];
    const habits = cards[4];
    const goals = cards[5];
    const timer = cards[6];
    const revenue = cards[7];

    const shell = document.createElement('div');
    shell.className = 'dashboard-os-shell';

    const hero = document.createElement('section');
    hero.className = 'dashboard-os-hero';
    const heroMain = document.createElement('div');
    heroMain.className = 'dashboard-os-hero-main';
    const heroSide = document.createElement('aside');
    heroSide.className = 'dashboard-os-hero-side';

    heroMain.appendChild(header);
    heroMain.appendChild(affirmation);
    hero.appendChild(heroMain);
    hero.appendChild(heroSide);

    const layout = document.createElement('div');
    layout.className = 'dashboard-os-layout';
    const primary = document.createElement('div');
    primary.className = 'dashboard-os-primary';
    const sidebar = document.createElement('aside');
    sidebar.className = 'dashboard-os-sidebar';

    if (focus) focus.classList.add('dash-card-focus');
    if (pillars) pillars.classList.add('dash-card-pillars');
    if (checkIn) checkIn.classList.add('dash-card-checkin');
    if (weeks) weeks.classList.add('dash-card-weeks');
    if (habits) habits.classList.add('dash-card-habits');
    if (goals) goals.classList.add('dash-card-goals');
    if (timer) timer.classList.add('dash-card-timer');
    if (revenue) revenue.classList.add('dash-card-revenue');
    if (quote) quote.classList.add('dash-card-quote');

    const commandCard = createPanel('dashboard-command-card dashboard-panel', `
      <div class="dashboard-panel-kicker">System View</div>
      <div class="dashboard-panel-title">Today's Pulse</div>
      <div class="dashboard-panel-copy">A cleaner read on what matters most right now, without having to scan the whole dashboard.</div>
      <div class="dashboard-status-grid">
        <div class="dashboard-status-card">
          <span class="dashboard-status-label">Active Projects</span>
          <strong class="dashboard-status-value" id="dashboard-stat-projects">0</strong>
        </div>
        <div class="dashboard-status-card">
          <span class="dashboard-status-label">Completed</span>
          <strong class="dashboard-status-value" id="dashboard-stat-done">0</strong>
        </div>
        <div class="dashboard-status-card">
          <span class="dashboard-status-label">Vision Pieces</span>
          <strong class="dashboard-status-value" id="dashboard-stat-vision">0</strong>
        </div>
        <div class="dashboard-status-card">
          <span class="dashboard-status-label">Upcoming</span>
          <strong class="dashboard-status-value" id="dashboard-stat-upcoming">0</strong>
        </div>
      </div>
      <div class="dashboard-action-row">
        <button class="pcc-btn primary" type="button" id="dashboard-open-vision">Open Vision Studio</button>
        <button class="pcc-btn secondary" type="button" id="dashboard-open-theme">Customize</button>
      </div>
    `);

    const visionCard = createPanel('dashboard-preview-card dashboard-panel', `
      <div class="dashboard-panel-kicker">Inspiration Area</div>
      <div class="dashboard-panel-title">Vision Studio</div>
      <div class="dashboard-panel-copy">Keep the bigger picture within reach. The studio stays visual, layered, and interactive without pulling attention away from your daily operating view.</div>
      <div class="dashboard-preview-pillrow">
        <span class="dashboard-preview-pill">Board items <strong id="dashboard-vision-count">0</strong></span>
        <span class="dashboard-preview-pill">Active streams <strong id="dashboard-stream-count">0</strong></span>
      </div>
      <div class="dashboard-action-row">
        <button class="pcc-btn secondary" type="button" id="dashboard-open-vision-secondary">Enter Studio</button>
      </div>
    `);

    const upcomingCard = createPanel('dashboard-upcoming-card dashboard-panel', `
      <div class="dashboard-panel-kicker">Upcoming Blocks</div>
      <div class="dashboard-panel-title">What Needs Your Time</div>
      <div class="dashboard-upcoming-list" id="dashboard-upcoming-list"></div>
      <div class="dashboard-action-row">
        <button class="pcc-btn ghost" type="button" id="dashboard-open-calendar">Open Schedule</button>
      </div>
    `);

    const noteCard = createPanel('dashboard-note-card dashboard-panel', `
      <div class="dashboard-panel-kicker">Quick Notes</div>
      <div class="dashboard-panel-title">Working Memory</div>
      <div class="dashboard-panel-copy">A small place for ideas, reminders, and half-finished sentences that should stay close while you move through the day.</div>
      <textarea class="dashboard-inline-note" id="dashboard-quick-note" placeholder="Keep a running note here for priorities, reminders, or fragments you want to turn into something later."></textarea>
      <div class="dashboard-note-meta" id="dashboard-note-meta">Saved on this device for the current account.</div>
    `);

    heroSide.appendChild(commandCard);

    [focus, goals, weeks, habits, revenue, timer].forEach((card) => {
      if (card) primary.appendChild(card);
    });

    sidebar.appendChild(visionCard);
    if (checkIn) sidebar.appendChild(checkIn);
    if (pillars) sidebar.appendChild(pillars);
    sidebar.appendChild(upcomingCard);
    sidebar.appendChild(noteCard);
    if (quote) sidebar.appendChild(quote);

    layout.appendChild(primary);
    layout.appendChild(sidebar);

    shell.appendChild(hero);
    shell.appendChild(layout);
    if (footer) shell.appendChild(footer);

    page.replaceChildren(shell);
    page.dataset.osEnhanced = 'true';

    commandCard.querySelector('#dashboard-open-vision')?.addEventListener('click', function () {
      goToPage('vision');
    });
    visionCard.querySelector('#dashboard-open-vision-secondary')?.addEventListener('click', function () {
      goToPage('vision');
    });
    commandCard.querySelector('#dashboard-open-theme')?.addEventListener('click', function () {
      if (typeof window.openThemePanel === 'function') window.openThemePanel();
    });
    upcomingCard.querySelector('#dashboard-open-calendar')?.addEventListener('click', function () {
      goToPage('calendar');
    });

    const quickNote = document.getElementById('dashboard-quick-note');
    if (quickNote) {
      try {
        quickNote.value = localStorage.getItem(getQuickNoteKey()) || '';
      } catch (error) {
        quickNote.value = '';
      }
      quickNote.addEventListener('input', function () {
        try {
          localStorage.setItem(getQuickNoteKey(), quickNote.value);
        } catch (error) {}
        queueDashboardRefresh();
      });
    }

    labelDashboardCards();
    return page;
  }

  function labelDashboardCards() {
    const focusLabel = document.querySelector('.dash-card-focus .sec-label');
    if (focusLabel) focusLabel.textContent = "Today's Focus";

    const goalsLabel = document.querySelector('.dash-card-goals .sec-label');
    if (goalsLabel) goalsLabel.innerHTML = 'Active Projects - <span id="goal-month-label">This Month</span>';

    const habitsLabel = document.querySelector('.dash-card-habits .sec-label');
    if (habitsLabel) habitsLabel.innerHTML = 'Action Rhythm - <span id="habit-week-label">This Week</span>';

    const weeksLabel = document.querySelector('.dash-card-weeks .sec-label');
    if (weeksLabel) weeksLabel.innerHTML = 'Weekly Direction - <span id="week-month-label">This Month</span>';

    const checkInLabel = document.querySelector('.dash-card-checkin .sec-label');
    if (checkInLabel) checkInLabel.textContent = 'Daily Focus';
  }

  function renderUpcomingList() {
    const target = document.getElementById('dashboard-upcoming-list');
    if (!target) return;
    const upcoming = getUpcomingEvents();
    if (!upcoming.length) {
      target.innerHTML = '<div class="dashboard-empty-copy">No upcoming schedule blocks yet. Add a deadline, call, or personal block in Schedule and it will show up here.</div>';
      return;
    }
    target.innerHTML = upcoming.map((event) => `
      <article class="dashboard-upcoming-item">
        <div>
          <div class="dashboard-upcoming-head">
            <span class="dashboard-upcoming-tag">${escapeHtml(event.tag)}</span>
          </div>
          <div class="dashboard-upcoming-title">${escapeHtml(event.title)}</div>
        </div>
        <div class="dashboard-upcoming-date">${escapeHtml(formatUpcomingDate(event.date))}</div>
      </article>
    `).join('');
  }

  function refreshDashboardStats() {
    ensureDashboardShell();

    const goals = getGoalMetrics();
    const upcoming = getUpcomingEvents();
    const visionCount = getVisionCount();
    const streams = getStreamCount();

    const statProjects = document.getElementById('dashboard-stat-projects');
    const statDone = document.getElementById('dashboard-stat-done');
    const statVision = document.getElementById('dashboard-stat-vision');
    const statUpcoming = document.getElementById('dashboard-stat-upcoming');
    const visionCountNode = document.getElementById('dashboard-vision-count');
    const streamCountNode = document.getElementById('dashboard-stream-count');

    if (statProjects) statProjects.textContent = String(goals.total);
    if (statDone) statDone.textContent = String(goals.done);
    if (statVision) statVision.textContent = String(visionCount);
    if (statUpcoming) statUpcoming.textContent = String(upcoming.length);
    if (visionCountNode) visionCountNode.textContent = String(visionCount);
    if (streamCountNode) streamCountNode.textContent = String(streams);

    renderUpcomingList();
  }

  function queueDashboardRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(refreshDashboardStats, 80);
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function startShellRedesign() {
    ensureDashboardShell();
    refreshDashboardStats();
    document.getElementById('nav-settings-btn')?.setAttribute('aria-label', 'Customize theme');
    document.getElementById('nav-logout-btn')?.setAttribute('aria-label', 'Log out');
    document.querySelector('.nav-month-btn[onclick*="-1"]')?.setAttribute('aria-label', 'Previous month');
    document.querySelector('.nav-month-btn[onclick*="1"]')?.setAttribute('aria-label', 'Next month');

    const page = document.getElementById('page-dashboard');
    if (page && page.dataset.osListenersBound !== 'true') {
      page.dataset.osListenersBound = 'true';
      page.addEventListener('click', queueDashboardRefresh, true);
      page.addEventListener('input', queueDashboardRefresh, true);
    }
  }

  document.addEventListener('pcc:pagechange', function (event) {
    if ((event.detail && event.detail.pageId) === 'dashboard') {
      setTimeout(startShellRedesign, 50);
    }
  });

  document.addEventListener('pcc:pagecontentloaded', function () {
    queueDashboardRefresh();
  });

  window.addEventListener('storage', function () {
    queueDashboardRefresh();
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      setTimeout(startShellRedesign, 120);
    });
  } else {
    setTimeout(startShellRedesign, 120);
  }
})();
