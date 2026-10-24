// Zustand, Persistenz (localStorage) und konfliktfreies Zusammenführen zwischen Geräten.

const KEY = 'kotoba-state-v1';
const LOCAL_KEY = 'kotoba-local-v1';

export const DEFAULT_SETTINGS = {
  newVocab: 10, newKanji: 5, newPhrases: 5, maxReviews: 200,
  vocabReverse: false, phraseReverse: false,
  autoSpeak: true, showRomaji: true, kanaFont: 'sans',
  nameKana: '', nameRomaji: '', theme: 'auto', u: 0,
};

// Standardmäßig aktive Decks (alles andere: aus, bis du es aktivierst)
const DEFAULT_ON = (key) => key.startsWith('v:') || key === 'custom' || key === 'p:intro' || key === 'p:greet';

function uid() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

function emptyState() {
  return { v: 1, srs: {}, kana: {}, quiz: {}, push: {}, sections: {}, custom: {}, daily: {}, decks: {}, settings: { ...DEFAULT_SETTINGS } };
}

function readJSON(key, fallback) {
  try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : fallback; } catch { return fallback; }
}

export const state = Object.assign(emptyState(), readJSON(KEY, {}));
state.settings = { ...DEFAULT_SETTINGS, ...state.settings };

// Gerätespezifisch, wird NICHT synchronisiert
export const local = Object.assign({ deviceId: uid(), token: '', gistId: '', lastSync: 0, lastSyncError: '', voiceURI: '', rate: 0.9 }, readJSON(LOCAL_KEY, {}));
saveLocal();

const listeners = new Set();
export function onChange(fn) { listeners.add(fn); return () => listeners.delete(fn); }

let saveTimer = null;
export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { console.warn('Speichern fehlgeschlagen', e); }
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => listeners.forEach(fn => fn()), 50);
}
export function saveLocal() {
  try { localStorage.setItem(LOCAL_KEY, JSON.stringify(local)); } catch {}
}

// ---------- Tage (Tageswechsel um 4 Uhr, wie bei Anki) ----------
export function dayKey(t = Date.now()) {
  const d = new Date(t - 4 * 3600 * 1000);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
export function dayNum(t = Date.now()) {
  const [y, m, d] = dayKey(t).split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 86400000);
}
export const today = () => dayNum();

// ---------- Tagesstatistik (pro Gerät, damit Sync nichts überschreibt) ----------
export function bump(field, n = 1) {
  const k = dayKey();
  const day = (state.daily[k] ||= {});
  const mine = (day[local.deviceId] ||= {});
  mine[field] = (mine[field] || 0) + n;
}
export function dayTotal(k, field) {
  const day = state.daily[k];
  if (!day) return 0;
  return Object.values(day).reduce((s, d) => s + (d[field] || 0), 0);
}
export function dayActivity(k) {
  const day = state.daily[k];
  if (!day) return 0;
  return Object.values(day).reduce((s, d) => s + (d.r || 0) + (d.k || 0) + (d.x || 0), 0);
}
export function streak() {
  let n = 0;
  let t = Date.now();
  if (!dayActivity(dayKey(t))) t -= 86400000; // heute noch nichts gemacht -> Serie zählt bis gestern
  while (dayActivity(dayKey(t)) > 0) { n++; t -= 86400000; }
  return n;
}

// ---------- Kana-Statistik ----------
export function kanaRecord(char, correct) {
  const rec = (state.kana[char] ||= {});
  const mine = (rec[local.deviceId] ||= { r: 0, w: 0 });
  correct ? mine.r++ : mine.w++;
}
export function kanaStats(char) {
  const rec = state.kana[char];
  let r = 0, w = 0;
  if (rec) for (const d of Object.values(rec)) { r += d.r; w += d.w; }
  return { r, w, n: r + w };
}

// ---------- Test alter Vokabeln (pro Gerät, wie Kana) ----------
// score: 1 = gewusst, 0.5 = unsicher, 0 = falsch
export function quizRecord(key, score) {
  const rec = (state.quiz[key] ||= {});
  const mine = (rec[local.deviceId] ||= { r: 0, w: 0, t: 0 });
  mine.r += score;
  mine.w += 1 - score;
  mine.t = Date.now();
}
export function quizStats(key) {
  const rec = state.quiz[key];
  let r = 0, w = 0, t = 0;
  if (rec) for (const d of Object.values(rec)) { r += d.r; w += d.w; t = Math.max(t, d.t || 0); }
  return { r, w, n: r + w, t };
}

// ---------- Abschnitte ----------
export function section(id) {
  return state.sections[id] || { learned: false, best: 0, passed: false };
}
export function updateSection(id, patch) {
  const cur = section(id);
  state.sections[id] = {
    learned: cur.learned || !!patch.learned,
    passed: cur.passed || !!patch.passed,
    best: Math.max(cur.best || 0, patch.best || 0),
  };
}

// ---------- Decks ----------
export function deckOn(key) {
  const d = state.decks[key];
  return d ? d.on : DEFAULT_ON(key);
}
export function setDeck(key, on) {
  state.decks[key] = { on, u: Date.now() };
}

// ---------- Einstellungen ----------
export function setSetting(k, v) {
  state.settings[k] = v;
  state.settings.u = Date.now();
}

// ---------- Eigene Vokabeln ----------
export function addCustom(w) {
  const id = uid();
  state.custom[id] = { ...w, u: Date.now() };
  return id;
}
export function deleteCustom(id) {
  state.custom[id] = { del: true, u: Date.now() };
}

// ---------- Zusammenführen (Sync) ----------
function lww(a = {}, b = {}) {
  const out = { ...a };
  for (const [k, v] of Object.entries(b)) if (!out[k] || (v.u || 0) > (out[k].u || 0)) out[k] = v;
  return out;
}
function perDevice(a = {}, b = {}, size) {
  const out = structuredClone(a);
  for (const [k, devs] of Object.entries(b)) {
    const o = (out[k] ||= {});
    for (const [dev, v] of Object.entries(devs)) if (!o[dev] || size(v) > size(o[dev])) o[dev] = v;
  }
  return out;
}
const sum = o => Object.values(o).reduce((s, x) => s + (typeof x === 'number' ? x : 0), 0);

export function merge(a, b) {
  const sections = { ...a.sections };
  for (const [k, v] of Object.entries(b.sections || {})) {
    const c = sections[k] || {};
    sections[k] = { learned: !!(c.learned || v.learned), passed: !!(c.passed || v.passed), best: Math.max(c.best || 0, v.best || 0) };
  }
  return {
    v: 1,
    srs: lww(a.srs, b.srs),
    kana: perDevice(a.kana, b.kana, v => v.r + v.w),
    sections,
    custom: lww(a.custom, b.custom),
    daily: perDevice(a.daily, b.daily, sum),
    quiz: perDevice(a.quiz, b.quiz, v => v.r + v.w),
    decks: lww(a.decks, b.decks),
    push: lww(a.push, b.push),
    settings: (b.settings?.u || 0) > (a.settings?.u || 0) ? { ...DEFAULT_SETTINGS, ...b.settings } : a.settings,
  };
}

export function replaceState(next) {
  for (const k of Object.keys(state)) delete state[k];
  Object.assign(state, emptyState(), next);
  state.settings = { ...DEFAULT_SETTINGS, ...state.settings };
  save();
}

export function exportJSON() {
  return JSON.stringify(state);
}
