// Inhalts- und Offline-Prüfung ohne zusätzliche Abhängigkeiten: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { STORIES } from '../data/stories.js';
import { WORDS } from '../data/words.js';
import { matchesSentence, sentencePool, sentenceKey, sentenceCatalog, buildSentenceCatalog, learnedSentenceWords, sentenceStories } from '../js/sentences.js';
import { allStories, parseStory } from '../js/stories.js';

const root = new URL('../', import.meta.url);
const pool = new Set(WORDS.map(w => w[0]));
assert.equal(pool.size, WORDS.length, 'Doppelte Wörter');
assert.equal(new Set(STORIES.map(s => s.id)).size, STORIES.length, 'Doppelte Geschichten-IDs');
for (const file of await readdir(new URL('data/stories/', root))) {
  if (!file.endsWith('.js')) continue;
  const { STORIES: block } = await import(new URL(`data/stories/${file}`, root));
  for (const story of block) assert(STORIES.includes(story), `${file}: Geschichte ${story.id} nicht eingebunden`);
}
for (const s of STORIES) {
  assert(/^[\w-]+$/.test(s.id), `Ungültige Route: ${s.id}`);
  for (const field of ['title', 'topic', 'emoji', 'text']) assert(s[field]?.trim(), `${s.id}: ${field} fehlt`);
  assert(!/^>.*\.\.\./m.test(s.text), `${s.id}: unfertiger Satz`);
  for (const m of s.text.matchAll(/\{([^{}|]+)(?:\|([^{}|]+)\|([^{}|]+))?\}/g)) {
    assert(pool.has(m[1]), `${s.id}: Wort ${m[1]} fehlt`);
  }
  assert.equal(s.quiz.length, 3, `${s.id}: drei Wissensfragen erwartet`);
  for (const q of s.quiz) {
    assert.equal(q.length, 5, `${s.id}: vier Antworten erwartet`);
    assert(q.every(t => typeof t === 'string' && t.trim()), `${s.id}: leere Quiz-Antwort`);
    assert.equal(new Set(q.slice(1)).size, 4, `${s.id}: doppelte Quiz-Antwort`);
  }
}

