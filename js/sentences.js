// Satzaufgaben entstehen aus denselben Beispielen und Grammatik-Häppchen wie der Lesemodus.
import { state } from './store.js';
import { allStories, parseStory, jpKana, jpRomaji, wordInfo, wordPool } from './stories.js';
import { toRomaji } from './romaji.js';

export function normalizeSentence(input) {
  return String(input).normalize('NFKC').toLowerCase()
    .replace(/[āâ]/g, 'aa').replace(/[īî]/g, 'ii').replace(/[ūû]/g, 'uu')
    .replace(/[ēê]/g, 'ee').replace(/[ōô]/g, 'ou')
    .replace(/[\s\p{P}]/gu, '')
    .replace(/oo/g, 'ou');
}

export function matchesSentence(input, sentence) {
  const answer = normalizeSentence(input);
  return !!answer && [sentence.ro, ...(sentence.answers || [])]
    .some(solution => {
      // Varianten aus der Musterlösung ableiten: ha ist auch „Zahn“ und darf
      // deshalb nicht pauschal in der Nutzereingabe zu wa geändert werden.
      const variants = { wa: 'ha', o: 'wo', e: 'he' };
      let forms = [''];
      for (const part of solution.split(/(\b(?:wa|o|e)\b)/)) {
        forms = forms.flatMap(prefix => variants[part] ? [prefix + part, prefix + variants[part]] : [prefix + part]);
      }
      return forms.some(form => normalizeSentence(form) === answer);
    });
}

export function plainStoryText(src) {
  return src.replace(/\{([^{}|]+)(?:\|([^{}|]+)\|([^{}|]+))?\}/g, (_, w, form) => form || w)
    .replace(/([一-龯㐀-䶿々〆ヵヶ]+)《[^》]+》/g, '$1').replace(/\*\*/g, '');
}

// Der Inhalt statt der Position identifiziert einen Satz: neue Story-Zeilen verschieben keine Statistik.
function sentenceId(story, src) {
  let hash = 2166136261;
  for (const c of src) hash = Math.imul(hash ^ c.codePointAt(0), 16777619) >>> 0;
  return `story-${story}-${hash.toString(36)}`;
}

export function buildSentenceCatalog(stories = allStories()) {
  const out = new Map();
  for (const story of stories) {
    let note = '';
    for (const block of parseStory(story.text)) {
      if (block.t === 'tip') { note = plainStoryText(block.src); continue; }
      if (block.t !== 'jp') continue;
      for (const line of block.lines) {
        if (!line.de.trim()) continue;
        const refs = [...line.jp.matchAll(/\{([^{}|]+)(?:\|([^{}|]+)\|([^{}|]+))?\}/g)];
        const required = [...new Set(refs.map(m => m[1]))];
        // Unbekannte Wortschlüssel oder fehlende Lesungen dürfen keine unlösbaren Aufgaben erzeugen.
        if (!required.length || required.some(w => !wordPool().has(w))) continue;
        const ro = jpRomaji(line.jp);
        if (/[一-龯㐀-䶿{}《》]/.test(ro)) continue;
        const words = required.map(w => { const x = wordInfo(w); return `${x.ro} = ${x.de}`; });
        for (const m of line.jp.matchAll(/([一-龯㐀-䶿々〆ヵヶ]+)《([^》]+)》/g)) {
          const x = wordInfo(m[1]);
          const chip = x ? `${toRomaji(m[2])} = ${x.de}` : `${toRomaji(m[2])} (${m[1]})`;
          if (!words.includes(chip)) words.push(chip);
        }
        const id = sentenceId(story.id, line.jp);
        out.set(id, {
          id, story: story.id, title: story.title, emoji: story.emoji, n: story.n,
          de: line.de, jp: plainStoryText(line.jp), kana: jpKana(line.jp), ro,
          task: `Bilde mit den Wörtern den Satz aus deiner Geschichte: ${line.de}`,
          required, words, note,
        });
      }
    }
  }
  return [...out.values()];
}

const CATALOG = buildSentenceCatalog();
export const sentenceCatalog = () => CATALOG;

// Gleiche Bedeutung wie „Gelernt“ im Lesemodus: mindestens eine erfolgreiche Wiederholung.
// Passende schon gelernte Legacy- und eigene Vokabeln zählen ebenfalls.
export function learnedSentenceWords(progress = state) {
  const learned = new Set();
  for (const [key, card] of Object.entries(progress.srs || {})) {
    if (!(card.i >= 1)) continue;
    if (key.startsWith('s:')) learned.add(key.slice(2));
    else if (key.startsWith('v:') && key.endsWith(':jd')) learned.add(key.slice(2, -3));
    else if (key.startsWith('c:') && key.endsWith(':jd')) {
      const custom = progress.custom?.[key.slice(2, -3)];
      if (custom && !custom.del) learned.add(custom.w || custom.k);
    }
  }
  return learned;
}

export function sentencePool(story = 'all', ids = null, progress = state) {
  const wanted = ids ? new Set(ids) : null;
  const learned = learnedSentenceWords(progress);
  return CATALOG.filter(s => !!progress.read?.[s.story] &&
    (story === 'all' || s.story === story) && (!wanted || wanted.has(s.id)) &&
    s.required.every(w => learned.has(w)));
}

export function sentenceStories(progress = state) {
  const ready = sentencePool('all', null, progress);
  return allStories().filter(story => progress.read?.[story.id] && CATALOG.some(s => s.story === story.id))
    .map(story => ({ ...story, available: ready.filter(s => s.story === story.id).length }));
}

export const sentenceKey = (id, mode) => `sentence:${id}:${mode}`;
