// Synchronisation über ein privates GitHub Gist.
// Jedes Gerät lädt den Stand, führt ihn mit dem eigenen zusammen (merge) und lädt das Ergebnis hoch.
import { state, local, saveLocal, merge, replaceState } from './store.js';

const FILE = 'kotoba-sync.json';
const API = 'https://api.github.com';
let running = null;
let pending = false;
const listeners = new Set();
export const onSyncStatus = fn => (listeners.add(fn), () => listeners.delete(fn));
let status = 'idle';
export const syncStatus = () => status;
function setStatus(s) { status = s; listeners.forEach(fn => fn(s)); }

export const syncEnabled = () => !!local.token;

async function gh(path, opts = {}) {
  const res = await fetch(API + path, {
    ...opts,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${local.token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
    },
  });
  if (res.status === 401) throw new Error('Token ungültig oder abgelaufen.');
  if (res.status === 403 || res.status === 404) {
    const msg = (await res.json().catch(() => ({}))).message || res.statusText;
    throw new Error(`GitHub: ${msg} – hat der Token die Berechtigung „Gists: Read and write“?`);
  }
  if (!res.ok) throw new Error(`GitHub-Fehler ${res.status}`);
  return res.json();
}

async function findGist() {
  for (let page = 1; page <= 5; page++) {
    const list = await gh(`/gists?per_page=100&page=${page}`);
    const hit = list.find(g => g.files && g.files[FILE]);
    if (hit) return hit.id;
    if (list.length < 100) break;
  }
  return null;
}

async function readRemote(id) {
  const g = await gh(`/gists/${id}`);
  const f = g.files?.[FILE];
  if (!f) return null;
  let content = f.content;
  if (f.truncated) content = await (await fetch(f.raw_url, { cache: 'no-store' })).text();
  try { return JSON.parse(content); } catch { return null; }
}

async function doSync() {
  setStatus('syncing');
  try {
    if (!local.gistId) local.gistId = (await findGist()) || '';
    let merged = state;
    let remote = null;
    if (local.gistId) {
      remote = await readRemote(local.gistId).catch(e => {
        if (/Not Found/.test(e.message)) { local.gistId = ''; return null; }
        throw e;
      });
      if (remote) merged = merge(state, remote);
    }
    const mergedStr = JSON.stringify(merged);
    const files = { [FILE]: { content: mergedStr } };
    if (!local.gistId) {
      const g = await gh('/gists', { method: 'POST', body: JSON.stringify({ description: 'Kotoba – Lernfortschritt (automatisch)', public: false, files }) });
      local.gistId = g.id;
    } else if (!remote || JSON.stringify(merge(remote, merged)) !== JSON.stringify(remote)) {
      await gh(`/gists/${local.gistId}`, { method: 'PATCH', body: JSON.stringify({ files }) });
    }
    // Nur ersetzen, wenn sich lokal wirklich etwas ändert (sonst Sync-Schleife)
    const changed = mergedStr !== JSON.stringify(state);
    if (changed) replaceState(merged);
    local.lastSync = Date.now();
    local.lastSyncError = '';
    saveLocal();
    setStatus('ok');
    return changed;
  } catch (e) {
    local.lastSyncError = navigator.onLine === false ? 'Offline – wird später synchronisiert.' : e.message;
    saveLocal();
    setStatus('error');
    return false;
  }
}

// Mehrfachaufrufe bündeln
export function syncNow() {
  if (!syncEnabled()) return Promise.resolve();
  if (running) { pending = true; return running; }
  running = doSync().finally(() => {
    running = null;
    if (pending) { pending = false; syncNow(); }
  });
  return running;
}

let timer = null;
export function scheduleSync(delay = 8000) {
  if (!syncEnabled()) return;
  clearTimeout(timer);
  timer = setTimeout(syncNow, delay);
}

export function disconnect() {
  local.token = '';
  local.gistId = '';
  local.lastSync = 0;
  local.lastSyncError = '';
  saveLocal();
  setStatus('idle');
}
