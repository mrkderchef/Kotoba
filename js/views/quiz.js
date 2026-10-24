// Test alter Vokabeln: gewichtete Zufallsauswahl aus allem, was du schon gelernt hast.
// Unabhängig vom Anki-Zeitplan – beeinflusst nur die eigene Test-Statistik.
import { state, save, bump, quizRecord, quizStats } from '../store.js';
import { vocabItems, customItems } from '../cards.js';
import { speak } from '../speech.js';
import { front, back } from './review.js';
import { header, esc, $, go } from '../ui.js';

const DIRS = { jd: 'Japanisch → Deutsch', dj: 'Deutsch → Japanisch', mix: 'Gemischt' };
const SIZES = [['10', '10'], ['20', '20'], ['50', '50'], ['0', '∞']];
const GRADES = [
  { s: 0, label: 'Falsch', cls: 'again', key: '1' },
  { s: 0.5, label: 'Unsicher', cls: 'hard', key: '2' },
  { s: 1, label: 'Gewusst', cls: 'good', key: '3' },
];

// Alle Vokabeln, die schon mindestens einmal in der täglichen Wiederholung dran waren
export function learnedPool() {
  return [...vocabItems(), ...customItems()].filter(i => state.srs[`${i.key}:jd`]);
}

// Je schlechter du ein Wort kannst, desto öfter kommt es dran
export function weight(item, dir, now = Date.now()) {
  const s = quizStats(`${item.key}:${dir}`);
  const err = (s.w + 0.5) / (s.n + 1.5);              // Fehlerquote (ungetestet ≈ 0,33)
  const c = state.srs[`${item.key}:jd`];
  const srsWeak = c ? Math.min(1, (c.l || 0) * 0.25 + Math.max(0, 2.5 - (c.e ?? 2.5))) : 0;
  const young = c && c.i < 7 ? 0.3 : 0;                // frisch gelernt = noch wackelig
  const mins = s.t ? (now - s.t) / 60000 : Infinity;
  const recency = Math.min(1, Math.max(0.03, mins / 60)); // gerade erst gefragt -> seltener
  return (0.15 + err * 2 + srsWeak + young) * recency;
}

export function errorRate(item, dir) {
  const s = quizStats(`${item.key}:${dir}`);
  return s.n ? s.w / s.n : 0;
}

function pick(cands, exclude) {
  const now = Date.now();
  const list = cands.filter(c => !exclude.has(c.item.key));
  const pool = list.length ? list : cands;
  const ws = pool.map(c => weight(c.item, c.dir, now));
  let x = Math.random() * ws.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) { x -= ws[i]; if (x <= 0) return pool[i]; }
  return pool[pool.length - 1];
}

