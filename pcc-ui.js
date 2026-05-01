(function () {
  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function ensureLiveRegion() {
    let region = document.getElementById('pcc-live-region');
    if (region) return region;
    region = document.createElement('div');
    region.id = 'pcc-live-region';
    region.className = 'pcc-sr-only';
    region.setAttribute('aria-live', 'polite');
    region.setAttribute('aria-atomic', 'true');
    document.body.appendChild(region);
    return region;
  }

  function announce(message, options = {}) {
    if (!message) return;
    const region = ensureLiveRegion();
    region.setAttribute('aria-live', options.priority === 'assertive' ? 'assertive' : 'polite');
    region.textContent = '';
    window.setTimeout(() => {
      region.textContent = String(message);
    }, 20);
  }

  function createActionButton(action = {}) {
    const button = document.createElement('button');
    button.type = action.type || 'button';
    button.className = `pcc-btn ${action.variant || 'secondary'}` + (action.className ? ` ${action.className}` : '');
    button.textContent = action.label || 'Continue';
    if (action.disabled) button.disabled = true;
    if (action.ariaLabel) button.setAttribute('aria-label', action.ariaLabel);
    if (action.title) button.title = action.title;
    if (action.attrs && typeof action.attrs === 'object') {
      Object.entries(action.attrs).forEach(([key, value]) => {
        if (value != null) button.setAttribute(key, String(value));
      });
    }
    if (typeof action.onClick === 'function') {
      button.addEventListener('click', action.onClick);
    } else if (action.onClickName) {
      button.setAttribute('onclick', action.onClickName);
    }
    return button;
  }

  function createStateCard(options = {}) {
    const state = options.state || 'empty';
    const tone = options.tone || (state === 'error' ? 'danger' : 'brand');
    const card = document.createElement(options.as || 'section');
    card.className = [
      'pcc-state-card',
      options.size || 'regular',
      options.layout || 'centered',
      tone,
      options.className || ''
    ].filter(Boolean).join(' ');

    card.setAttribute('role', state === 'error' ? 'alert' : 'status');
    card.setAttribute('aria-live', options.live || (state === 'error' ? 'assertive' : 'polite'));
    if (state === 'loading' || options.busy) card.setAttribute('aria-busy', 'true');

    const top = document.createElement('div');
    top.className = 'pcc-state-top';

    const iconWrap = document.createElement('div');
    iconWrap.className = 'pcc-state-icon';
    if (state === 'loading') {
      const spinner = document.createElement('span');
      spinner.className = 'pcc-state-spinner';
      spinner.setAttribute('aria-hidden', 'true');
      iconWrap.appendChild(spinner);
    } else {
      iconWrap.textContent = options.icon || (state === 'error' ? '!' : '✦');
    }

    const meta = document.createElement('div');
    meta.className = 'pcc-state-meta';

    if (options.kicker) {
      const kicker = document.createElement('p');
      kicker.className = 'pcc-state-kicker';
      kicker.textContent = options.kicker;
      meta.appendChild(kicker);
    }

    if (options.title) {
      const title = document.createElement('h3');
      title.className = 'pcc-state-title';
      title.textContent = options.title;
      meta.appendChild(title);
    }

    if (options.copy) {
      const copy = document.createElement('p');
      copy.className = 'pcc-state-copy';
      copy.textContent = options.copy;
      meta.appendChild(copy);
    }

    top.appendChild(iconWrap);
    top.appendChild(meta);
    card.appendChild(top);

    if (Array.isArray(options.actions) && options.actions.length) {
      const actions = document.createElement('div');
      actions.className = 'pcc-state-actions';
      options.actions.forEach((action) => actions.appendChild(createActionButton(action)));
      card.appendChild(actions);
    }

    return card;
  }

  function mountStateCard(target, options = {}) {
    if (!target) return null;
    target.replaceChildren(createStateCard(options));
    return target.firstElementChild;
  }

  function setButtonState(button, options = {}) {
    if (!button) return;
    const state = options.state || 'idle';
    const idleLabel = options.idleLabel || button.dataset.uiIdleLabel || button.textContent.trim() || 'Submit';
    const busyLabel = options.busyLabel || button.dataset.uiBusyLabel || 'Working...';
    const successLabel = options.successLabel || button.dataset.uiSuccessLabel || 'Done';

    button.dataset.uiIdleLabel = idleLabel;
    button.dataset.uiBusyLabel = busyLabel;
    button.dataset.uiSuccessLabel = successLabel;

    const label = state === 'busy'
      ? busyLabel
      : state === 'success'
        ? successLabel
        : (options.label || idleLabel);

    button.dataset.uiState = state;
    button.textContent = label;
    button.classList.toggle('loading', state === 'busy');
    button.classList.toggle('is-busy', state === 'busy');
    button.setAttribute('aria-busy', state === 'busy' ? 'true' : 'false');

    if (state === 'busy') {
      button.disabled = options.disabledWhileBusy !== false;
    } else if (typeof options.disabled === 'boolean') {
      button.disabled = options.disabled;
    } else {
      button.disabled = false;
    }

    if (options.announce) {
      announce(label, { priority: state === 'busy' ? 'polite' : 'assertive' });
    }
  }

  function setInlineNotice(target, options = {}) {
    if (!target) return;
    const tone = options.tone || 'info';
    const message = options.message || '';
    target.classList.add('pcc-inline-notice');
    target.classList.remove('info', 'success', 'danger', 'show');
    target.classList.add(tone);
    target.textContent = message;
    target.setAttribute('role', tone === 'danger' ? 'alert' : 'status');
    target.setAttribute('aria-live', tone === 'danger' ? 'assertive' : (options.live || 'polite'));
    if (message) {
      target.classList.add('show');
      announce(message, { priority: tone === 'danger' ? 'assertive' : 'polite' });
    }
  }

  function clearInlineNotice(target) {
    if (!target) return;
    target.textContent = '';
    target.classList.remove('show', 'info', 'success', 'danger');
  }

  window.PccUi = {
    announce,
    createStateCard,
    mountStateCard,
    setButtonState,
    setInlineNotice,
    clearInlineNotice,
    escapeHtml
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureLiveRegion);
  } else {
    ensureLiveRegion();
  }
})();
