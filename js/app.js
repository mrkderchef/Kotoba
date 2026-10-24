import { state, onChange } from './store.js';
import { speak } from './speech.js';
import { syncNow, scheduleSync, syncEnabled } from './sync.js';
import { $ } from './ui.js';
import * as home from './views/home.js';
import * as kana from './views/kana.js';
import * as vocab from './views/vocab.js';
import * as phrases from './views/phrases.js';
import * as review from './views/review.js';
import * as settings from './views/settings.js';
import * as quiz from './views/quiz.js';

let root = $('#view');
let cleanup = null;

const ROUTES = [
  [/^$/, home.render, 'home'],
  [/^kana(?:\/(h|k))?$/, kana.renderOverview, 'kana'],
  [/^kana\/learn\/([\w-]+)$/, kana.renderLearn, 'kana', true],
  [/^kana\/test$/, kana.renderTest, 'kana', true],
  [/^kana\/custom$/, kana.renderCustom, 'kana'],
  [/^vocab$/, vocab.renderOverview, 'vocab'],
  [/^vocab\/cat\/([\w-]+)$/, vocab.renderCategory, 'vocab'],
  [/^vocab\/add(?:\/([\w-]+))?$/, vocab.renderAdd, 'vocab'],
  [/^phrases$/, phrases.renderOverview, 'phrases'],
  [/^phrases\/([\w-]+)$/, phrases.renderSituation, 'phrases'],
  [/^review\/([\w,]+)$/, review.renderReview, null, true],
  [/^cram\/(\w+)\/([\w-]+)$/, review.renderCram, null, true],
  [/^quiz$/, quiz.renderStart, 'vocab'],
  [/^quiz\/run$/, quiz.renderRun, null, true],
  [/^settings$/, settings.render, 'settings'],
];

function route() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [path, qs] = raw.split('?');
  const query = Object.fromEntries(new URLSearchParams(qs || ''));
  const hit = ROUTES.find(([re]) => re.test(path)) || ROUTES[0];
  const [re, fn, tab, focus] = hit;
  const m = path.match(re) || [];
  if (typeof cleanup === 'function') cleanup();
  cleanup = null;
  document.body.classList.toggle('focus', !!focus);
  document.querySelectorAll('nav.tabs a').forEach(a => a.classList.toggle('active', a.dataset.tab === tab));
  // Frischer Container, damit keine Event-Listener der vorigen Seite hängen bleiben
  const fresh = root.cloneNode(false);
  root.replaceWith(fresh);
  root = fresh;
  window.scrollTo(0, 0);
  cleanup = fn(root, m.slice(1), query);
}

window.addEventListener('hashchange', route);

// Globale Klick-Handler: Vorlesen
document.addEventListener('click', e => {
  const b = e.target.closest('[data-speak]');
  if (b) { e.preventDefault(); e.stopPropagation(); speak(b.dataset.speak); }
});

// Theme
function applyTheme() {
  const t = state.settings.theme;
  if (t === 'auto') document.documentElement.removeAttribute('data-theme');
  else document.documentElement.setAttribute('data-theme', t);
  document.documentElement.dataset.kanafont = state.settings.kanaFont;
}
applyTheme();

// Bei Änderungen speichern + Sync planen
onChange(() => { applyTheme(); scheduleSync(); });

// Sync beim Start, beim Zurückkehren in die App und beim Verlassen
const rerender = changed => { if (changed && !document.body.classList.contains('focus')) route(); };
if (syncEnabled()) syncNow().then(rerender);
document.addEventListener('visibilitychange', () => {
  if (!syncEnabled()) return;
  if (document.visibilityState === 'hidden') syncNow();
  else syncNow().then(rerender);
});
window.addEventListener('online', () => syncEnabled() && syncNow());

// Offline-Fähigkeit
if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  navigator.serviceWorker.register('./sw.js').catch(() => {});
}

route();
