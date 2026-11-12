// Geschichten-Modus: Wortschatz, Text-Parser, Hilfestufen und Lernstand.
// Jedes Wort ist eine Karte in state.srs unter `s:<Schreibung>` (gleicher Algorithmus wie Legacy).
import { WORDS, N5 } from '../data/words.js';
import { STORIES } from '../data/stories.js';
import { state, today } from './store.js';
import { toRomaji, hasKanji } from './romaji.js';
import { esc } from './ui.js';

// Katakana-Wörter brauchen keine Lesung in Hiragana
const LIB_WORDS = WORDS.map(([w, k, de, e, note]) => ({ w, k: /^[ァ-ヶー・]+$/.test(w) ? w : k, de, e, note: note || '' }));
const LIB_STORIES = STORIES.map((s, i) => ({
  ...s, n: i + 1, text: s.text.trim(),
  quiz: s.quiz.map(([q, a, ...x]) => ({ q, a, x })),
}));
const POOL = new Map(LIB_WORDS.map(x => [x.w, x]));

export const allStories = () => LIB_STORIES;
export const storyById = id => LIB_STORIES.find(s => s.id === id);

// ---------- Wortschatz ----------
export const wordPool = () => POOL;
export const wordId = w => `s:${w}`;
export const wordCard = w => state.srs[wordId(w)];
export function wordInfo(w) {
  const x = wordPool().get(w);
  return x && { ...x, ro: toRomaji(x.k) };
}

export function wordStatus(w) {
  const c = wordCard(w);
  if (!c) return 'new';
  if (c.i < 1) return 'learning';
  if (c.i < 21) return 'young';
  return 'mature';
}

// Wie viel Hilfe ein Wort im Text bekommt: Emoji + Lesung + Deutsch → nur Lesung → nur Japanisch
export function helpLevel(w) {
  const c = wordCard(w);
  if (!c || c.i < 1) return 'full';
  if (c.i < 21) return 'ruby';
  return 'plain';
}

export const knownWords = () => [...wordPool().keys()].filter(wordCard);
export function dueWords() {
  const t = today();
  return knownWords().filter(w => wordCard(w).d <= t).sort((a, b) => wordCard(a).d - wordCard(b).d);
}

// ---------- Text ----------
// {w}  {w|Form|Lesung}  漢字《よみ》  **fett**
const INLINE = /\{([^{}|]+)(?:\|([^{}|]+)\|([^{}|]+))?\}|([一-龯㐀-䶿々〆ヵヶ]+)《([^》]+)》|\*\*(.+?)\*\*/g;

export function parseStory(text) {
  return text.trim().split(/\n\s*\n/).map(block => {
    const lines = block.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.every(l => l.startsWith('>'))) {
      return { t: 'jp', lines: lines.map(l => {
        const m = l.slice(1).trim().match(/^(.*?)\s+\|\s+(.*)$/);
        return m ? { jp: m[1], de: m[2] } : { jp: l.slice(1).trim(), de: '' };
      }) };
    }
    if (lines[0].startsWith('!')) return { t: 'tip', src: lines.join(' ').slice(1).trim() };
    return { t: 'p', src: lines.join(' ') };
  });
}

export function storyWords(story) {
  const out = [];
  const p = wordPool();
  for (const m of story.text.matchAll(INLINE)) if (m[1] && p.has(m[1]) && !out.includes(m[1])) out.push(m[1]);
  return out;
}

// Kapitel in Bibliotheksreihenfolge; unbekannte IDs ignorieren, Wörter nur einmal.
export function wordSetChapters(ids = []) {
  const selected = new Set(ids);
  return allStories().filter(s => selected.has(s.id));
}
export function wordSetWords(ids = []) {
  return [...new Set(wordSetChapters(ids).flatMap(storyWords))];
}

// opts: { seen: Set (erste Erwähnung bekommt Emoji + Übersetzung), jp: im japanischen Satz, target: Wort hervorheben, noGloss }
export function renderInline(src, opts = {}) {
  const seen = opts.seen || new Set();
  let out = '', last = 0;
  for (const m of src.matchAll(INLINE)) {
    out += esc(src.slice(last, m.index));
    last = m.index + m[0].length;
    if (m[1]) out += wordHtml(m[1], m[2], m[3], { ...opts, seen });
    else if (m[4]) out += `<ruby>${esc(m[4])}<rt>${esc(m[5])}</rt></ruby>`;
    else out += `<b>${renderInline(m[6], { ...opts, seen })}</b>`;
  }
  return out + esc(src.slice(last));
}

function wordHtml(w, form, reading, opts) {
  const x = wordInfo(w);
  if (!x) return esc(form || w);
  if (opts.blank === w) return '<span class="blank">？</span>';
  const surface = form || x.w;
  const rd = reading || x.k;
  const target = opts.target === w;
  const lvl = target ? 'ruby' : helpLevel(w);
  const first = !opts.seen.has(w);
  opts.seen.add(w);
  const rich = lvl === 'full' && first && !opts.noGloss && !opts.jp;
  const word = hasKanji(surface) && lvl !== 'plain' ? `<ruby>${esc(surface)}<rt>${esc(rd)}</rt></ruby>` : esc(surface);
  const gloss = rich ? `<small class="gl">${esc(x.de)}${state.settings.showRomaji ? ` · ${esc(toRomaji(rd))}` : ''}</small>` : '';
  return `<button class="vw lv-${lvl}${target ? ' target' : ''}" data-w="${esc(w)}">${rich ? `<span class="ve">${x.e}</span>` : ''}<span class="jp">${word}</span>${gloss}</button>`;
}