const sentences = sentenceCatalog();
const sourceLines = allStories().flatMap(story => parseStory(story.text).flatMap(block => block.t === 'jp' ? block.lines : []));
assert.equal(sentences.length, sourceLines.length, 'Alle bestehenden Beispielsätze müssen nutzbar sein');
assert.equal(new Set(sentences.map(s => s.id)).size, sentences.length, 'Doppelte Satz-IDs');
const complete = {
  read: Object.fromEntries(STORIES.map(s => [s.id, { n: 1 }])),
  srs: Object.fromEntries(WORDS.map(w => [`s:${w[0]}`, { i: 1 }])),
};
assert.equal(sentencePool('all', null, complete).length, sentences.length, 'Vollständiger Lernstand schaltet alle Beispiele frei');
assert.equal(sentencePool('all', null, { read: {}, srs: complete.srs }).length, 0, 'Ungelesene Grammatik sperren');
assert.equal(sentencePool('all', null, { read: complete.read, srs: {} }).length, 0, 'Unbekannte Wörter sperren');
assert.equal(sentencePool('all', null, {}).length, 0, 'Leerer Lernstand');
for (const s of sentences) {
  assert(/^[\w-]+$/.test(s.id), `Ungültige Satz-ID: ${s.id}`);
  for (const field of ['de', 'jp', 'kana', 'ro', 'task', 'note', 'title']) assert(s[field]?.trim(), `${s.id}: ${field} fehlt`);
  assert(s.words.length && s.words.every(w => w.trim()), `${s.id}: Wortbausteine fehlen`);
  assert(!/[一-龯㐀-䶿{}《》]/.test(s.ro), `${s.id}: nicht lesbare Romaji`);
  assert(matchesSentence(s.ro, s), `${s.id}: Musterlösung wird abgelehnt`);
  assert(matchesSentence(s.ro.toUpperCase().replaceAll(' ', ''), s), `${s.id}: Großschreibung / Wortabstände`);
  assert(!matchesSentence('', s) && !matchesSentence('... !', s), `${s.id}: leere Antwort erkannt`);
  assert(!matchesSentence('keine ahnung', s), `${s.id}: falsche Antwort erkannt`);
  const progress = { read: { [s.story]: { n: 1 } }, srs: Object.fromEntries(s.required.map(w => [`s:${w}`, { i: 1 }])) };
  assert(sentencePool(s.story, [s.id], progress).some(x => x.id === s.id), `${s.id}: passender Lernstand`);
  progress.srs[`s:${s.required[0]}`].i = 0;
  assert.equal(sentencePool(s.story, [s.id], progress).length, 0, `${s.id}: ein unbekanntes Wort reicht zum Sperren`);
}
const mond = sentences.filter(s => s.story === 'mond');
const partial = { read: { mond: { n: 1 } }, srs: { 's:月': { i: 1 }, 's:白い': { i: 1 } } };
assert.deepEqual(sentencePool('all', null, partial).map(s => s.id), [mond[0].id], 'Nur Sätze mit bekannten Wörtern');
assert.deepEqual(sentenceStories(partial).map(s => [s.id, s.available]), [['mond', 1]], 'Geschichtenfilter zählt nur freigeschaltete Sätze');
assert.equal(sentencePool('samurai', null, partial).length, 0, 'Geschichtenfilter');
assert.equal(sentencePool('mond', [mond[1].id], partial).length, 0, 'Fehler-Runde darf keine gesperrten Wörter freischalten');
assert.equal(sentencePool('mond', ['nicht-vorhanden'], complete).length, 0, 'Unbekannte Satz-ID');
const legacy = { read: partial.read, srs: { 'v:月:jd': { i: 1 }, 'v:白い:jd': { i: 2 } } };
assert.equal(sentencePool('mond', null, legacy).length, 1, 'Bereits gelernte Legacy-Wörter zählen');
const custom = { read: partial.read, srs: { 'c:moon:jd': { i: 1 }, 's:白い': { i: 1 } }, custom: { moon: { w: '月', k: 'つき' } } };
assert.equal(sentencePool('mond', null, custom).length, 1, 'Bereits gelernte eigene Wörter zählen');
custom.custom.moon.del = true;
assert(!learnedSentenceWords(custom).has('月'), 'Gelöschte eigene Wörter zählen nicht');
const fixture = { id: 'new-story', title: 'Neue Geschichte', emoji: '🌙', n: 99, text: '! Erste Grammatik.\n\n> {月}は{白い}です。 | Der Mond ist weiß.\n\n! Zweite Grammatik.\n\n> {空}は{青い}です。 | Der Himmel ist blau.' };
const generated = buildSentenceCatalog([fixture]);
assert.equal(generated.length, 2, 'Neue Geschichten erzeugen ohne Aufgabendatei Sätze');
assert.deepEqual(generated.map(s => s.note), ['Erste Grammatik.', 'Zweite Grammatik.'], 'Grammatik des jeweiligen Blocks zuordnen');
const reordered = buildSentenceCatalog([{ ...fixture, text: '> {海}は{大きい}です。 | Das Meer ist groß.\n\n' + fixture.text }]);
assert.equal(generated[0].id, reordered[1].id, 'Stabile IDs trotz eingefügter Beispiele');
assert.equal(buildSentenceCatalog([{ ...fixture, text: '> {月}です。' }]).length, 0, 'Fehlende Übersetzung nicht abfragen');
assert.equal(buildSentenceCatalog([{ ...fixture, text: '> {Unbekannt}です。 | Unbekannt.' }]).length, 0, 'Fehlende Wortschlüssel nicht abfragen');
const tea = sentences.find(s => s.jp === '侍はお茶を飲みます。');
assert(matchesSentence('SAMURAI ha ocha wo nomimasu!', tea), 'Partikelschreibweise ha / wo');
assert(matchesSentence('ｓａｍｕｒａｉ　ｗａ　ｏｃｈａ　ｏ　ｎｏｍｉｍａｓｕ。', tea), 'Vollbreite lateinische Zeichen');
assert(!matchesSentence('samurai ni ocha o nomimasu', tea), 'Falsche Partikel nicht akzeptieren');
assert(!matchesSentence('samurai wa ocha o nomimasen', tea), 'Falsche Verbform nicht akzeptieren');
assert(!matchesSentence(tea.ro + ' extra', tea), 'Zusätzliche Wörter nicht ignorieren');
assert(!matchesSentence(tea.jp, tea), 'Romaji-Eingabe erwartet');
const tooth = sentences.find(s => s.jp.includes('歯も痛い'));
assert(matchesSentence(tooth.ro.replaceAll(' ', ''), tooth), 'ha als Wort für Zahn erhalten');
assert(!matchesSentence(tooth.ro.replace('ha mo', 'wa mo'), tooth), 'Zahn ist kein Thema-Partikel');
assert(matchesSentence('umi wa ōkii desu', mond[2]), 'Makrons');
assert(!matchesSentence('umi wa oki desu', mond[2]), 'Vokallänge muss erhalten bleiben');
assert.equal(sentences.find(s => s.jp === '店は九時に開きます。').ro, 'mise wa ku ji ni akimasu.', 'Kontextlesung von 九時');
assert.equal(sentences.find(s => s.jp === 'この食べ物は何ですか。').ro, 'kono tabemono wa nan desu ka.', 'Kontextlesung von 何ですか');
assert.notEqual(sentenceKey(tea.id, 'translate'), sentenceKey(tea.id, 'build'), 'Getrennte Statistik der Modi');

const worker = await readFile(new URL('sw.js', root), 'utf8');
const context = { self: { addEventListener() {} } };
vm.runInNewContext(`${worker}\nglobalThis.assets = CORE;`, context);
const assets = new Set(context.assets);
for (const path of assets) await access(new URL(path, root));
// Jedes statisch importierte Modul muss auch beim ersten Offline-Start vorhanden sein.
const visited = new Set();
async function checkModule(url) {
  const path = './' + fileURLToPath(url).slice(fileURLToPath(root).length);
  if (visited.has(path)) return;
  visited.add(path);
  assert(assets.has(path), `Offline-Cache fehlt: ${path}`);
  const source = await readFile(url, 'utf8');
  for (const m of source.matchAll(/\b(?:import|export)\s+(?:[^;]*?\s+from\s+)?['"]([^'"]+)['"]/g)) {
    if (m[1].startsWith('.')) await checkModule(new URL(m[1], url));
  }
}
await checkModule(new URL('js/app.js', root));
console.log(`OK: ${STORIES.length} Geschichten, ${WORDS.length} Wörter, ${sentences.length} dynamische Satzaufgaben, Lernstand-Filter, Romaji-Vergleich, Quiz-Daten und ${visited.size} Offline-Module geprüft.`);
