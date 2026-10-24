// Spaced Repetition im Anki-Stil (vereinfachtes SM-2, tagesbasiert).
import { state, today, dayKey, dayTotal } from './store.js';
import { allCards, allItems } from './cards.js';

export const GRADES = [
  { g: 1, label: 'Nochmal', key: '1', cls: 'again' },
  { g: 2, label: 'Schwer', key: '2', cls: 'hard' },
  { g: 3, label: 'Gut', key: '3', cls: 'good' },
  { g: 4, label: 'Einfach', key: '4', cls: 'easy' },
];

function fuzz(i, seed) {
  if (i < 3) return i;
  const f = ((seed * 9301 + 49297) % 233280) / 233280; // deterministisch pro Karte
  return Math.max(1, Math.round(i * (0.95 + f * 0.1)));
}

function hash(s) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

// Neuer Kartenzustand nach Bewertung
export function schedule(id, grade, t = today()) {
  const c = state.srs[id];
  let e = c?.e ?? 2.5;
  const i0 = c?.i ?? 0;
  let l = c?.l ?? 0;
  let i;
  const learning = i0 < 1;
  if (grade === 1) {
    if (!learning) { l++; e = Math.max(1.3, e - 0.2); }
    i = 0;
  } else if (learning) {
    i = grade === 4 ? 3 : 1;
    if (grade === 4) e += 0.15;
  } else {
    const late = Math.max(0, t - c.d);   // überfällig gewusst -> etwas Bonus
    if (grade === 2) { i = Math.max(i0 + 1, Math.round(i0 * 1.2)); e = Math.max(1.3, e - 0.15); }
    if (grade === 3) i = Math.max(i0 + 1, Math.round((i0 + late / 2) * e));
    if (grade === 4) { i = Math.max(i0 + 2, Math.round((i0 + late) * e * 1.3)); e += 0.15; }
    i = fuzz(Math.min(i, 3650), hash(id) + (c.r || 0));
  }
  return { d: t + i, i, e: Math.round(e * 100) / 100, r: (c?.r || 0) + 1, l, u: Date.now() };
}

export function previewInterval(id, grade) {
  return schedule(id, grade).i;
}

export function fmtInterval(i) {
  if (i < 1) return 'jetzt';
  if (i < 31) return `${i} T`;
  if (i < 365) return `${Math.round(i / 30)} Mo`;
  return `${(i / 365).toFixed(1).replace('.0', '')} J`;
}

const NEW_LIMIT_FIELD = { vocab: ['newVocab', 'nv'], custom: ['newVocab', 'nv'], kanji: ['newKanji', 'nk'], phrase: ['newPhrases', 'np'] };

export function newLeft(kind) {
  const [setting, field] = NEW_LIMIT_FIELD[kind];
  return Math.max(0, state.settings[setting] - dayTotal(dayKey(), field));
}

export function reviewsLeft() {
  return Math.max(0, state.settings.maxReviews - dayTotal(dayKey(), 'r'));
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

// Kinds: Array aus 'vocab' | 'kanji' | 'phrase' | 'custom'
export function dueCards(kinds) {
  const t = today();
  return allCards().filter(c => kinds.includes(c.item.kind) && state.srs[c.id] && state.srs[c.id].d <= t);
}

export function newCards(kinds, { ignoreLimit = false } = {}) {
  const out = [];
  for (const kind of kinds) {
    if (kind === 'custom' && kinds.includes('vocab')) continue; // teilen sich ein Limit (siehe unten)
    const kindSet = kind === 'vocab' ? ['vocab', 'custom'] : [kind];
    let left = ignoreLimit ? Infinity : newLeft(kind);
    // In Daten-Reihenfolge: Kategorie für Kategorie (steuerbar über die Deck-Schalter)
    for (const c of allCards()) {
      if (left <= 0) break;
      if (!kindSet.includes(c.item.kind) || state.srs[c.id]) continue;
      // Umkehrkarte erst, wenn die Hauptkarte gelernt ist
      if (!c.primary) {
        const main = state.srs[`${c.item.key}:${c.id.endsWith(':dj') ? 'jd' : 'dj'}`];
        if (!main || main.i < 1) continue;
      }
      out.push(c);
      left--;
    }
  }
  return out;
}

export function counts(kinds) {
  const due = dueCards(kinds).length;
  const nw = newCards(kinds).length;
  return { due: Math.min(due, reviewsLeft()), new: nw };
}

// Sitzung: fällige Karten + neue Karten, neue gleichmäßig eingestreut
export function buildSession(kinds) {
  const due = shuffle(dueCards(kinds)).sort((a, b) => state.srs[a.id].d - state.srs[b.id].d).slice(0, reviewsLeft());
  // Lernkarten (gerade „Nochmal“) zuerst, damit sie nicht ewig liegen bleiben
  due.sort((a, b) => (state.srs[a.id].i < 1 ? 0 : 1) - (state.srs[b.id].i < 1 ? 0 : 1));
  const nw = newCards(kinds);
  if (!nw.length) return due;
  const out = [];
  const step = Math.max(1, Math.floor(due.length / nw.length));
  let n = 0;
  due.forEach((c, i) => { out.push(c); if ((i + 1) % step === 0 && n < nw.length) out.push(nw[n++]); });
  while (n < nw.length) out.push(nw[n++]);
  return out;
}

// Übungsmodus ohne Einfluss auf die Planung
export function buildCram(items) {
  return shuffle(items.map(item => ({ id: `${item.key}:${item.kind === 'phrase' && !item.heard ? 'dj' : 'jd'}`, item, dir: item.kind === 'phrase' && !item.heard ? 'dj' : 'jd', primary: true })));
}

export function learnedCount(kind) {
  return allItems().filter(i => i.kind === kind && state.srs[`${i.key}:${kind === 'phrase' ? (i.heard ? 'jd' : 'dj') : 'jd'}`]?.i >= 1).length;
}