// Japanischer Satz nur in Kana (für Sprachausgabe und Romaji)
export function jpKana(src) {
  return src.replace(INLINE, (m, w, form, rd, rb, rbr, bold) => (w ? rd || wordInfo(w)?.k || w : rb ? rbr : bold));
}

// Romaji mit Wortgrenzen: „nihon wa shima no kuni desu.“ (Partikel は/を/へ wie gesprochen)
const PARTICLE = /^(から|は|が|を|の|に|と|で|も|へ)/;
const SAY = { は: 'wa', を: 'o', へ: 'e' };
export function jpRomaji(src) {
  const parts = [];
  let last = 0;
  for (const m of src.matchAll(INLINE)) {
    parts.push({ text: src.slice(last, m.index) });
    parts.push(m[6] ? { text: jpKana(m[6]) } : { word: m[1] ? m[3] || wordInfo(m[1])?.k || m[1] : m[5] });
    last = m.index + m[0].length;
  }
  parts.push({ text: src.slice(last) });
  let out = '';
  parts.forEach((p, i) => {
    if (p.word) { out += (/[\s(“]$|^$/.test(out) ? '' : ' ') + toRomaji(p.word); return; }
    let t = p.text;
    if (!t) return;
    if (!i) {
      // Satzanfang wie „マルクス・アウレリウスは{…}“: Partikel am Ende abtrennen
      const end = t.match(/(は|が|を|の|に|と|も)$/);
      if (end && parts[i + 1]?.word) t = t.slice(0, -1) + ' ' + end[1];
      out += t.split(' ').map(x => SAY[x] || toRomaji(x)).join(' ');
      return;
    }
    const punct = t.match(/^[「」、。！？・…]+/)?.[0] || '';
    out += punct;
    t = t.slice(punct.length);
    while (t) {
      if (/^でし?た?/.test(t) && /^(です|でした)/.test(t)) { out += ' ' + toRomaji(t); break; }
      const pm = t.match(PARTICLE);
      if (!pm) { out += (punct ? ' ' : '') + toRomaji(t); break; }
      out += ' ' + (SAY[pm[1]] || toRomaji(pm[1]));
      t = t.slice(pm[1].length);
      if (t && !/^[「」、。！？]/.test(t)) out += ' ';
    }
  });
  return out.replace(/。/g, '.').replace(/、/g, ',').replace(/！/g, '!').replace(/？/g, '?').replace(/・/g, ' ')
    .replace(/「\s*/g, ' "').replace(/\s*」/g, '"').replace(/(masu|masen|desu|mashita)ka\b/g, '$1 ka')
    .replace(/\s+([.,!?])/g, '$1').replace(/\s+/g, ' ').trim();
}

// ---------- Kontext: Sätze, in denen ein Wort vorkommt ----------
let ctxCache = null;
function splitSentences(src) {
  const parts = src.replace(/([.!?…]["“”]?)\s+/g, '$1\n').split('\n');
  // Abkürzungen („v. Chr.“) nicht als eigenen Satz stehen lassen
  const out = [];
  for (const p of parts) {
    if (out.length && out[out.length - 1].length < 25) out[out.length - 1] += ' ' + p;
    else out.push(p);
  }
  return out;
}
function buildContexts() {
  const map = new Map();
  const add = (w, c) => { if (!map.has(w)) map.set(w, []); map.get(w).push(c); };
  for (const s of allStories()) {
    for (const b of parseStory(s.text)) {
      const units = b.t === 'jp' ? b.lines.map(l => ({ src: l.jp, de: l.de, jp: true })) : b.t === 'p' ? splitSentences(b.src).map(src => ({ src })) : [];
      for (const u of units) {
        const ws = new Set([...u.src.matchAll(INLINE)].map(m => m[1]).filter(Boolean));
        for (const w of ws) add(w, { ...u, story: s.id, title: s.title, emoji: s.emoji });
      }
    }
  }
  return map;
}
export function contexts(w) {
  ctxCache ||= buildContexts();
  return ctxCache.get(w) || [];
}

// ---------- Lesefortschritt ----------
export const isRead = id => !!state.read[id];
export function markRead(id) {
  state.read[id] = { n: (state.read[id]?.n || 0) + 1, u: Date.now() };
}
export function nextStory() {
  return LIB_STORIES.find(s => !isRead(s.id)) || null;
}

// ---------- Fortschritt ----------
export function progress() {
  const known = knownWords();
  return {
    n: known.length,
    mature: known.filter(w => wordCard(w).i >= 21).length,
    n5: known.filter(w => N5.has(w)).length,
    n5Total: N5.size,
    stories: LIB_STORIES.filter(st => isRead(st.id)).length,
    storiesTotal: LIB_STORIES.length,
  };
}
