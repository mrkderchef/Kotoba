// Inhalts- und Offline-Prüfung ohne zusätzliche Abhängigkeiten: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { STORIES } from '../data/stories.js';
import { WORDS } from '../data/words.js';
import { SENTENCES, SENTENCE_TOPICS } from '../data/sentences.js';
import { matchesSentence, sentencePool, sentenceKey } from '../js/sentences.js';

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

assert.equal(new Set(SENTENCES.map(s => s.id)).size, SENTENCES.length, 'Doppelte Satz-IDs');
for (const s of SENTENCES) {
  assert(/^[\w-]+$/.test(s.id), `Ungültige Satz-ID: ${s.id}`);
  assert(Object.hasOwn(SENTENCE_TOPICS, s.topic), `${s.id}: unbekanntes Thema`);
  for (const field of ['de', 'jp', 'ro', 'task', 'note']) assert(s[field]?.trim(), `${s.id}: ${field} fehlt`);
  assert(s.words.length >= 2 && s.words.every(w => w.trim()), `${s.id}: Wörter für Satzbau fehlen`);
  assert(/^[a-z\s.,?!'-]+$/i.test(s.ro), `${s.id}: Musterlösung muss Romaji enthalten`);
  assert(matchesSentence(s.ro, s), `${s.id}: Musterlösung wird abgelehnt`);
  assert(matchesSentence(s.ro.toUpperCase().replaceAll(' ', ''), s), `${s.id}: Großschreibung / Wortabstände`);
  for (const answer of s.answers || []) assert(matchesSentence(answer, s), `${s.id}: Variante wird abgelehnt`);
  assert(!matchesSentence('', s) && !matchesSentence('... !', s), `${s.id}: leere Antwort erkannt`);
  assert(!matchesSentence('keine ahnung', s), `${s.id}: falsche Antwort erkannt`);
}
const sentence = id => SENTENCES.find(s => s.id === id);
assert(matchesSentence('Watashi ha mizu wo nomimasu!', sentence('water')), 'Partikelschreibweise ha / wo');
assert(matchesSentence('ashita Tōkyō e ikimasu', sentence('tomorrow-tokyo')), 'Makrons und alternatives Zielpartikel');
assert(matchesSentence('ｍｉｚｕ　ｏ　ｎｏｍｉｍａｓｕ。', sentence('water')), 'Vollbreite lateinische Zeichen');
assert(matchesSentence('maiasa kōhī o nomimasu', sentence('morning-coffee')), 'Lange Vokale mit Makrons');
assert(!matchesSentence('maiasa kohi o nomimasu', sentence('morning-coffee')), 'Vokallänge muss erhalten bleiben');
assert(!matchesSentence('mizu ni nomimasu', sentence('water')), 'Falsche Partikel nicht akzeptieren');
assert(!matchesSentence('mizu o nomimasen', sentence('water')), 'Falsche Verbform nicht akzeptieren');
assert(!matchesSentence('mizu o nomimasu extra', sentence('water')), 'Zusätzliche Wörter nicht ignorieren');
assert(!matchesSentence('水を飲みます', sentence('water')), 'Romaji-Eingabe erwartet');
for (const topic of Object.keys(SENTENCE_TOPICS)) {
  assert(sentencePool(topic).length > 0, `${topic}: keine Sätze`);
  assert(sentencePool(topic).every(s => s.topic === topic), `${topic}: falsche Themenauswahl`);
}
assert.deepEqual(sentencePool('all', ['water']).map(s => s.id), ['water'], 'Fehler-Runde filtern');
assert.equal(sentencePool('places', ['water']).length, 0, 'Themenfilter auch bei Fehler-Runde');
assert.notEqual(sentenceKey('water', 'translate'), sentenceKey('water', 'build'), 'Getrennte Statistik der Modi');

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
console.log(`OK: ${STORIES.length} Geschichten, ${WORDS.length} Wörter, ${SENTENCES.length} Satzaufgaben, Romaji-Vergleich, Quiz-Daten und ${visited.size} Offline-Module geprüft.`);
