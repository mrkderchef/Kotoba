// Inhalts- und Offline-Prüfung ohne zusätzliche Abhängigkeiten: node scripts/check.mjs
import assert from 'node:assert/strict';
import { readdir, readFile, access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { STORIES } from '../data/stories.js';
import { WORDS } from '../data/words.js';

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
console.log(`OK: ${STORIES.length} Geschichten, ${WORDS.length} Wörter, Quiz-Daten und ${visited.size} Offline-Module geprüft.`);