export function renderStart(root) {
  const pool = learnedPool();
  const weakest = pool.flatMap(i => ['jd', 'dj'].map(dir => ({ i, dir, s: quizStats(`${i.key}:${dir}`) })))
    .filter(x => x.s.n >= 2 && x.s.w > 0)
    .sort((a, b) => b.s.w / b.s.n - a.s.w / a.s.n || b.s.w - a.s.w)
    .slice(0, 8);
  const tested = pool.filter(i => quizStats(`${i.key}:jd`).n || quizStats(`${i.key}:dj`).n).length;
  let dir = 'jd', size = '20';

  root.innerHTML = `
    ${header('Alte Vokabeln testen', '#/vocab')}
    <main class="page">
      <section class="card">
        <div class="card-title">🎯 Test-Modus</div>
        <p>Zieht zufällig aus <b>allen ${pool.length} Vokabeln</b>, die du schon gelernt hast. Wörter, die du oft falsch hast, kommen häufiger dran. Was du gerade erst hattest, kommt seltener.</p>
        <p class="muted small-note">Läuft unabhängig von der täglichen Wiederholung und verschiebt dort nichts. ${tested ? `Bisher getestet: ${tested} Wörter.` : ''}</p>
      </section>
      ${pool.length < 4 ? `
        <section class="card"><p>Du brauchst mindestens 4 gelernte Vokabeln. Starte zuerst die tägliche Wiederholung.</p>
        <a class="btn primary wide" href="#/review/vocab,custom">Vokabeln lernen</a></section>` : `
      <section class="card">
        <div class="sub-title">Richtung</div>
        <div class="seg" id="dir">${Object.entries(DIRS).map(([k, n]) => `<a href="#" data-v="${k}" class="${k === dir ? 'on' : ''}">${n}</a>`).join('')}</div>
        <div class="sub-title">Anzahl</div>
        <div class="seg small" id="size">${SIZES.map(([k, n]) => `<a href="#" data-v="${k}" class="${k === size ? 'on' : ''}">${n}</a>`).join('')}</div>
        <button class="btn primary big" id="start" style="margin-top:14px">Test starten</button>
      </section>`}
      ${weakest.length ? `
      <section class="card">
        <div class="card-title">Deine Wackelkandidaten</div>
        <ul class="words">${weakest.map(({ i, dir, s }) => `
          <li class="word"><div class="w-jp"><span class="jp w">${esc(i.w)}</span>${i.w !== i.k ? `<span class="jp k">${esc(i.k)}</span>` : ''}</div>
          <div class="w-de">${esc(i.de)}<div class="note">${dir === 'jd' ? 'JP → DE' : 'DE → JP'}</div></div>
          <div class="w-side"><span class="st st-learning">${Math.round((s.w / s.n) * 100)} % falsch</span></div></li>`).join('')}
        </ul>
        <a class="btn wide" href="#/quiz/run?dir=mix&n=20&keys=${encodeURIComponent(weakest.map(x => x.i.key).join('|'))}">Nur diese üben</a>
      </section>` : ''}
    </main>`;

  const seg = (id, set) => {
    const el = $(id, root);
    if (el) el.addEventListener('click', e => {
      const a = e.target.closest('[data-v]');
      if (!a) return;
      e.preventDefault();
      set(a.dataset.v);
      el.querySelectorAll('a').forEach(x => x.classList.toggle('on', x === a));
    });
  };
  seg('#dir', v => { dir = v; });
  seg('#size', v => { size = v; });
  const start = $('#start', root);
  if (start) start.onclick = () => go(`#/quiz/run?dir=${dir}&n=${size}`);
}

