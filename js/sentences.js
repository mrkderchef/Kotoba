// Vergleich ohne Netzverbindung. Wortwahl und Grammatik bleiben relevant;
// Großschreibung, Wortabstände und Satzzeichen zählen nicht als Fehler.
import { SENTENCES } from '../data/sentences.js';

export function normalizeSentence(input) {
  return String(input).normalize('NFKC').toLowerCase()
    .replace(/[āâ]/g, 'aa').replace(/[īî]/g, 'ii').replace(/[ūû]/g, 'uu')
    .replace(/[ēê]/g, 'ee').replace(/[ōô]/g, 'ou')
    .replace(/\bha\b/g, 'wa').replace(/\bwo\b/g, 'o').replace(/\bhe\b/g, 'e')
    .replace(/[\s\p{P}]/gu, '')
    // ou / oo sind zwei gebräuchliche Schreibweisen eines langen o.
    .replace(/oo/g, 'ou');
}

export function matchesSentence(input, sentence) {
  const answer = normalizeSentence(input);
  return !!answer && [sentence.ro, ...(sentence.answers || [])]
    .some(solution => normalizeSentence(solution) === answer);
}

export function sentencePool(topic = 'all', ids = null) {
  const wanted = ids ? new Set(ids) : null;
  return SENTENCES.filter(s => (topic === 'all' || s.topic === topic) && (!wanted || wanted.has(s.id)));
}

export const sentenceKey = (id, mode) => `sentence:${id}:${mode}`;
