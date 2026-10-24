// Katalog aller Lernkarten (Vokabeln, Kanji, Phrasen, eigene Wörter).
import { VOCAB, KANJI } from '../data/vocab.js';
import { SITUATIONS } from '../data/phrases.js';
import { state, deckOn } from './store.js';
import { toRomaji } from './romaji.js';

export const KIND_LABEL = { vocab: 'Vokabel', kanji: 'Kanji', phrase: 'Phrase', custom: 'Eigene' };

// Ein „Item“ ist der Inhalt, eine „Karte“ ist Item + Richtung (jd = Japanisch→Deutsch, dj = Deutsch→Japanisch)
export function vocabItems() {
  const out = [];
  for (const cat of VOCAB) {
    for (const [w, k, de, note] of cat.words) {
      out.push({ key: `v:${w}`, kind: 'vocab', deck: `v:${cat.id}`, cat: cat.id, w, k, ro: toRomaji(k), de, note });
    }
  }
  return out;
}

export function customItems() {
  return Object.entries(state.custom)
    .filter(([, c]) => !c.del)
    .sort((a, b) => (a[1].u || 0) - (b[1].u || 0))
    .map(([id, c]) => ({ key: `c:${id}`, id, kind: 'custom', deck: 'custom', cat: 'custom', w: c.w || c.k, k: c.k, ro: toRomaji(c.k), de: c.de, note: c.note }));
}

export function kanjiItems() {
  return KANJI.map(([c, on, kun, de, ex, exk, exde]) => ({
    key: `k:${c}`, kind: 'kanji', deck: 'kanji', cat: 'kanji', w: c, on, kun, de,
    onRo: toRomaji(on), kunRo: kun === '–' ? '' : toRomaji(kun),
    ex, exk, exRo: toRomaji(exk), exde,
  }));
}

export function fillName(s, romaji = false) {
  const n = romaji ? (state.settings.nameRomaji || '〇〇') : (state.settings.nameKana || '〇〇');
  return s.replaceAll('{name}', n);
}

export function phraseItems() {
  const out = [];
  for (const sit of SITUATIONS) {
    sit.p.forEach(([ja, kana, ro, de, note, who], i) => {
      out.push({
        key: `p:${sit.id}:${i}`, kind: 'phrase', deck: `p:${sit.id}`, cat: sit.id,
        w: fillName(ja), k: fillName(kana || ja), ro: fillName(ro, true), de: fillName(de, true), note, heard: who === 'h',
      });
    });
  }
  return out;
}

let cache = null;
let cacheSig = '';
export function allItems() {
  const sig = Object.keys(state.custom).length + '|' + state.settings.nameKana + state.settings.nameRomaji + '|' +
    Object.values(state.custom).reduce((m, c) => Math.max(m, c.u || 0), 0);
  if (!cache || sig !== cacheSig) {
    cache = [...vocabItems(), ...customItems(), ...kanjiItems(), ...phraseItems()];
    cacheSig = sig;
  }
  return cache;
}
export function itemByKey(key) {
  return allItems().find(i => i.key === key);
}

// Richtungen pro Item, je nach Einstellungen
export function directions(item) {
  const s = state.settings;
  if (item.kind === 'kanji') return ['jd'];
  if (item.kind === 'phrase') {
    const main = item.heard ? 'jd' : 'dj';
    return s.phraseReverse ? [main, main === 'jd' ? 'dj' : 'jd'] : [main];
  }
  return s.vocabReverse ? ['jd', 'dj'] : ['jd'];
}

export function cardsFor(item) {
  return directions(item).map((dir, idx) => ({ id: `${item.key}:${dir}`, item, dir, primary: idx === 0 }));
}

export function allCards({ onlyActive = true } = {}) {
  return allItems().filter(i => !onlyActive || deckOn(i.deck)).flatMap(cardsFor);
}

export function cardState(id) {
  return state.srs[id];
}

// Status eines Items (über seine Hauptkarte)
export function itemStatus(item) {
  const c = state.srs[cardsFor(item)[0].id];
  if (!c) return 'new';
  if (c.i < 1) return 'learning';
  if (c.i < 21) return 'young';
  return 'mature';
}
export const STATUS_LABEL = { new: 'Neu', learning: 'Lernen', young: 'Gelernt', mature: 'Sitzt' };
