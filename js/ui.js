// Kleine UI-Helfer
import { state } from './store.js';

export const $ = (sel, el = document) => el.querySelector(sel);
export const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];

export function esc(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

export function go(hash) {
  if (location.hash === hash) window.dispatchEvent(new HashChangeEvent('hashchange'));
  else location.hash = hash;
}

export function toast(msg, ms = 2200) {
  let el = $('#toast');
  if (!el) { el = document.createElement('div'); el.id = 'toast'; document.body.append(el); }
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.remove('show'), ms);
}

export const speakBtn = (text, cls = '') =>
  `<button class="speak ${cls}" data-speak="${esc(text)}" aria-label="Vorlesen" title="Vorlesen">🔊</button>`;

export function romajiHtml(ro) {
  return state.settings.showRomaji ? `<div class="ro">${esc(ro)}</div>` : '';
}

export function progressRing(pct, size = 44, label = '') {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  return `<svg class="ring" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" aria-hidden="true">
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-bg"/>
    <circle cx="${size / 2}" cy="${size / 2}" r="${r}" class="ring-fg" stroke-dasharray="${c}" stroke-dashoffset="${c * (1 - Math.min(1, pct))}"/>
    <text x="50%" y="50%" dy=".35em" text-anchor="middle">${label}</text></svg>`;
}

export function bar(pct, cls = '') {
  return `<div class="bar ${cls}"><span style="width:${Math.round(Math.min(1, pct) * 100)}%"></span></div>`;
}

export function shuffle(a) {
  a = [...a];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export function header(title, back) {
  return `<header class="top">
    ${back ? `<a class="back" href="${back}" aria-label="Zurück">‹</a>` : '<span class="logo">言葉</span>'}
    <h1>${title}</h1>
    <a class="gear" href="#/settings" aria-label="Einstellungen">⚙︎</a>
  </header>`;
}