export function renderRun(root, _, q) {
  const dirs = q.dir === 'mix' ? ['jd', 'dj'] : [q.dir === 'dj' ? 'dj' : 'jd'];
  const keys = q.keys ? new Set(q.keys.split('|')) : null;
  const pool = learnedPool().filter(i => !keys || keys.has(i.key));
  if (!pool.length) return go('#/quiz');
  const cands = pool.flatMap(item => dirs.map(dir => ({ id: `${item.key}:${dir}`, item, dir })));
  const total = +q.n || 0; // 0 = endlos
  const recent = [];       // zuletzt gefragte Wörter nicht direkt wiederholen
  const retry = [];        // falsche Wörter kommen nach ein paar Karten nochmal
  const results = [];
  let cur = null, revealed = false, asked = 0;
  const exit = '#/quiz';

  root.innerHTML = `
    <header class="top session">
      <a class="back" href="${exit}" aria-label="Beenden">✕</a>
      <h1>${esc(DIRS[q.dir] || DIRS.jd)}</h1>
      <span class="score" id="score"></span>
    </header>
    <main class="page review">
      <div class="rcard card" id="card">
        <div class="kind" id="kind"></div>
        <div class="front" id="front"></div>
        <div class="rback" id="back" hidden></div>
      </div>
      <div class="answer-bar" id="bar"></div>
    </main>`;
  const el = { card: $('#card', root), front: $('#front', root), back: $('#back', root), bar: $('#bar', root), kind: $('#kind', root), score: $('#score', root) };

  function updateScore() {
    const right = results.reduce((s, r) => s + r.s, 0);
    el.score.innerHTML = `${total ? `${Math.min(asked, total)}/${total} · ` : `${asked} · `}<span class="ok">${Math.round(right * 10) / 10}</span>/<span>${results.length}</span>`;
  }

  function next() {
    if (total && asked >= total && !retry.length) return finish();
    revealed = false;
    const due = retry.findIndex(r => r.at <= asked);
    if (due >= 0) cur = { ...retry.splice(due, 1)[0].card, isRetry: true };
    else if (total && asked >= total) cur = { ...retry.shift().card, isRetry: true };
    else cur = pick(cands, new Set(recent));
    if (!cur.isRetry) asked++;
    recent.push(cur.item.key);
    if (recent.length > Math.min(5, Math.floor(pool.length / 2))) recent.shift();

    const s = quizStats(cur.id);
    el.kind.innerHTML = cur.isRetry ? 'Nochmal' : s.n ? `${Math.round((s.r / s.n) * 100)} % gewusst · ${Math.round(s.n)}× getestet` : 'Erstes Mal im Test';
    el.front.innerHTML = front(cur);
    el.back.hidden = true;
    el.card.classList.remove('revealed');
    el.bar.innerHTML = '<button class="btn primary big" id="reveal">Antwort zeigen <small>Leertaste</small></button>';
    $('#reveal', root).onclick = reveal;
    const hint = $('#hint', root);
    if (hint) hint.onclick = e => { e.stopPropagation(); $('#hintText', root).hidden = false; hint.remove(); };
    updateScore();
  }

  function reveal() {
    if (revealed || !cur) return;
    revealed = true;
    el.back.innerHTML = back(cur);
    el.back.hidden = false;
    el.card.classList.add('revealed');
    if (state.settings.autoSpeak) speak(cur.item.k);
    el.bar.innerHTML = `<div class="grades three">${GRADES.map(g => `<button class="grade ${g.cls}" data-s="${g.s}"><b>${g.label}</b><small>${g.key}</small></button>`).join('')}</div>`;
  }

  function grade(score) {
    if (!revealed || !cur) return;
    if (!cur.isRetry) {
      quizRecord(cur.id, score);
      results.push({ card: cur, s: score });
      bump('x');
      save();
    }
    if (score < 1 && !cur.isRetry) retry.push({ card: { id: cur.id, item: cur.item, dir: cur.dir }, at: asked + 3 });
    next();
  }

  el.bar.addEventListener('click', e => { const b = e.target.closest('[data-s]'); if (b) grade(+b.dataset.s); });
  // Endlos-Modus: ✕ zeigt erst die Auswertung
  $('header .back', root).addEventListener('click', e => {
    if (!total && results.length && cur) { e.preventDefault(); finish(); }
  });
  el.card.addEventListener('click', e => { if (!e.target.closest('button')) reveal(); });
  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); revealed ? grade(1) : reveal(); }
    else if (revealed && /^[1-3]$/.test(e.key)) grade(GRADES[+e.key - 1].s);
    else if (e.key === 'r' && cur) speak(cur.item.k);
  };
  document.addEventListener('keydown', onKey);

  function finish() {
    cur = null;
    const right = results.reduce((s, r) => s + r.s, 0);
    const pct = results.length ? Math.round((right / results.length) * 100) : 0;
    const missed = [...new Map(results.filter(r => r.s < 1).map(r => [r.card.item.key, r.card])).values()];
    el.score.innerHTML = '';
    root.querySelector('.review').innerHTML = `
      <div class="card result">
        <div class="pct ${pct >= 90 ? 'ok' : pct >= 70 ? 'warn' : 'bad'}">${pct}%</div>
        <h2>${pct >= 90 ? 'すごい！' : pct >= 70 ? 'Gut dabei!' : 'Dranbleiben!'}</h2>
        <p class="muted">${results.length} Wörter getestet</p>
        ${missed.length ? `<div class="sub-title">Noch wackelig</div>
          <ul class="words">${missed.map(c => `<li class="word"><div class="w-jp"><span class="jp w">${esc(c.item.w)}</span>${c.item.w !== c.item.k ? `<span class="jp k">${esc(c.item.k)}</span>` : ''}</div><div class="w-de">${esc(c.item.de)}</div><div class="w-side"></div></li>`).join('')}</ul>` : ''}
        <div class="row-btns col">
          ${missed.length ? `<a class="btn primary" href="#/quiz/run?dir=${q.dir}&n=${missed.length * 2}&keys=${encodeURIComponent(missed.map(c => c.item.key).join('|'))}">Nur die Fehler üben</a>` : ''}
          <button class="btn ${missed.length ? '' : 'primary'}" id="again">Neue Runde</button>
          <a class="btn ghost" href="${exit}">Fertig</a>
        </div>
      </div>`;
    $('#again', root).onclick = () => go(`#/quiz/run?dir=${q.dir}&n=${total || 20}`);
  }

  next();
  return () => {
    document.removeEventListener('keydown', onKey);
  };
}
