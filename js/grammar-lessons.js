import { GRAMMAR_LESSONS, LESSON_UNITS } from '../data/grammar-lessons.js';
import { normalizeSentence, matchesSentence } from './sentences.js';
import { section, updateSection, quizStats } from './store.js';

export const grammarLessons = () => GRAMMAR_LESSONS;
export const grammarLesson = id => GRAMMAR_LESSONS.find(l => l.id === id);
export const lessonKey = id => `grammar-lesson:${id}`;
export const lessonQuestionKey = (id, q) => `${lessonKey(id)}:${q}`;
export const lessonProgress = id => section(lessonKey(id));
export const markLessonRead = id => { if (grammarLesson(id)) updateSection(lessonKey(id), { learned: true }); };
export const nextGrammarLesson = () => GRAMMAR_LESSONS.find(l => !lessonProgress(l.id).passed) || GRAMMAR_LESSONS[0];
export const lessonExample = example => {
  const match = example.marked.match(/^(.*?)\[([^\[\]]+)\](.*?)$/s);
  if (!match) throw new Error(`Lernziel fehlt: ${example.marked}`);
  const [, before, answer, after] = match;
  return { ...example, before, answer, after, ro: before + answer + after };
};

// Each lesson has its own fixed test, including a new transfer sentence.
// The transfer is not displayed on the teaching page.
export function lessonQuestions(id) {
  const lesson = grammarLesson(id);
  if (!lesson) return [];
  return [
    { id: 'understand', kind: 'choice', ...lesson.check },
    ...lesson.examples.map((ex, i) => ({ id: `gap-${i + 1}`, kind: 'gap', ...lessonExample(ex),
      prompt: `Ergänze das Lernmuster: ${ex.de}` })),
    { id: 'build', kind: 'build', ...lessonExample(lesson.transfer), prompt: 'Bilde den neuen Satz mit den vorgegebenen Wörtern.' },
  ];
}

export function matchesLessonAnswer(input, question, lesson) {
  if (question.kind === 'choice') return input === question.answer;
  if (question.kind === 'build') {
    const answers = lesson.id === 'destination' ? [question.ro.replace(/\bni\b/, 'e')] : [];
    return matchesSentence(input, { ro: question.ro, answers });
  }
  const aliases = { wa: ['ha'], o: ['wo'] };
  if (lesson.id === 'destination' && question.answer === 'ni') aliases.ni = ['e', 'he'];
  return [question.answer, ...(aliases[question.answer] || [])].some(x => normalizeSentence(input) && normalizeSentence(input) === normalizeSentence(x));
}

export function lessonStats(id) {
  const totals = lessonQuestions(id).map(q => quizStats(lessonQuestionKey(id, q.id)));
  return { n: totals.reduce((n, s) => n + s.n, 0), r: totals.reduce((n, s) => n + s.r, 0) };
}

// Only a complete test earns a best score / pass; retrying a subset cannot
// accidentally mark an entire lesson as passed. Hints do not earn full credit.
export function finishLessonTest(id, results, { retry = false } = {}) {
  const questions = lessonQuestions(id);
  const ids = new Set(results.map(r => r.id));
  const full = !retry && questions.length > 0 && results.length === questions.length && ids.size === questions.length && questions.every(q => ids.has(q.id));
  const right = results.filter(r => r.correct && !r.hinted).length;
  const percent = results.length ? Math.round(right / results.length * 100) : 0;
  if (full) updateSection(lessonKey(id), { best: percent, passed: percent >= 75 });
  return { right, percent, full, passed: full && percent >= 75 };
}

export function filterLessons(search = '', unit = 'all', mode = 'all') {
  const term = search.trim().toLocaleLowerCase('de');
  return GRAMMAR_LESSONS.filter(l => (unit === 'all' || l.unit === unit) &&
    (mode !== 'open' || !lessonProgress(l.id).passed) && (mode !== 'passed' || lessonProgress(l.id).passed) &&
    (!term || [l.title, l.goal, l.formula, ...l.explain, LESSON_UNITS[l.unit]].join(' ').toLocaleLowerCase('de').includes(term)));
}

export function lessonsForStory(story) {
  return GRAMMAR_LESSONS.filter(l => l.stories.includes(story));
}
