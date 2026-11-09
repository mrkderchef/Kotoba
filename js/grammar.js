import { GRAMMAR_RULES, GRAMMAR_GROUPS } from '../data/grammar.js';
import { normalizeSentence, sentencePool } from './sentences.js';
import { quizStats } from './store.js';

export const grammarRule = id => GRAMMAR_RULES.find(r => r.id === id);
export const grammarKey = id => `grammar:${id}:practice`;
const PAIRS = { 'no-ni': ['no', 'ni'], 'wa-ga': ['wa', 'ga'] };
export const grammarTopic = id => (grammarRule(id) || Object.hasOwn(GRAMMAR_GROUPS, id) || Object.hasOwn(PAIRS, id)) ? id : 'all';
export const topicRules = topic => GRAMMAR_RULES.filter(r => topic === 'all' || r.id === topic || r.group === topic || PAIRS[topic]?.includes(r.id));
export const grammarProfile = () => GRAMMAR_RULES.map(rule => ({ rule, ...quizStats(grammarKey(rule.id)) }));
export function grammarMatches(input, rule) {
  const answer = normalizeSentence(input);
  return !!answer && [rule.label, ...(rule.aliases || [])].some(a => normalizeSentence(a) === answer);
}

// Formeln können sofort wiederholt werden, auch bevor die erste Geschichte gelesen ist.
export function formulaQuestions(topic = 'all') {
  return topicRules(topic).map(rule => ({ id: `formula-${rule.id}`, rule: rule.id, prompt: rule.question, before: '', after: '', sentence: null }));
}

// Genau eine Partikel oder Endung pro Aufgabe. Der Rest des bekannten Satzes bleibt stehen.
// Die Funktion fragt die Rolle ausdrücklich ab: wa / ga können ohne Kontext beide gültig sein.
export function storyGrammarQuestions(topic = 'all', sentences = sentencePool()) {
  const allowed = new Set(topicRules(topic).map(r => r.id));
  const out = [];
  for (const sentence of sentences) {
    const ro = sentence.ro;
    for (const m of ro.matchAll(/\b(wa|ga|no|ni|o|de|ka)\b/g)) {
      const id = m[1];
      if (!allowed.has(id)) continue;
      if (id === 'o' && sentence.required?.some(w => ['渡る', '歩く', '走る', '出る', '降りる'].includes(w))) continue;
      // ni shimasu („ich nehme …“) ist ein eigenes Muster und gehört nicht zu dieser Grundregel.
      if (id === 'ni' && /^\s+shi(?:masu|masen|mashita)/.test(ro.slice(m.index + m[0].length))) continue;
      out.push({ id: `${sentence.id}-${id}-${m.index}`, rule: id, prompt: grammarRule(id).question,
        before: ro.slice(0, m.index), after: ro.slice(m.index + m[0].length), sentence });
    }
    for (const m of ro.matchAll(/\b[a-z']+?(masen\s*deshita|mashita|masen|masu)\b/g)) {
      const ending = m[1];
      const id = ending.replace(/\s/g, '') === 'masendeshita' ? 'masen-deshita' : ending;
      if (!allowed.has(id)) continue;
      const start = m.index + m[0].length - ending.length;
      out.push({ id: `${sentence.id}-${id}-${start}`, rule: id, prompt: `Ergänze die Verbendung: ${grammarRule(id).role.toLowerCase()}.`,
        before: ro.slice(0, start), after: ro.slice(start + ending.length), sentence });
    }
  }
  return out;
}
