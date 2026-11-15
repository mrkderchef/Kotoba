import { KANJI } from '../data/vocab.js';
import { KANJI_MEANINGS, WORD_PARTS, WORD_PART_NOTES } from '../data/kanji-parts.js';
import { state } from './store.js';
import { toRomaji } from './romaji.js';
import { esc } from './ui.js';

const meanings = new Map(KANJI.map(([w, , , de]) => [w, de]));
for (const [w, de] of Object.entries(KANJI_MEANINGS)) meanings.set(w, de);
const politeO = new Set(['お茶', 'お金', 'お父さん', 'お母さん', 'お兄さん', 'お姉さん', 'お腹', 'お風呂', 'お酒', 'お手洗い', 'お弁当', 'お菓子', 'お客さん']);

// Keep every character, in order, including kana and repeated kanji.
// Never guess a compound's readings by splitting its kana into equal pieces.
export function wordParts(w) {
  const chars = Array.from(w);
  return chars.map((char, index) => {
    if (char === '々') return { char, kind: 'Wiederholungszeichen', meaning: index ? `wiederholt ${chars[index - 1]}` : 'wiederholt das vorherige Kanji' };
    if (/\p{Script=Han}/u.test(char)) return { char, kind: 'Kanji', meaning: meanings.get(char) || 'Bedeutung noch nicht hinterlegt' };
    if (/[ぁ-ゖ]/u.test(char)) return { char, kind: 'Hiragana', meaning: (index === 0 && politeO.has(w)) || (char === 'ご' && chars[index + 1] === '飯') ? 'höfliche Vorsilbe' : 'Lautschrift' };
    if (/[ァ-ヺ]/u.test(char)) return { char, kind: 'Katakana', meaning: 'Lautschrift' };
    if (char === 'ー') return { char, kind: 'Längenzeichen', meaning: 'verlängert den vorherigen Vokal' };
    return { char, kind: 'Zeichen', meaning: 'Teil der Schreibung' };
  });
}

export function wordPartsHtml(item, { collapsible = false } = {}) {
  const parts = wordParts(item.w);
  if (!parts.length) return '';
  const chunks = WORD_PARTS[item.w];
  const hasKanji = parts.some(p => p.kind === 'Kanji');
  const body = `<ol class="word-parts-chars" aria-label="Schriftzeichen in der Reihenfolge des Wortes">
    ${parts.map(p => `<li><span class="jp part-char" lang="ja">${esc(p.char)}</span><small>${esc(p.kind)}</small><span class="part-meaning">${esc(p.meaning)}</span></li>`).join('')}
    </ol>
    ${chunks ? `<div class="word-parts-chunks"><b>Wortbausteine</b><ul>${chunks.map(([w, k, de]) => `<li><span class="jp" lang="ja">${esc(w)} <small>(${esc(k)})</small></span>${state.settings.showRomaji ? `<small class="ro">${esc(toRomaji(k))}</small>` : ''}<span>${esc(de)}</span></li>`).join('')}</ul></div>` : ''}
    <p class="word-parts-result">→ <span class="jp" lang="ja">${esc(item.w)}</span> = <strong>${esc(item.de)}</strong></p>
    <p class="word-parts-note">${esc(WORD_PART_NOTES[item.w] || (hasKanji ? 'Die Einzelbedeutungen helfen beim Merken. Die Bedeutung und Lesung des ganzen Wortes lassen sich nicht immer direkt daraus ableiten. Kana schreiben Laute oder Wortendungen.' : 'Kana schreiben die Laute des Wortes. Die einzelnen Zeichen haben hier keine eigene Wortbedeutung.'))}</p>`;
  return collapsible
    ? `<details class="word-parts"><summary>Zeichen & Wortbausteine</summary>${body}</details>`
    : `<section class="word-parts" aria-label="Zeichen und Wortbausteine"><h3>Zeichen & Wortbausteine</h3>${body}</section>`;
}
