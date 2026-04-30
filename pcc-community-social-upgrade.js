(function () {
  if (window.__pccCommunitySocialLive) return;
  window.__pccCommunitySocialLive = true;

  const SOCIAL_TABLES = {
    profiles: 'community_profiles',
    presence: 'community_presence',
    pods: 'community_pods',
    podMembers: 'community_pod_members',
    follows: 'community_follows',
    threads: 'community_threads',
    threadMembers: 'community_thread_members',
    messages: 'community_messages'
  };

  const SOCIAL_DRAFTS_KEY = 'pcc-community-live-message-drafts-v1';
  const SOCIAL_POLL_MS = 12000;
  const SOCIAL_HEARTBEAT_MS = 25000;
  const SOCIAL_ONLINE_WINDOW_MS = 90000;
  const SOCIAL_RECENT_WINDOW_MS = 15 * 60 * 1000;
  const SOCIAL_FEATURES = {
    profiles: {
      path: 'community_profiles?select=user_id&limit=1',
      fallback: 'Live profile sync is not ready yet.'
    },
    follows: {
      path: 'community_follows?select=follower_user_id&limit=1',
      fallback: 'Live follows are not ready yet.'
    },
    messages: {
      path: 'community_threads?select=id&limit=1',
      fallback: 'Live messages are not ready yet.'
    }
  };

  const socialState = {
    enabled: null,
    error: '',
    capabilities: {
      profiles: null,
      follows: null,
      messages: null
    },
    featureErrors: {
      profiles: '',
      follows: '',
      messages: ''
    },
    loading: null,
    profiles: [],
    presence: [],
    follows: [],
    pods: [],
    podMembers: [],
    threads: [],
    threadMembers: [],
    messages: [],
    activeThreadId: '',
    search: '',
    filter: 'all',
    drafts: null,
    photoDraft: '',
    photoDirty: false
  };

  let socialPollTimer = null;
  let socialPresenceTimer = null;
  let socialObserver = null;
  let decorateTimer = null;

  const legacyOpenDM = window.openDM;
  const legacySendDM = window.sendDM;
  const legacySendThreadMessageFromView = window.sendThreadMessageFromView;
  const legacyOpenEditProfile = window.openEditProfile;
  const legacyJoinPod = window.joinPod;
  const legacySubmitCreatePod = window.submitCreatePod;

  function esc(text) {
    if (typeof escapeHtml === 'function') return escapeHtml(text || '');
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escAttr(text) {
    if (typeof escapeHtmlAttr === 'function') return escapeHtmlAttr(text || '');
    return esc(text || '');
  }

  function fmtText(text) {
    return esc(text).replace(/\n/g, '<br>');
  }

  function relTime(value) {
    const time = new Date(value).getTime();
    if (!time) return 'just now';
    const diff = Date.now() - time;
    if (diff < 60000) return 'just now';
    if (diff < 3600000) return Math.max(1, Math.round(diff / 60000)) + 'm ago';
    if (diff < 86400000) return Math.max(1, Math.round(diff / 3600000)) + 'h ago';
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  }

  function clockTime(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return '';
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  }

  function getJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (error) {
      return fallback;
    }
  }

  function setJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {}
  }

  function toast(message) {
    if (typeof safeShowToast === 'function') {
      safeShowToast(message);
      return;
    }
    if (typeof showToast === 'function') {
      showToast(message);
      return;
    }
    console.log('[Community]', message);
  }

  function currentAuth() {
    return getJson('pcc-auth-session', null) || {};
  }

  function currentToken() {
    return getJson('pcc-sb-token', null) || {};
  }

  function currentUserId() {
    return currentAuth().id || currentToken().user?.id || '';
  }

  function localProfile() {
    if (typeof loadCommProfile === 'function') loadCommProfile();
    return typeof commProfile !== 'undefined' ? commProfile : {};
  }

  function currentUserName() {
    const profile = localProfile();
    return profile.name || (typeof getCurrentUserName === 'function' ? getCurrentUserName() : 'You');
  }

  function currentUserHandle() {
    const profile = localProfile();
    return profile.handle || ('@' + String(currentUserName() || 'you').toLowerCase().replace(/\s+/g, ''));
  }

  function normalizeColor(value) {
    return /^#[0-9A-Fa-f]{6}$/.test(value || '') ? value : '#0A7266';
  }

  function initials(name) {
    const clean = String(name || '').trim();
    if (!clean) return 'U';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  function pairKey(a, b) {
    return [String(a || ''), String(b || '')].sort().join('__');
  }

  function isCommunityActive() {
    return !!document.querySelector('#page-community.page.active');
  }

  function isOnline(row) {
    const seen = new Date(row?.last_seen || '').getTime();
    const status = String(row?.status || 'online').toLowerCase();
    return !!seen && (Date.now() - seen) <= SOCIAL_ONLINE_WINDOW_MS && status !== 'away' && status !== 'offline';
  }

  function isRecent(row) {
    const seen = new Date(row?.last_seen || '').getTime();
    return !!seen && (Date.now() - seen) <= SOCIAL_RECENT_WINDOW_MS;
  }

  function currentPresencePage() {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return 'Community';
    const title = activePage.querySelector('.pg-header h1')?.textContent?.trim();
    if (title) return title;
    const pageId = String(activePage.id || '').replace(/^page-/, '').trim();
    return pageId ? (pageId.charAt(0).toUpperCase() + pageId.slice(1)) : 'Community';
  }

  function ensureSocialDrafts() {
    if (socialState.drafts) return;
    socialState.drafts = getJson(SOCIAL_DRAFTS_KEY, {}) || {};
  }

  function saveSocialDrafts() {
    ensureSocialDrafts();
    setJson(SOCIAL_DRAFTS_KEY, socialState.drafts);
  }

  function profileByUserId(userId) {
    if (userId === currentUserId()) {
      const profile = localProfile();
      return {
        user_id: currentUserId(),
        display_name: currentUserName(),
        handle: currentUserHandle(),
        color: normalizeColor(profile.color),
        avatar_text: initials(currentUserName()),
        photo_url: profile.photoUrl || ''
      };
    }
    return socialState.profiles.find((row) => row.user_id === userId) || null;
  }

  function presenceByUserId(userId) {
    return socialState.presence.find((row) => row.user_id === userId) || null;
  }

  function resolveProfile(ref) {
    const needle = String(ref || '').trim();
    if (!needle) return null;
    if (needle === currentUserId()) return profileByUserId(needle);
    const lower = needle.toLowerCase();
    return socialState.profiles.find((row) => {
      return row.user_id === needle
        || String(row.display_name || '').toLowerCase() === lower
        || String(row.handle || '').toLowerCase() === lower
        || String(row.handle || '').replace(/^@/, '').toLowerCase() === lower.replace(/^@/, '');
    }) || null;
  }

  function communityRequest(path, options) {
    const token = currentToken().access_token || '';
    if (!token) return Promise.reject(new Error('Missing session token.'));
    return fetch(SUPABASE_URL + '/rest/v1/' + path, {
      method: options?.method || 'GET',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: 'Bearer ' + token,
        Accept: 'application/json',
        ...(options?.body ? { 'Content-Type': 'application/json' } : {}),
        ...(options?.headers || {})
      },
      body: options?.body ? JSON.stringify(options.body) : undefined
    }).then(async (response) => {
      const contentType = response.headers.get('content-type') || '';
      const payload = contentType.includes('application/json')
        ? await response.json().catch(() => null)
        : await response.text().catch(() => '');
      if (!response.ok) {
        throw new Error(payload?.message || payload?.hint || payload?.details || payload || ('Community request failed (' + response.status + ')'));
      }
      return payload;
    });
  }

  function communityUpsert(table, body, conflictColumns) {
    const query = conflictColumns ? ('?on_conflict=' + encodeURIComponent(conflictColumns)) : '';
    return communityRequest(table + query, {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=representation' },
      body
    });
  }

  function communityDelete(path) {
    return communityRequest(path, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' }
    });
  }

  function resetSocialCapabilities() {
    socialState.enabled = null;
    socialState.error = '';
    Object.keys(socialState.capabilities).forEach((key) => {
      socialState.capabilities[key] = null;
    });
    Object.keys(socialState.featureErrors).forEach((key) => {
      socialState.featureErrors[key] = '';
    });
  }

  function markCapabilityResult(feature, ok, error) {
    if (!feature || !SOCIAL_FEATURES[feature]) return ok;
    socialState.capabilities[feature] = !!ok;
    socialState.featureErrors[feature] = ok ? '' : (error?.message || SOCIAL_FEATURES[feature].fallback);
    if (feature === 'messages') {
      socialState.enabled = !!ok;
      socialState.error = socialState.featureErrors[feature];
    }
    return !!ok;
  }

  async function ensureSocialCapability(feature, force) {
    if (!SOCIAL_FEATURES[feature]) return false;
    if (!currentUserId()) {
      resetSocialCapabilities();
      return false;
    }
    if (!force && socialState.capabilities[feature] !== null) return socialState.capabilities[feature];
    try {
      await communityRequest(SOCIAL_FEATURES[feature].path);
      return markCapabilityResult(feature, true);
    } catch (error) {
      return markCapabilityResult(feature, false, error);
    }
  }

  async function ensureSocialMode(force) {
    return ensureSocialCapability('messages', force);
  }

  async function ensureProfileMode(force) {
    return ensureSocialCapability('profiles', force);
  }

  async function ensureFollowMode(force) {
    const [profilesReady, followsReady] = await Promise.all([
      ensureSocialCapability('profiles', force),
      ensureSocialCapability('follows', force)
    ]);
    return !!(profilesReady && followsReady);
  }

  async function safeCommunityList(path, feature, force) {
    if (feature && !(await ensureSocialCapability(feature, force))) return [];
    try {
      const rows = await communityRequest(path);
      return Array.isArray(rows) ? rows : [];
    } catch (error) {
      if (feature) markCapabilityResult(feature, false, error);
      return [];
    }
  }

  async function syncSocialProfile(force) {
    if (!(await ensureProfileMode(force))) return false;
    const profile = localProfile();
    await communityUpsert(SOCIAL_TABLES.profiles, {
      user_id: currentUserId(),
      display_name: currentUserName(),
      handle: currentUserHandle(),
      bio: profile.bio || '',
      color: normalizeColor(profile.color),
      avatar_text: initials(currentUserName()),
      photo_url: profile.photoUrl || '',
      updated_at: new Date().toISOString()
    }, 'user_id');
    return true;
  }

  async function syncSocialPresence(force, statusOverride) {
    if (!(await ensureProfileMode(force))) return false;
    const profile = localProfile();
    const now = new Date().toISOString();
    const status = statusOverride || (document.visibilityState === 'visible' ? 'online' : 'away');
    const payload = {
      user_id: currentUserId(),
      display_name: currentUserName(),
      handle: currentUserHandle(),
      color: normalizeColor(profile.color || '#0A7266'),
      current_page: currentPresencePage(),
      status,
      last_seen: now,
      updated_at: now
    };
    await communityUpsert(SOCIAL_TABLES.presence, payload, 'user_id');
    const existing = socialState.presence.find((row) => row.user_id === payload.user_id);
    if (existing) Object.assign(existing, payload);
    else socialState.presence.push(payload);
    return true;
  }

  function ensureSocialStyles() {
    if (document.getElementById('pcc-community-social-styles')) return;
    const style = document.createElement('style');
    style.id = 'pcc-community-social-styles';
    style.textContent = `
      .comm-avatar.has-photo,.comm-composer-avatar.has-photo,.comm-post-avatar.has-photo,.comm-member-av.has-photo,.comm-thread-avatar.has-photo,.comm-modal-avatar-preview.has-photo{
        padding:0 !important;
        overflow:hidden;
        background:rgba(255,255,255,0.1) !important;
      }
      .comm-avatar.has-photo img,.comm-composer-avatar.has-photo img,.comm-post-avatar.has-photo img,.comm-member-av.has-photo img,.comm-thread-avatar.has-photo img,.comm-modal-avatar-preview.has-photo img{
        width:100%;
        height:100%;
        object-fit:cover;
        display:block;
      }
      .comm-follow-btn,.comm-inline-message-btn{
        background:var(--surface2);
        border:1px solid var(--teal-border);
        border-radius:10px;
        color:var(--teal);
        cursor:pointer;
        font-family:'DM Sans',sans-serif;
        font-size:.54rem;
        font-weight:700;
        letter-spacing:.11em;
        padding:.42rem .68rem;
        text-transform:uppercase;
        transition:all .18s ease;
      }
      .comm-follow-btn:hover,.comm-inline-message-btn:hover{
        background:var(--tint);
        border-color:rgba(var(--teal-rgb),0.34);
      }
      .comm-follow-btn.following{
        background:rgba(var(--teal-rgb),0.1);
      }
      .comm-member-actions{
        display:flex;
        gap:.35rem;
        align-items:center;
        margin-left:.6rem;
      }
      .comm-online-count{
        margin-left:auto;
        display:inline-flex;
        align-items:center;
        justify-content:center;
        min-width:1.5rem;
        height:1.1rem;
        padding:0 .38rem;
        border-radius:999px;
        background:var(--tint);
        border:1px solid var(--teal-border);
        color:var(--charcoal);
        font-size:.45rem;
      }
      .comm-online-list{
        display:flex;
        flex-direction:column;
        gap:.22rem;
      }
      .comm-online-empty{
        padding:.85rem .15rem .25rem;
        color:var(--muted);
        font-size:.68rem;
        line-height:1.6;
      }
      .comm-member-copy{
        min-width:0;
        flex:1;
        display:flex;
        flex-direction:column;
        gap:.08rem;
      }
      .comm-member-presence{
        display:inline-flex;
        align-items:center;
        gap:.34rem;
        margin-left:auto;
        padding:.22rem .48rem;
        border-radius:999px;
        background:rgba(34,197,94,0.08);
        border:1px solid rgba(34,197,94,0.18);
        color:#15622D;
        font-size:.48rem;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
      }
      .comm-member-live-dot{
        width:7px;
        height:7px;
        border-radius:50%;
        background:#22C55E;
        box-shadow:0 0 0 4px rgba(34,197,94,0.12);
      }
      .comm-member-live-text{
        white-space:nowrap;
      }
      .comm-member[data-self="true"] .comm-member-presence{
        background:rgba(var(--teal-rgb),0.08);
        border-color:rgba(var(--teal-rgb),0.18);
        color:var(--teal);
      }
      #page-community .comm-messages-layout{
        grid-template-columns:340px minmax(0,1fr);
        min-height:650px;
      }
      #page-community .comm-thread-list{
        max-height:560px;
        padding:.95rem;
      }
      #page-community .comm-thread-scroll{
        max-height:470px;
        padding:1.1rem 1.2rem;
      }
      #page-community .comm-thread-msg{
        max-width:min(84%,460px);
      }
      #page-community .comm-thread-bubble{
        font-size:.88rem;
        line-height:1.72;
      }
      #page-community .comm-thread-sender{
        font-size:.53rem;
        font-weight:700;
        letter-spacing:.08em;
        text-transform:uppercase;
        color:var(--teal);
        padding:0 .22rem;
      }
      #page-community .comm-thread-compose textarea{
        min-height:108px;
      }
      #page-community .comm-thread-compose-note{
        font-size:.56rem;
        color:var(--muted);
      }
      #page-community .comm-thread-live-chip{
        display:inline-flex;
        align-items:center;
        gap:.35rem;
        border-radius:999px;
        background:var(--tint);
        border:1px solid var(--teal-border);
        color:var(--charcoal);
        font-size:.48rem;
        font-weight:700;
        letter-spacing:.1em;
        padding:.2rem .5rem;
        text-transform:uppercase;
      }
      #page-community .comm-thread-live-chip .dot{
        width:7px;
        height:7px;
        border-radius:50%;
        background:#22C55E;
      }
      #page-community .comm-thread-live-chip .dot.away{
        background:#F59E0B;
      }
      #page-community .comm-message-empty{
        padding:1.1rem 1.15rem;
        border-radius:18px;
        background:var(--surface2);
        border:1px dashed var(--teal-border);
        color:var(--charcoal);
        line-height:1.7;
      }
      #comm-dm-panel.comm-dm-panel{
        width:min(580px,calc(100vw - 1rem));
        height:680px;
      }
      #edit-profile-overlay .comm-photo-actions{
        display:flex;
        gap:.45rem;
        flex-wrap:wrap;
        margin-top:.55rem;
      }
      #edit-profile-overlay .comm-photo-note{
        font-size:.56rem;
        color:var(--muted);
        margin-top:.45rem;
        line-height:1.55;
      }
      @media(max-width:960px){
        .comm-member{
          flex-wrap:wrap;
        }
        .comm-member-presence{
          order:3;
          margin-left:2rem;
        }
        #page-community .comm-messages-layout{
          grid-template-columns:1fr;
        }
        #comm-dm-panel.comm-dm-panel{
          width:calc(100vw - .8rem);
          right:.4rem;
          left:.4rem;
          bottom:.4rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function ensureProfilePhotoControls() {
    const row = document.getElementById('edit-profile-avatar-row');
    if (!row || document.getElementById('comm-profile-photo-input')) return;
    const block = document.createElement('div');
    block.className = 'comm-modal-field';
    block.innerHTML = `
      <label class="comm-modal-label">Photo Options</label>
      <div class="comm-photo-actions">
        <button class="comm-modal-cancel" type="button" onclick="openCommunityPhotoPicker()">Upload Photo</button>
        <button class="comm-modal-cancel" type="button" onclick="clearCommunityProfilePhoto()">Remove Photo</button>
        <input id="comm-profile-photo-input" type="file" accept="image/*" hidden onchange="handleCommunityProfilePhoto(this)" />
      </div>
      <div class="comm-photo-note">Square photos work best. Your image is saved to your Community profile and shows up in the feed, messages, and live member list.</div>
    `;
    row.insertAdjacentElement('afterend', block);
  }

  function readFileAsDataUrl(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function compressProfilePhoto(file) {
    if (!file || !String(file.type || '').startsWith('image/')) return '';
    const raw = await readFileAsDataUrl(file);
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const maxDim = 420;
        const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.88));
      };
      img.onerror = () => resolve(raw);
      img.src = raw;
    });
  }

  function applyAvatar(node, profile, fallbackName, twoLetters) {
    if (!node) return;
    const photo = String(profile?.photo_url || profile?.photoUrl || '').trim();
    const color = normalizeColor(profile?.color || localProfile().color || '#0A7266');
    const letters = (profile?.avatar_text || initials(profile?.display_name || fallbackName || 'U')).slice(0, twoLetters ? 2 : 1);
    node.style.background = 'linear-gradient(135deg,' + color + ',' + color + 'bb)';
    if (photo) {
      node.classList.add('has-photo');
      node.innerHTML = '<img src="' + escAttr(photo) + '" alt="' + escAttr(profile?.display_name || fallbackName || 'Profile') + '" />';
      return;
    }
    node.classList.remove('has-photo');
    node.innerHTML = '';
    node.textContent = letters;
  }

  function renderEditAvatarPreview() {
    const preview = document.getElementById('edit-avatar-preview');
    if (!preview) return;
    const profile = localProfile();
    const name = document.getElementById('edit-display-name')?.value.trim() || currentUserName();
    applyAvatar(preview, {
      display_name: name,
      color: normalizeColor(profile.color || '#0A7266'),
      photo_url: socialState.photoDirty ? socialState.photoDraft : (profile.photoUrl || ''),
      avatar_text: initials(name)
    }, name, false);
  }

  window.openCommunityPhotoPicker = function () {
    document.getElementById('comm-profile-photo-input')?.click();
  };

  window.handleCommunityProfilePhoto = async function (input) {
    const file = input?.files?.[0];
    if (!file) return;
    socialState.photoDraft = await compressProfilePhoto(file);
    socialState.photoDirty = true;
    renderEditAvatarPreview();
    if (input) input.value = '';
  };

  window.clearCommunityProfilePhoto = function () {
    socialState.photoDraft = '';
    socialState.photoDirty = true;
    renderEditAvatarPreview();
  };

  function currentUserProfileRow() {
    const profile = localProfile();
    return {
      user_id: currentUserId(),
      display_name: currentUserName(),
      handle: currentUserHandle(),
      color: normalizeColor(profile.color || '#0A7266'),
      avatar_text: initials(currentUserName()),
      photo_url: profile.photoUrl || ''
    };
  }

  function currentUserFollows(userId) {
    return socialState.follows.some((row) => row.follower_user_id === currentUserId() && row.followee_user_id === userId);
  }

  function followerCount(userId) {
    return socialState.follows.filter((row) => row.followee_user_id === userId).length;
  }

  function followingCount(userId) {
    return socialState.follows.filter((row) => row.follower_user_id === userId).length;
  }

  function podByRef(ref) {
    const needle = String(ref || '').trim();
    return socialState.pods.find((pod) => pod.id === needle || pod.name === needle) || null;
  }

  function threadMembersFor(threadId) {
    return socialState.threadMembers.filter((row) => row.thread_id === threadId);
  }

  function messagesFor(threadId) {
    return socialState.messages.filter((row) => row.thread_id === threadId);
  }

  function membershipFor(threadId) {
    return socialState.threadMembers.find((row) => row.thread_id === threadId && row.user_id === currentUserId()) || null;
  }

  function unreadCount(threadId) {
    const membership = membershipFor(threadId);
    const seenAt = new Date(membership?.last_read_at || 0).getTime();
    return messagesFor(threadId).filter((row) => row.user_id !== currentUserId() && new Date(row.created_at || 0).getTime() > seenAt).length;
  }

  function lastMessage(threadId) {
    const list = messagesFor(threadId);
    return list[list.length - 1] || null;
  }

  function otherUserForThread(thread) {
    if (!thread || thread.kind !== 'dm') return null;
    const otherMember = threadMembersFor(thread.id).find((row) => row.user_id !== currentUserId());
    return otherMember ? profileByUserId(otherMember.user_id) : null;
  }

  async function refreshSocialState(force) {
    if (socialState.loading && !force) return socialState.loading;
    socialState.loading = (async function () {
      ensureSocialDrafts();
      if (!(await ensureProfileMode(force))) {
        socialState.profiles = [];
        socialState.presence = [];
        socialState.follows = [];
        socialState.pods = [];
        socialState.podMembers = [];
        socialState.threads = [];
        socialState.threadMembers = [];
        socialState.messages = [];
        return;
      }
      await syncSocialProfile(force).catch(() => {});
      await syncSocialPresence(force).catch(() => {});
      const followsReady = await ensureFollowMode(force);
      const messagesReady = await ensureSocialMode(force);
      const [profiles, presence, follows, pods, podMembers, threads, threadMembers, messages] = await Promise.all([
        safeCommunityList(SOCIAL_TABLES.profiles + '?select=user_id,display_name,handle,bio,color,avatar_text,photo_url,updated_at&limit=400', 'profiles', force),
        safeCommunityList(SOCIAL_TABLES.presence + '?select=user_id,display_name,handle,color,current_page,status,last_seen,updated_at&limit=400', null, force),
        followsReady
          ? safeCommunityList(SOCIAL_TABLES.follows + '?select=follower_user_id,followee_user_id,created_at&limit=1500', 'follows', force)
          : Promise.resolve([]),
        safeCommunityList(SOCIAL_TABLES.pods + '?select=id,name,emoji,description,created_by,created_at&order=created_at.desc&limit=120', null, force),
        safeCommunityList(SOCIAL_TABLES.podMembers + '?select=pod_id,user_id,joined_at&limit=2000', null, force),
        messagesReady
          ? safeCommunityList(SOCIAL_TABLES.threads + '?select=id,kind,title,emoji,subtitle,created_by,dm_key,pod_id,created_at,updated_at&order=updated_at.desc&limit=300', 'messages', force)
          : Promise.resolve([]),
        messagesReady
          ? safeCommunityList(SOCIAL_TABLES.threadMembers + '?select=thread_id,user_id,joined_at,last_read_at,pinned&limit=3000', 'messages', force)
          : Promise.resolve([]),
        messagesReady
          ? safeCommunityList(SOCIAL_TABLES.messages + '?select=id,thread_id,user_id,body,gif_url,gif_title,created_at&order=created_at.asc&limit=4000', 'messages', force)
          : Promise.resolve([])
      ]);
      socialState.profiles = Array.isArray(profiles) ? profiles : [];
      socialState.presence = Array.isArray(presence) ? presence.filter(isRecent) : [];
      socialState.follows = Array.isArray(follows) ? follows : [];
      socialState.pods = Array.isArray(pods) ? pods : [];
      socialState.podMembers = Array.isArray(podMembers) ? podMembers : [];
      socialState.threads = Array.isArray(threads) ? threads : [];
      socialState.threadMembers = Array.isArray(threadMembers) ? threadMembers : [];
      socialState.messages = Array.isArray(messages) ? messages : [];
    })().finally(() => {
      socialState.loading = null;
    });
    return socialState.loading;
  }

  function socialThreadMeta(thread) {
    const last = lastMessage(thread.id);
    const members = threadMembersFor(thread.id);
    if (thread.kind === 'pod') {
      const onlineCount = members.filter((row) => isOnline(presenceByUserId(row.user_id))).length;
      return {
        id: thread.id,
        title: thread.title || 'Pod',
        subtitle: thread.subtitle || (members.length ? (members.length + ' members') : 'Pod thread'),
        avatarProfile: null,
        avatarText: thread.emoji || initials(thread.title),
        last,
        unread: unreadCount(thread.id),
        typeLabel: 'Pod thread',
        secondaryLabel: onlineCount ? (onlineCount + ' live now') : ((members.length || 0) + ' members'),
        online: onlineCount > 0,
        followUserId: ''
      };
    }
    const profile = otherUserForThread(thread);
    const presence = presenceByUserId(profile?.user_id);
    const online = isOnline(presence);
    return {
      id: thread.id,
      title: profile?.display_name || thread.title || 'Conversation',
      subtitle: profile?.handle || thread.subtitle || 'Direct message',
      avatarProfile: profile,
      avatarText: profile?.avatar_text || thread.emoji || initials(profile?.display_name || thread.title || 'U'),
      last,
      unread: unreadCount(thread.id),
      typeLabel: 'Direct message',
      secondaryLabel: online ? (presence?.current_page || 'Online now') : ('Seen ' + relTime(presence?.last_seen || last?.created_at)),
      online,
      followUserId: profile?.user_id || ''
    };
  }

  function visibleThreads() {
    const needle = String(socialState.search || '').trim().toLowerCase();
    return socialState.threads
      .slice()
      .filter((thread) => {
        const meta = socialThreadMeta(thread);
        if (socialState.filter === 'pods' && thread.kind !== 'pod') return false;
        if (socialState.filter === 'dms' && thread.kind !== 'dm') return false;
        if (socialState.filter === 'unread' && !meta.unread) return false;
        if (!needle) return true;
        return [meta.title, meta.subtitle, meta.secondaryLabel, meta.last?.body || meta.last?.gif_title || '']
          .join(' ')
          .toLowerCase()
          .includes(needle);
      })
      .sort((a, b) => {
        const unreadDelta = Number(!!socialThreadMeta(b).unread) - Number(!!socialThreadMeta(a).unread);
        if (unreadDelta) return unreadDelta;
        return new Date(lastMessage(b.id)?.created_at || b.updated_at || 0) - new Date(lastMessage(a.id)?.created_at || a.updated_at || 0);
      });
  }

  function activePresenceRows() {
    return socialState.presence
      .filter((row) => isOnline(row))
      .sort((a, b) => {
        const selfDelta = Number(b.user_id === currentUserId()) - Number(a.user_id === currentUserId());
        if (selfDelta) return selfDelta;
        return new Date(b.last_seen || 0) - new Date(a.last_seen || 0);
      });
  }

  function ensureActiveThread() {
    const visible = visibleThreads();
    if (!socialState.activeThreadId || !visible.some((thread) => thread.id === socialState.activeThreadId)) {
      socialState.activeThreadId = visible[0]?.id || '';
    }
    return socialState.threads.find((thread) => thread.id === socialState.activeThreadId) || null;
  }

  async function markThreadRead(threadId) {
    if (!threadId || !(await ensureSocialMode())) return;
    const existing = membershipFor(threadId);
    const payload = {
      thread_id: threadId,
      user_id: currentUserId(),
      joined_at: existing?.joined_at || new Date().toISOString(),
      last_read_at: new Date().toISOString(),
      pinned: !!existing?.pinned
    };
    await communityUpsert(SOCIAL_TABLES.threadMembers, payload, 'thread_id,user_id');
    const localRow = membershipFor(threadId);
    if (localRow) localRow.last_read_at = payload.last_read_at;
    else socialState.threadMembers.push(payload);
  }

  async function ensureDirectThread(ref) {
    await refreshSocialState(false);
    const target = resolveProfile(ref);
    if (!target || target.user_id === currentUserId()) return null;
    const key = pairKey(currentUserId(), target.user_id);
    let thread = socialState.threads.find((row) => row.kind === 'dm' && row.dm_key === key);
    if (!thread) {
      const createdRows = await communityUpsert(SOCIAL_TABLES.threads, {
        kind: 'dm',
        title: target.display_name,
        emoji: target.avatar_text || initials(target.display_name),
        subtitle: target.handle || '',
        created_by: currentUserId(),
        dm_key: key,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 'dm_key');
      thread = Array.isArray(createdRows) ? createdRows[0] : createdRows;
      const now = new Date().toISOString();
      await communityUpsert(SOCIAL_TABLES.threadMembers, [
        { thread_id: thread.id, user_id: currentUserId(), joined_at: now, last_read_at: now, pinned: true },
        { thread_id: thread.id, user_id: target.user_id, joined_at: now, last_read_at: now, pinned: false }
      ], 'thread_id,user_id');
    }
    await refreshSocialState(true);
    return socialState.threads.find((row) => row.id === thread.id) || thread;
  }

  async function ensurePodThread(ref) {
    await refreshSocialState(false);
    const pod = podByRef(ref);
    if (!pod) return null;
    let thread = socialState.threads.find((row) => row.kind === 'pod' && row.pod_id === pod.id);
    if (!thread) {
      const createdRows = await communityUpsert(SOCIAL_TABLES.threads, {
        kind: 'pod',
        title: pod.name,
        emoji: pod.emoji || 'POD',
        subtitle: pod.description || '',
        created_by: currentUserId(),
        pod_id: pod.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, 'pod_id');
      thread = Array.isArray(createdRows) ? createdRows[0] : createdRows;
    }
    const podMembers = socialState.podMembers.filter((row) => row.pod_id === pod.id);
    const now = new Date().toISOString();
    const memberRows = (podMembers.length ? podMembers : [{ user_id: currentUserId() }]).map((row) => ({
      thread_id: thread.id,
      user_id: row.user_id,
      joined_at: row.joined_at || now,
      last_read_at: row.user_id === currentUserId() ? now : (membershipFor(thread.id)?.last_read_at || now),
      pinned: row.user_id === currentUserId()
    }));
    await communityUpsert(SOCIAL_TABLES.threadMembers, memberRows, 'thread_id,user_id');
    await refreshSocialState(true);
    return socialState.threads.find((row) => row.id === thread.id) || thread;
  }

  async function ensurePodThreadMembership(ref) {
    if (!(await ensureSocialMode(true))) return;
    try {
      await ensurePodThread(ref);
    } catch (error) {
      console.warn('Could not sync pod thread:', error);
    }
  }

  function threadAvatarMarkup(meta) {
    const photo = String(meta.avatarProfile?.photo_url || '').trim();
    const color = normalizeColor(meta.avatarProfile?.color || localProfile().color || '#0A7266');
    const text = esc(meta.avatarText || initials(meta.title || 'U')).slice(0, 2);
    return `
      <div class="comm-thread-avatar ${photo ? 'has-photo' : ''}" style="${photo ? '' : ('background:linear-gradient(135deg,' + color + ',' + color + 'bb);')}">
        ${photo ? '<img src="' + escAttr(photo) + '" alt="' + escAttr(meta.title) + '" />' : text}
      </div>
    `;
  }

  function messageMarkup(message, thread) {
    const mine = message.user_id === currentUserId();
    const sender = profileByUserId(message.user_id) || { display_name: mine ? currentUserName() : 'Member', photo_url: '', color: '#0A7266', avatar_text: initials(mine ? currentUserName() : 'Member') };
    return `
      <div class="comm-thread-msg ${mine ? 'mine' : 'theirs'}">
        ${!mine ? '<div class="comm-thread-sender">' + esc(sender.display_name || 'Member') + '</div>' : ''}
        ${message.body ? '<div class="comm-thread-bubble">' + fmtText(message.body) + '</div>' : ''}
        ${message.gif_url ? '<img class="comm-thread-media" src="' + escAttr(message.gif_url) + '" alt="' + escAttr(message.gif_title || 'GIF') + '" />' : ''}
        <div class="comm-thread-meta">${esc(mine ? 'You' : sender.display_name || 'Member')} • ${esc(clockTime(message.created_at))}</div>
      </div>
    `;
  }

  function threadPaneMarkup(thread) {
    const meta = socialThreadMeta(thread);
    const messages = messagesFor(thread.id);
    ensureSocialDrafts();
    return `
      <div class="comm-thread-pane-head">
        <div class="comm-thread-pane-copy">
          <div class="comm-thread-pane-title">
            ${threadAvatarMarkup(meta)}
            <div>
              <div class="comm-thread-pane-name">${esc(meta.title)}</div>
              <div class="comm-thread-pane-sub">${esc(meta.subtitle)}</div>
            </div>
          </div>
          <div class="comm-thread-pane-meta">
            <span class="comm-thread-chip">${esc(meta.typeLabel)}</span>
            <span class="comm-thread-live-chip"><span class="dot ${meta.online ? '' : 'away'}"></span>${esc(meta.secondaryLabel)}</span>
            ${meta.followUserId ? `<span class="comm-thread-chip soft">${followerCount(meta.followUserId)} followers</span>` : ''}
          </div>
        </div>
        <div class="comm-thread-pane-actions">
          ${meta.followUserId ? `<button class="comm-thread-pane-action" type="button" onclick="toggleCommunityFollow('${escAttr(meta.followUserId)}')">${currentUserFollows(meta.followUserId) ? 'Following' : 'Follow'}</button>` : ''}
          <button class="comm-thread-pane-action" type="button" onclick="openDM('${escAttr(thread.kind === 'pod' ? (thread.pod_id || thread.title) : (meta.followUserId || meta.title))}', '', { type: '${thread.kind}' })">Pop Out</button>
        </div>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${messages.length ? messages.map((message) => messageMarkup(message, thread)).join('') : '<div class="comm-message-empty">No messages yet. Start the conversation and it will appear here live for everyone in this thread.</div>'}</div></div>
      <div class="comm-thread-compose">
        <textarea id="comm-message-input" placeholder="Send a message into this live thread..." oninput="updateThreadDraft('${escAttr(thread.id)}', this.value)">${esc(socialState.drafts[thread.id] || '')}</textarea>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-note">Press Enter to send. Use Shift+Enter for a new line.</div>
          <button class="comm-thread-send" type="button" onclick="sendThreadMessageFromView()">Send</button>
        </div>
      </div>
    `;
  }

  function renderMessagesContent(container) {
    ensureSocialStyles();
    const enabled = socialState.capabilities.messages;
    if (enabled === false) {
      container.innerHTML = `
        <div class="comm-view-panel">
          <div class="comm-view-title">Messages</div>
          <div class="comm-view-sub">Live direct messages still need the updated Community thread SQL.</div>
          <div class="comm-message-empty">Profiles, follows, and photos can keep working while we wait. Run the latest <code>community-live-supabase.sql</code> in Supabase to turn on the shared thread tables and message policies.</div>
        </div>
      `;
      return;
    }

    const threads = visibleThreads();
    const active = ensureActiveThread();
    const totalThreads = socialState.threads.length;
    const podThreads = socialState.threads.filter((thread) => thread.kind === 'pod').length;
    const directThreads = socialState.threads.filter((thread) => thread.kind === 'dm').length;
    const unreadThreads = socialState.threads.reduce((sum, thread) => sum + unreadCount(thread.id), 0);

    container.innerHTML = `
      <div class="comm-messages-shell">
        <div class="comm-messages-layout">
          <div class="comm-thread-sidebar">
            <div class="comm-thread-sidebar-head">
              <input class="comm-thread-search" type="text" value="${escAttr(socialState.search)}" placeholder="Search conversations..." oninput="filterMessageThreads(this.value)" />
              <div class="comm-thread-filter-row">
                <button class="comm-thread-filter ${socialState.filter === 'all' ? 'active' : ''}" type="button" onclick="setMessageFilter('all')">All <span class="comm-thread-filter-count">${totalThreads}</span></button>
                <button class="comm-thread-filter ${socialState.filter === 'unread' ? 'active' : ''}" type="button" onclick="setMessageFilter('unread')">Unread <span class="comm-thread-filter-count">${unreadThreads}</span></button>
                <button class="comm-thread-filter ${socialState.filter === 'dms' ? 'active' : ''}" type="button" onclick="setMessageFilter('dms')">DMs <span class="comm-thread-filter-count">${directThreads}</span></button>
                <button class="comm-thread-filter ${socialState.filter === 'pods' ? 'active' : ''}" type="button" onclick="setMessageFilter('pods')">Pods <span class="comm-thread-filter-count">${podThreads}</span></button>
              </div>
              <div class="comm-thread-overview">
                <div class="comm-thread-overview-card"><div class="comm-thread-overview-label">Following</div><div class="comm-thread-overview-value">${followingCount(currentUserId())}</div></div>
                <div class="comm-thread-overview-card"><div class="comm-thread-overview-label">Followers</div><div class="comm-thread-overview-value">${followerCount(currentUserId())}</div></div>
                <div class="comm-thread-overview-card"><div class="comm-thread-overview-label">Online</div><div class="comm-thread-overview-value">${socialState.presence.filter(isOnline).length}</div></div>
              </div>
            </div>
            <div class="comm-thread-list">
              ${threads.length ? threads.map((thread) => {
                const meta = socialThreadMeta(thread);
                return `
                  <button class="comm-thread-item ${thread.id === socialState.activeThreadId ? 'active' : ''}" type="button" onclick="selectMessageThread('${thread.id}')">
                    ${threadAvatarMarkup(meta)}
                    <div class="comm-thread-copy">
                      <div class="comm-thread-name-row">
                        <div class="comm-thread-name-wrap">
                          <div class="comm-thread-name">${esc(meta.title)}</div>
                          <div class="comm-thread-sub">${esc(meta.subtitle)}</div>
                        </div>
                        <div class="comm-thread-badges">
                          ${meta.unread ? `<span class="comm-thread-unread">${meta.unread}</span>` : ''}
                          <div class="comm-thread-time">${esc(relTime(meta.last?.created_at || thread.updated_at))}</div>
                        </div>
                      </div>
                      <div class="comm-thread-chip-row">
                        <span class="comm-thread-chip">${esc(meta.typeLabel)}</span>
                        <span class="comm-thread-chip soft">${esc(meta.secondaryLabel)}</span>
                      </div>
                      <div class="comm-thread-snippet">${esc(meta.last?.body || meta.last?.gif_title || 'Start the conversation.')}</div>
                    </div>
                  </button>
                `;
              }).join('') : '<div class="comm-message-empty">No live conversations yet. Follow someone from the feed or online list, then start the first message.</div>'}
            </div>
          </div>
          <div class="comm-thread-pane">${active ? threadPaneMarkup(active) : '<div class="comm-message-empty" style="margin:1rem;">Choose a conversation to open it here.</div>'}</div>
        </div>
      </div>
    `;
  }

  function renderOnlineMembersCard() {
    const card = document.querySelector('#page-community .comm-online-card');
    if (!card) return;
    const rows = activePresenceRows();
    card.innerHTML = `
      <div class="comm-online-label"><div class="online-dot"></div> Active Now <span class="comm-online-count">${rows.length}</span></div>
      <div class="comm-online-list">
        ${rows.length ? rows.map((row) => {
          const profile = profileByUserId(row.user_id) || {
            user_id: row.user_id,
            display_name: row.display_name || 'Member',
            handle: row.handle || '',
            color: row.color || '#0A7266',
            avatar_text: initials(row.display_name || 'Member'),
            photo_url: ''
          };
          const label = row.user_id === currentUserId() ? ((profile.display_name || 'You') + ' (You)') : (profile.display_name || 'Member');
          return `
            <div class="comm-member" data-user-id="${escAttr(profile.user_id)}" ${row.user_id === currentUserId() ? 'data-self="true"' : ''}>
              <div class="comm-member-av">${esc((profile.avatar_text || initials(profile.display_name || 'M')).slice(0, 2))}</div>
              <div class="comm-member-copy">
                <span class="comm-member-name">${esc(label)}</span>
                <span class="comm-member-status">${esc(row.current_page || 'Online now')}</span>
              </div>
              <div class="comm-member-presence"><span class="comm-member-live-dot"></span><span class="comm-member-live-text">Active</span></div>
            </div>
          `;
        }).join('') : `
          <div class="comm-online-empty">No one else is active right now. Keep the tab open and this list updates live.</div>
        `}
      </div>
    `;
  }

  function rerenderMessagesIfVisible() {
    const main = document.getElementById('comm-main');
    if (!main || main.dataset.view !== 'messages') return;
    const container = document.getElementById('comm-view-panel-container');
    if (!container) return;
    renderMessagesContent(container);
  }

  function renderDmPanel(openNow) {
    const panel = document.getElementById('comm-dm-panel');
    const thread = socialState.threads.find((row) => row.id === socialState.activeThreadId);
    if (!panel || !thread) {
      if (panel) panel.classList.remove('open');
      return;
    }
    const meta = socialThreadMeta(thread);
    ensureSocialDrafts();
    panel.innerHTML = `
      <div class="comm-dm-head comm-thread-pane-head">
        <div class="comm-dm-head-main">
          ${threadAvatarMarkup(meta)}
          <div class="comm-dm-head-copy">
            <div class="comm-dm-head-title">${esc(meta.title)}</div>
            <div class="comm-dm-head-sub">${esc(meta.subtitle)} • ${esc(meta.secondaryLabel)}</div>
          </div>
        </div>
        <div class="comm-thread-pane-actions">
          ${meta.followUserId ? `<button class="comm-dm-link" type="button" onclick="toggleCommunityFollow('${escAttr(meta.followUserId)}')">${currentUserFollows(meta.followUserId) ? 'Following' : 'Follow'}</button>` : ''}
          <button class="comm-dm-link" type="button" onclick="closeDM()">Close</button>
        </div>
      </div>
      <div class="comm-thread-scroll"><div class="comm-thread-stack">${messagesFor(thread.id).length ? messagesFor(thread.id).map((message) => messageMarkup(message, thread)).join('') : '<div class="comm-message-empty">No messages yet. Send the first one.</div>'}</div></div>
      <div class="comm-thread-compose">
        <textarea id="dm-input" placeholder="Send a message..." oninput="updateThreadDraft('${escAttr(thread.id)}', this.value)">${esc(socialState.drafts[thread.id] || '')}</textarea>
        <div class="comm-thread-compose-actions">
          <div class="comm-thread-compose-note">Messages here stay live for everyone in this conversation.</div>
          <button class="comm-thread-send" type="button" onclick="sendDM()">Send</button>
        </div>
      </div>
    `;
    if (openNow) {
      panel.classList.add('open');
      dmOpen = true;
    }
  }

  async function sendMessageFromInput(inputId) {
    if (!(await ensureSocialMode(true))) {
      if (inputId === 'dm-input' && typeof legacySendDM === 'function') legacySendDM();
      else if (typeof legacySendThreadMessageFromView === 'function') legacySendThreadMessageFromView();
      return;
    }
    const threadId = socialState.activeThreadId;
    const input = document.getElementById(inputId);
    const text = input?.value.trim() || '';
    if (!threadId || !text) return;
    try {
      await communityRequest(SOCIAL_TABLES.messages, {
        method: 'POST',
        headers: { Prefer: 'return=representation' },
        body: {
          thread_id: threadId,
          user_id: currentUserId(),
          body: text,
          gif_url: '',
          gif_title: '',
          created_at: new Date().toISOString()
        }
      });
      if (input) input.value = '';
      ensureSocialDrafts();
      delete socialState.drafts[threadId];
      saveSocialDrafts();
      await markThreadRead(threadId);
      await refreshSocialState(true);
      rerenderMessagesIfVisible();
      renderDmPanel(dmOpen);
      scheduleCommunityDecorate();
    } catch (error) {
      toast('Could not send the message: ' + error.message);
    }
  }

  function scheduleCommunityDecorate() {
    if (decorateTimer) clearTimeout(decorateTimer);
    decorateTimer = setTimeout(() => {
      decorateTimer = null;
      decorateCommunityDom();
    }, 40);
  }

  function ensureFeedFollowButton(card, profile) {
    if (!card || !profile || profile.user_id === currentUserId()) return;
    const actions = card.querySelector('.comm-post-actions');
    if (!actions) return;
    let button = actions.querySelector('.comm-follow-btn');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'comm-follow-btn';
      actions.appendChild(button);
    }
    button.textContent = currentUserFollows(profile.user_id) ? 'Following' : 'Follow';
    button.classList.toggle('following', currentUserFollows(profile.user_id));
    button.onclick = function (event) {
      event.preventDefault();
      event.stopPropagation();
      window.toggleCommunityFollow(profile.user_id);
    };
  }

  function extractTextNode(el) {
    if (!el) return '';
    const textNode = Array.from(el.childNodes).find((node) => node.nodeType === Node.TEXT_NODE && String(node.textContent || '').trim());
    return (textNode ? textNode.textContent : el.textContent || '').trim();
  }

  function decorateCommunityDom() {
    ensureSocialStyles();
    ensureProfilePhotoControls();
    renderOnlineMembersCard();
    const selfProfile = currentUserProfileRow();
    applyAvatar(document.getElementById('comm-avatar'), selfProfile, selfProfile.display_name, false);
    applyAvatar(document.getElementById('comm-composer-av'), selfProfile, selfProfile.display_name, false);
    renderEditAvatarPreview();

    document.querySelectorAll('#page-community .comm-post').forEach((card) => {
      const nameEl = card.querySelector('.comm-post-name');
      const handleEl = nameEl?.querySelector('span');
      const profile = resolveProfile(handleEl?.textContent?.trim() || extractTextNode(nameEl));
      applyAvatar(card.querySelector('.comm-post-avatar'), profile || null, extractTextNode(nameEl), true);
      ensureFeedFollowButton(card, profile);
      const messageBtn = Array.from(card.querySelectorAll('.comm-action-btn')).find((btn) => /message/i.test(btn.textContent || ''));
      if (messageBtn && profile) {
        messageBtn.onclick = function (event) {
          event.preventDefault();
          event.stopPropagation();
          window.openDM(profile.user_id, profile.avatar_text || initials(profile.display_name));
        };
      }
    });

    document.querySelectorAll('#page-community .comm-online-card .comm-member').forEach((member) => {
      const name = member.querySelector('.comm-member-name')?.textContent?.trim() || '';
      const profile = resolveProfile(member.dataset.userId || name);
      applyAvatar(member.querySelector('.comm-member-av'), profile || null, name, true);
      if (profile && profile.user_id !== currentUserId()) {
        member.dataset.userId = profile.user_id;
        member.onclick = function (event) {
          if (event.target.closest('.comm-member-actions')) return;
          window.openDM(profile.user_id, profile.avatar_text || initials(profile.display_name));
        };
      }
      let actions = member.querySelector('.comm-member-actions');
      if (!actions) {
        actions = document.createElement('div');
        actions.className = 'comm-member-actions';
        member.appendChild(actions);
      }
      actions.innerHTML = '';
      if (profile && profile.user_id !== currentUserId()) {
        const followBtn = document.createElement('button');
        followBtn.type = 'button';
        followBtn.className = 'comm-follow-btn' + (currentUserFollows(profile.user_id) ? ' following' : '');
        followBtn.textContent = currentUserFollows(profile.user_id) ? 'Following' : 'Follow';
        followBtn.onclick = function (event) {
          event.preventDefault();
          event.stopPropagation();
          window.toggleCommunityFollow(profile.user_id);
        };
        const messageBtn = document.createElement('button');
        messageBtn.type = 'button';
        messageBtn.className = 'comm-inline-message-btn';
        messageBtn.textContent = 'Message';
        messageBtn.onclick = function (event) {
          event.preventDefault();
          event.stopPropagation();
          window.openDM(profile.user_id, profile.avatar_text || initials(profile.display_name));
        };
        actions.appendChild(followBtn);
        actions.appendChild(messageBtn);
      }
    });
  }

  function attachCommunityObserver() {
    const page = document.getElementById('page-community');
    if (!page || socialObserver) return;
    socialObserver = new MutationObserver(() => scheduleCommunityDecorate());
    socialObserver.observe(page, { childList: true, subtree: true });
  }

  function startSocialLoop() {
    if (socialPollTimer) clearInterval(socialPollTimer);
    socialPollTimer = setInterval(() => {
      if (!isCommunityActive()) return;
      refreshSocialState(false)
        .then(() => {
          rerenderMessagesIfVisible();
          renderDmPanel(false);
          scheduleCommunityDecorate();
        })
        .catch(() => {});
    }, SOCIAL_POLL_MS);
  }

  function startPresenceLoop() {
    if (socialPresenceTimer) clearInterval(socialPresenceTimer);
    socialPresenceTimer = setInterval(() => {
      if (!currentUserId()) return;
      syncSocialPresence(false).catch(() => {});
    }, SOCIAL_HEARTBEAT_MS);
  }

  window.updateThreadDraft = function (threadId, value) {
    ensureSocialDrafts();
    if (!threadId) return;
    if (value && value.trim()) socialState.drafts[threadId] = value;
    else delete socialState.drafts[threadId];
    saveSocialDrafts();
  };

  window.filterMessageThreads = function (value) {
    socialState.search = value || '';
    rerenderMessagesIfVisible();
  };

  window.setMessageFilter = function (value) {
    socialState.filter = value || 'all';
    rerenderMessagesIfVisible();
  };

  window.selectMessageThread = function (threadId) {
    socialState.activeThreadId = threadId;
    markThreadRead(threadId).catch(() => {});
    rerenderMessagesIfVisible();
    renderDmPanel(false);
  };

  window.renderMessagesView = function (container) {
    if (!container) return;
    ensureSocialStyles();
    ensureProfilePhotoControls();
    renderMessagesContent(container);
    refreshSocialState(false)
      .then(() => {
        const active = ensureActiveThread();
        renderMessagesContent(container);
        if (active) markThreadRead(active.id).catch(() => {});
        scheduleCommunityDecorate();
      })
      .catch(() => {});
  };

  window.openDM = async function (ref, emoji, options) {
    if (!(await ensureSocialMode(true))) {
      if (typeof legacyOpenDM === 'function') legacyOpenDM(ref, emoji);
      return;
    }
    try {
      await refreshSocialState(false);
      const thread = (options && options.type === 'pod')
        ? await ensurePodThread(ref)
        : (podByRef(ref) ? await ensurePodThread(ref) : await ensureDirectThread(ref));
      if (!thread) {
        toast('Could not open that conversation yet.');
        return;
      }
      socialState.activeThreadId = thread.id;
      await markThreadRead(thread.id);
      rerenderMessagesIfVisible();
      renderDmPanel(true);
      scheduleCommunityDecorate();
      setTimeout(() => document.getElementById('dm-input')?.focus(), 50);
    } catch (error) {
      toast('Could not open the thread: ' + error.message);
    }
  };

  window.closeDM = function () {
    document.getElementById('comm-dm-panel')?.classList.remove('open');
    dmOpen = false;
  };

  window.sendDM = function () {
    sendMessageFromInput('dm-input');
  };

  window.sendThreadMessageFromView = function () {
    sendMessageFromInput('comm-message-input');
  };

  window.toggleCommunityFollow = async function (ref) {
    if (!(await ensureFollowMode(true))) {
      toast('Follow/add still needs the live Community follow tables turned on.');
      return;
    }
    await refreshSocialState(false);
    const target = resolveProfile(ref);
    if (!target || target.user_id === currentUserId()) return;
    const following = currentUserFollows(target.user_id);
    try {
      if (following) {
        await communityDelete(
          SOCIAL_TABLES.follows
          + '?follower_user_id=eq.' + encodeURIComponent(currentUserId())
          + '&followee_user_id=eq.' + encodeURIComponent(target.user_id)
        );
      } else {
        await communityUpsert(SOCIAL_TABLES.follows, {
          follower_user_id: currentUserId(),
          followee_user_id: target.user_id,
          created_at: new Date().toISOString()
        }, 'follower_user_id,followee_user_id');
      }
      await refreshSocialState(true);
      rerenderMessagesIfVisible();
      renderDmPanel(false);
      scheduleCommunityDecorate();
      toast((following ? 'Unfollowed ' : 'Following ') + target.display_name + '.');
    } catch (error) {
      toast('Could not update follow status: ' + error.message);
    }
  };

  window.openEditProfile = function () {
    ensureSocialStyles();
    ensureProfilePhotoControls();
    socialState.photoDirty = false;
    socialState.photoDraft = localProfile().photoUrl || '';
    if (typeof legacyOpenEditProfile === 'function') legacyOpenEditProfile();
    renderEditAvatarPreview();
  };

  window.submitEditProfile = function () {
    const name = document.getElementById('edit-display-name')?.value.trim();
    const handle = document.getElementById('edit-handle')?.value.trim();
    const bio = document.getElementById('edit-bio')?.value.trim();
    if (!name) {
      toast('Please enter a display name.');
      return;
    }
    const existing = localProfile();
    commProfile = {
      ...existing,
      name,
      handle: handle || ('@' + name.toLowerCase().replace(/\s+/g, '')),
      bio: bio || '',
      color: normalizeColor(existing.color || '#0A7266'),
      photoUrl: socialState.photoDirty ? socialState.photoDraft : (existing.photoUrl || '')
    };
    socialState.photoDirty = false;
    socialState.photoDraft = commProfile.photoUrl || '';
    if (typeof saveCommProfile === 'function') saveCommProfile();
    if (typeof closeEditProfile === 'function') closeEditProfile();
    if (typeof updateCommProfile === 'function') updateCommProfile();
    toast('Profile updated.');
  };

  const previousUpdateCommProfile = window.updateCommProfile;
  window.updateCommProfile = function () {
    if (typeof previousUpdateCommProfile === 'function') previousUpdateCommProfile();
    scheduleCommunityDecorate();
    syncSocialProfile(true)
      .then(() => refreshSocialState(true))
      .then(() => {
        rerenderMessagesIfVisible();
        renderDmPanel(false);
        scheduleCommunityDecorate();
      })
      .catch(() => {
        toast('Profile saved on this device. Live profile sync is not ready yet.');
      });
  };

  window.joinPod = async function (podRef) {
    const result = typeof legacyJoinPod === 'function' ? legacyJoinPod(podRef) : undefined;
    Promise.resolve(result)
      .then(() => ensurePodThreadMembership(podRef))
      .then(() => refreshSocialState(true))
      .then(() => scheduleCommunityDecorate())
      .catch(() => {});
    return result;
  };

  window.submitCreatePod = async function () {
    const podName = document.getElementById('pod-name-input')?.value.trim();
    const result = typeof legacySubmitCreatePod === 'function' ? legacySubmitCreatePod() : undefined;
    Promise.resolve(result)
      .then(() => podName ? ensurePodThreadMembership(podName) : null)
      .then(() => refreshSocialState(true))
      .then(() => scheduleCommunityDecorate())
      .catch(() => {});
    return result;
  };

  const previousInitCommunity = window.initCommunity;
  window.initCommunity = async function () {
    if (typeof previousInitCommunity === 'function') await previousInitCommunity();
    ensureSocialStyles();
    ensureProfilePhotoControls();
    attachCommunityObserver();
    await refreshSocialState(true).catch(() => {});
    scheduleCommunityDecorate();
    startSocialLoop();
    startPresenceLoop();
  };

  document.addEventListener('visibilitychange', () => {
    syncSocialPresence(true, document.visibilityState === 'visible' ? 'online' : 'away').catch(() => {});
    if (document.visibilityState === 'visible' && isCommunityActive()) {
      refreshSocialState(true)
        .then(() => {
          rerenderMessagesIfVisible();
          renderDmPanel(false);
          scheduleCommunityDecorate();
        })
        .catch(() => {});
    }
  });

  document.addEventListener('input', (event) => {
    if (event.target?.id === 'edit-display-name') renderEditAvatarPreview();
  });

  if (!window.__pccCommunityPresencePageListener) {
    window.__pccCommunityPresencePageListener = true;
    window.addEventListener('pcc:pagechange', () => {
      syncSocialPresence(false).catch(() => {});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      setTimeout(() => window.initCommunity && window.initCommunity(), 120);
    });
  } else {
    setTimeout(() => window.initCommunity && window.initCommunity(), 120);
  }
})();
