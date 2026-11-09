// Lesen: Geschichten mit eingewobenen Wörtern, Quiz danach, Wiederholung im Kontext.
import { state, save, bump, today, streak } from '../store.js';
import { schedule } from '../srs.js';
import { STATUS_LABEL } from '../cards.js';
import { speak, canSpeak } from '../speech.js';
import { hasKanji } from '../romaji.js';
import {
  allStories, storyById, storyWords, parseStory, renderInline, jpKana, jpRomaji, wordInfo, wordCard, wordId, wordStatus,
  helpLevel, wordPool, knownWords, dueWords, contexts, isRead, markRead, nextStory, progress,
} from '../stories.js';
import { greeting, heatmap } from './home.js';
import { header, esc, $, go, toast, bar, shuffle, speakBtn } from '../ui.js';

const newCount = s => storyWords(s).filter(w => !wordCard(w)).length;

// ---------- Bausteine ----------
function bigWord(x, reading = true) {
  return hasKanji(x.w) && reading ? `<ruby>${esc(x.w)}<rt>${esc(x.k)}</rt></ruby>` : esc(x.w);
}

function wordCardHtml(x) {
  return `<div class="wc">
    <span class="wc-e">${x.e}</span>
    <div class="wc-main">
      <div class="wc-jp jp">${esc(x.w)}${x.w !== x.k ? ` <span class="wc-k">${esc(x.k)}</span>` : ''}</div>
      ${state.settings.showRomaji ? `<div class="ro">${esc(x.ro)}</div>` : ''}
      <div class="wc-de">${esc(x.de)}</div>
      ${x.note ? `<div class="note">${esc(x.note)}</div>` : ''}
    </div>
    ${speakBtn(x.k)}
  </div>`;
}

function ctxHtml(c, w, blank = false) {
  const body = renderInline(c.src, { target: w, noGloss: true, jp: c.jp, blank: blank ? w : null });
  return `<div class="ctx">
    <div class="ctx-src${c.jp ? ' jp' : ''}">${body}</div>
    ${c.jp && c.de ? `<div class="ctx-de">${esc(c.de)}</div>` : ''}
    <div class="ctx-from">${c.emoji} ${esc(c.title)}</div>
  </div>`;
}

function wordRow(w) {
  const x = wordInfo(w);
  const st = wordStatus(w);
  return `<li class="word sword" data-w="${esc(w)}">
    <div class="w-jp"><span class="jp w">${x.e} ${esc(x.w)}</span>${x.w !== x.k ? `<span class="jp k">${esc(x.k)}</span>` : ''}</div>
    <div class="w-de">${esc(x.de)}${state.settings.showRomaji ? `<div class="ro">${esc(x.ro)}</div>` : ''}</div>
    <div class="w-side"><span class="st st-${st}">${STATUS_LABEL[st]}</span>${speakBtn(x.k)}</div>
  </li>`;
}

// Wort-Details als Blatt von unten
function openSheet(root, w) {
  const x = wordInfo(w);
  if (!x) return;
  const st = wordStatus(w);
  const cs = contexts(w).slice(0, 3);
  let el = $('.sheet-bg', root);
  if (!el) {
    el = document.createElement('div');
    el.className = 'sheet-bg';
    root.append(el);
    el.addEventListener('click', e => { if (e.target === el || e.target.closest('.sheet-x')) el.hidden = true; });
  }
  el.innerHTML = `<div class="sheet card" role="dialog" aria-label="${esc(x.de)}">
    <button class="sheet-x" aria-label="Schließen">✕</button>
    <div class="sh-e">${x.e}</div>
    <div class="sh-w jp">${bigWord(x)}</div>
    ${state.settings.showRomaji ? `<div class="ro big-ro">${esc(x.ro)}</div>` : ''}
    <div class="sh-de">${esc(x.de)}</div>
    ${speakBtn(x.k, 'big')}
    ${x.note ? `<div class="tip">💡 ${esc(x.note)}</div>` : ''}
    <div class="sh-st"><span class="st st-${st}">${STATUS_LABEL[st]}</span>${wordCard(w) ? ` <small class="muted">nächste Wiederholung ${dueLabel(wordCard(w).d)}</small>` : ''}</div>
    ${cs.length ? `<div class="sub-title">In deinen Geschichten</div>${cs.map(c => ctxHtml(c, w)).join('')}` : ''}
  </div>`;
  el.hidden = false;
  if (state.settings.autoSpeak) speak(x.k);
}

function dueLabel(d) {
  const n = d - today();
  if (n <= 0) return 'heute';
  if (n === 1) return 'morgen';
  if (n < 31) return `in ${n} Tagen`;
  return `in ${Math.round(n / 30)} Monaten`;
}

// ---------- Quiz (nach dem Lesen und in der Wiederholung) ----------
function pickMode(w) {
  const c = wordCard(w);
  if (!c || c.i < 1) return 'meaning';
  const modes = ['meaning', 'japanese'];
  if (canSpeak() && c.i >= 3) modes.push('audio');
  return modes[Math.floor(Math.random() * modes.length)];
}

function distractors(w, field) {
  const p = wordPool();
  const x = p.get(w);
  const known = new Set(knownWords());
  const cands = shuffle([...p.values()].filter(y => y.w !== w && y[field] !== x[field]))
    .sort((a, b) => known.has(b.w) - known.has(a.w));
  const out = [];
  for (const y of cands) {
    if (out.length >= 3) break;
    if (!out.some(o => o[field] === y[field])) out.push(y);
  }
  return out;
}

export function wordQuestion(w, story) {
  const cs = contexts(w);
  const ctx = cs.find(c => c.story === story) || cs[Math.floor(Math.random() * cs.length)];
  return { kind: 'word', w, mode: pickMode(w), ctx };
}

// questions: { kind: 'word', w, mode, ctx } | { kind: 'fact', q, a, x }
// cram: üben ohne Einfluss auf den Zeitplan
function runQuiz(host, questions, { onDone, cram = false }) {
  const queue = [...questions];
  const first = new Map(); // Wort -> beim ersten Versuch gewusst?
  let factsRight = 0, facts = 0, answered = 0;
  let cur = null, opts = [], done = false, hinted = false;

  host.innerHTML = `
    <div class="qz">
      <div class="qz-top">${bar(0)}<span class="qz-left"></span></div>
      <div class="qz-card card"></div>
    </div>
    <div class="answer-bar" hidden><button class="btn primary big qz-next">Weiter <small>Leertaste</small></button></div>`;
  const card = $('.qz-card', host), nextBar = $('.answer-bar', host), progressEl = $('.bar span', host), left = $('.qz-left', host);

  function show() {
    cur = queue.shift();
    if (!cur) { document.removeEventListener('keydown', onKey); return onDone({ first, facts, factsRight }); }
    done = false; hinted = false;
    nextBar.hidden = true;
    progressEl.style.width = `${Math.round(answered / (answered + queue.length + 1) * 100)}%`;
    left.textContent = `${queue.length + 1}`;

    let prompt = '';
    if (cur.kind === 'fact') {
      opts = shuffle([cur.a, ...cur.x]).map(t => ({ t, ok: t === cur.a }));
      prompt = `<div class="f-label">🧠 Wissensfrage</div><div class="q-fact">${esc(cur.q)}</div>`;
    } else {
      const x = wordInfo(cur.w);
      const reading = helpLevel(cur.w) !== 'plain';
      if (cur.mode === 'japanese') {
        opts = shuffle([x, ...distractors(cur.w, 'w')]).map(y => ({ html: `<span class="jp">${esc(y.w)}</span>${reading && y.w !== y.k ? `<small class="jp">${esc(y.k)}</small>` : ''}`, ok: y.w === x.w }));
        prompt = `<div class="f-label">Wie heißt das auf Japanisch?</div><div class="q-de">${x.e} ${esc(x.de)}</div>`;
      } else {
        opts = shuffle([x, ...distractors(cur.w, 'de')]).map(y => ({ t: y.de, ok: y.w === x.w }));
        prompt = cur.mode === 'audio'
          ? `<div class="f-label">👂 Was hörst du?</div>${speakBtn(x.k, 'big huge')}`
          : `<div class="f-label">Was bedeutet das?</div><div class="q-jp jp">${bigWord(x, reading)}</div>`;
      }
      if (cur.ctx) prompt += `<button class="btn small ghost q-hintbtn">💡 Satz aus der Geschichte</button><div class="q-hint" hidden>${ctxHtml(cur.ctx, cur.w, cur.mode !== 'meaning')}</div>`;
    }
    card.innerHTML = `${prompt}
      <div class="opts">${opts.map((o, i) => `<button class="opt" data-i="${i}"><small>${i + 1}</small>${o.html || esc(o.t)}</button>`).join('')}</div>
      <div class="q-fb"></div>`;
    if (cur.mode === 'audio') speak(wordInfo(cur.w).k);
  }

  function answer(i) {
    if (done || !opts[i]) return;
    done = true;
    answered++;
    const ok = opts[i].ok;
    card.querySelectorAll('.opt').forEach((b, j) => {
      b.disabled = true;
      if (opts[j].ok) b.classList.add('right');
      else if (j === i) b.classList.add('wrong');
    });
    const fb = $('.q-fb', card);
    if (cur.kind === 'fact') {
      facts++;
      if (ok) factsRight++;
      bump('x');
      fb.innerHTML = `<div class="fb-head ${ok ? 'ok' : 'bad'}">${ok ? '✓ Richtig!' : `✗ Richtig ist: ${esc(cur.a)}`}</div>`;
    } else {
      const x = wordInfo(cur.w);
      if (!first.has(cur.w)) first.set(cur.w, ok);
      if (cram) bump('x');
      else {
        state.srs[wordId(cur.w)] = schedule(wordId(cur.w), ok ? (hinted ? 2 : 3) : 1);
        bump('r');
      }
      if (!ok) queue.splice(Math.min(3, queue.length), 0, { ...cur, mode: 'meaning' });
      $('.q-hintbtn', card)?.remove();
      $('.q-hint', card)?.remove();
      fb.innerHTML = `<div class="fb-head ${ok ? 'ok' : 'bad'}">${ok ? '✓ Richtig!' : '✗ Nicht ganz – kommt gleich nochmal'}</div>
        ${wordCardHtml(x)}${cur.ctx ? ctxHtml(cur.ctx, cur.w) : ''}`;
      if (state.settings.autoSpeak) speak(x.k);
    }
    save();
    nextBar.hidden = false;
  }

  card.addEventListener('click', e => {
    if (e.target.closest('[data-speak]')) return;
    const o = e.target.closest('.opt');
    if (o) return answer(+o.dataset.i);
    if (e.target.closest('.q-hintbtn')) { hinted = true; $('.q-hint', card).hidden = false; e.target.closest('.q-hintbtn').remove(); }
  });
  $('.qz-next', host).onclick = show;
  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (/^[1-4]$/.test(e.key)) answer(+e.key - 1);
    else if ((e.key === ' ' || e.key === 'Enter') && done) { e.preventDefault(); show(); }
    else if (e.key === 'r' && cur?.kind === 'word') speak(wordInfo(cur.w).k);
  };
  document.addEventListener('keydown', onKey);
  show();
  return () => document.removeEventListener('keydown', onKey);
}

function chips(words) {
  return `<div class="wchips">${words.map(w => { const x = wordInfo(w); return `<button class="wchip" data-w="${esc(w)}">${x.e} <span class="jp">${esc(x.w)}</span> <small>${esc(x.de)}</small></button>`; }).join('')}</div>`;
}

// ---------- Startseite ----------
export function renderHome(root) {
  const [jp, sub] = greeting();
  const s = streak();
  const due = dueWords();
  const next = nextStory();
  const p = progress();
  const stories = allStories();

  root.innerHTML = `
    ${header('Kotoba')}
    <main class="page">
      <section class="hero">
        <div><div class="hello jp">${jp}</div><div class="muted">${sub}</div></div>
        <div class="streak ${s ? '' : 'zero'}" title="Tage in Folge gelernt"><span>🔥</span><b>${s}</b><small>${s === 1 ? 'Tag' : 'Tage'}</small></div>
      </section>

      ${next ? `
        <a class="card next-story" href="#/story/${next.id}">
          <div class="card-title">${p.stories ? 'Weiterlesen' : 'Deine erste Geschichte'}</div>
          <div class="ns-main"><span class="s-emoji">${next.emoji}</span><div><b>${esc(next.title)}</b><small>${esc(next.teaser || '')}</small></div></div>
          <div class="ns-meta"><span class="badge">${esc(next.topic)}</span>${newCount(next) ? `<span class="badge ok">+${newCount(next)} neue Wörter</span>` : ''}<span class="chev">›</span></div>
        </a>` : ''}

      <section class="card daily">
        <div class="card-title">Wiederholen</div>
        ${due.length
          ? `<a class="btn primary big" href="#/practice">🔁 ${due.length} ${due.length === 1 ? 'Wort' : 'Wörter'} wiederholen</a>`
          : `<div class="done">✨ ${p.n ? 'Gerade nichts fällig – lies eine Geschichte!' : 'Lies deine erste Geschichte – danach kommen die Wörter hierher.'}</div>`}
        <a class="btn wide" href="#/sentences">✍️ Satztest · auf Romaji schreiben</a>
      </section>

      <section class="card">
        <div class="card-title">Fortschritt</div>
        <div class="stats">
          <div><b>${p.n}</b><small>Wörter</small></div>
          <div><b>${p.mature}</b><small>gefestigt</small></div>
          <div><b>${p.stories}</b><small>Geschichten</small></div>
        </div>
        <div class="n5"><b>JLPT N5</b> ${bar(p.n5 / p.n5Total)}<small class="muted">${p.n5} / ${p.n5Total} N5-Wörter gelernt · ${p.stories} / ${p.storiesTotal} Geschichten gelesen</small></div>
        <div class="hm-wrap">${heatmap()}</div>
      </section>

      <div class="card-title lib-title">Bibliothek</div>
      <ul class="cats stories">${stories.map(st => `
        <li class="cat${isRead(st.id) ? ' read' : ''}">
          <a href="#/story/${st.id}" class="cat-main">
            <span class="cat-emoji">${st.emoji}</span>
            <span class="cat-info"><b>${st.n}. ${esc(st.title)}</b><small>${esc(st.topic)}${newCount(st) ? ` · ${newCount(st)} neue Wörter` : ''}</small></span>
            ${isRead(st.id) ? '<span class="read-mark">✓</span>' : ''}
          </a>
        </li>`).join('')}</ul>
    </main>`;

}

// ---------- Geschichte lesen ----------
export function renderStory(root, [id]) {
  const s = storyById(id);
  if (!s) return go('#/');
  const words = storyWords(s);
  const t = today();
  const fresh = words.filter(w => !wordCard(w));
  const due = words.filter(w => wordCard(w) && wordCard(w).d <= t);
  const looked = new Set();
  const seen = new Set();

  const blocks = parseStory(s.text).map(b => {
    if (b.t === 'p') return `<p>${renderInline(b.src, { seen })}</p>`;
    if (b.t === 'tip') return `<div class="tip grammar">💡 ${renderInline(b.src, { seen, noGloss: true })}</div>`;
    return `<div class="jp-block">${b.lines.map(l => {
      const kana = jpKana(l.jp);
      return `<div class="jpl">
        <div class="jpl-row"><span class="jpl-jp jp">${renderInline(l.jp, { seen, jp: true })}</span>${speakBtn(kana)}</div>
        <div class="jpl-de" hidden>${state.settings.showRomaji ? `<i>${esc(jpRomaji(l.jp))}</i>` : ''}${esc(l.de)}</div>
      </div>`;
    }).join('')}</div>`;
  }).join('');

  root.innerHTML = `
    ${header(esc(s.topic), '#/')}
    <main class="page reader">
      <article class="story card">
        <div class="s-head">
          <span class="s-emoji big">${s.emoji}</span>
          <div><small class="muted">Geschichte ${s.n} von ${allStories().length}${isRead(s.id) ? ' · ✓ gelesen' : ''}</small><h2>${esc(s.title)}</h2></div>
        </div>
        <div class="s-meta">${fresh.length ? `<span class="badge ok">${fresh.length} neue Wörter</span>` : ''}${due.length ? `<span class="badge warn">${due.length} zum Wiederholen</span>` : ''}<span class="muted small-note">Tippe auf japanische Wörter</span></div>
        <div class="s-body">${blocks}</div>
      </article>

      <section class="card">
        <div class="card-title">📚 Wörter in dieser Geschichte</div>
        <ul class="words">${words.map(wordRow).join('')}</ul>
      </section>

      <button class="btn primary big" id="done">Fertig gelesen → Mini-Quiz</button>
    </main>`;

  root.addEventListener('click', e => {
    if (e.target.closest('[data-speak]')) return;
    const w = e.target.closest('[data-w]');
    if (w) { looked.add(w.dataset.w); return openSheet(root, w.dataset.w); }
    const line = e.target.closest('.jpl');
    if (line) $('.jpl-de', line).hidden = !$('.jpl-de', line).hidden;
  });


  let stopQuiz = null;
  $('#done', root).onclick = () => {
    // Alle neuen Wörter aufnehmen, damit keines nach dem Lesen verloren geht.
    const testWords = [...fresh, ...due.slice(0, Math.max(0, 8 - fresh.length))];
    const questions = [...testWords.map(w => wordQuestion(w, s.id)), ...(s.quiz || []).map(q => ({ kind: 'fact', ...q }))];
    document.body.classList.add('focus');
    window.scrollTo(0, 0);
    const main = $('main', root);
    main.className = 'page review';
    if (!questions.length) return finish({ first: new Map(), facts: 0, factsRight: 0 });
    stopQuiz = runQuiz(main, questions, { onDone: finish });
  };

  function finish({ first, facts, factsRight }) {
    markRead(s.id);
    // Beim Lesen nachgeschaut → das Wort sitzt noch nicht, also bald wiederholen
    const relook = [...looked].filter(w => wordCard(w)?.i >= 1 && !first.has(w));
    for (const w of relook) state.srs[wordId(w)] = { ...wordCard(w), d: Math.min(wordCard(w).d, today()), u: Date.now() };
    save();
    const right = [...first.values()].filter(Boolean).length + factsRight;
    const total = first.size + facts;
    const next = nextStory();
    const dueN = dueWords().length;
    const main = $('main', root);
    main.innerHTML = `
      <div class="card result">
        <div class="big-emoji">🎉</div>
        <h2>お疲れ様でした！</h2>
        ${total ? `<p class="muted">${right} von ${total} beim ersten Mal richtig</p>` : ''}
        ${fresh.length ? `<div class="sub-title">Neu in deinem Wortschatz</div>${chips(fresh)}` : ''}
        ${relook.length ? `<p class="muted small-note">${relook.length} nachgeschaute ${relook.length === 1 ? 'Wort kommt' : 'Wörter kommen'} heute in die Wiederholung.</p>` : ''}
        <div class="row-btns col">
          ${next ? `<a class="btn primary" href="#/story/${next.id}">Weiter: ${next.emoji} ${esc(next.title)}</a>` : ''}
          ${dueN ? `<a class="btn" href="#/practice">🔁 ${dueN} ${dueN === 1 ? 'Wort' : 'Wörter'} wiederholen</a>` : ''}
          <a class="btn" href="#/">Zur Übersicht</a>
        </div>
      </div>`;
  }

  const onKey = e => { if (e.key === 'Escape') { const sh = $('.sheet-bg', root); if (sh) sh.hidden = true; } };
  document.addEventListener('keydown', onKey);
  return () => { document.removeEventListener('keydown', onKey); stopQuiz?.(); };
}

// ---------- Wiederholen ----------
export function renderPractice(root, _, q) {
  const cram = !!q.free;
  const pool = cram ? shuffle(knownWords()).slice(0, 15) : dueWords().slice(0, 80);
  root.innerHTML = `
    <header class="top session">
      <a class="back" href="#/" aria-label="Beenden">✕</a>
      <h1>${cram ? 'Freies Üben' : 'Wörter wiederholen'}</h1>
      <span></span>
    </header>
    <main class="page review"></main>`;
  const main = $('main', root);
  root.addEventListener('click', e => {
    const w = e.target.closest('.wchip');
    if (w) openSheet(root, w.dataset.w);
  });

  if (!pool.length) {
    const known = knownWords().length;
    main.innerHTML = `<div class="card result">
      <div class="big-emoji">🍵</div>
      <h2>Gerade nichts fällig</h2>
      <p class="muted">${known ? 'Alle Wörter sind für heute erledigt.' : 'Lies zuerst eine Geschichte – danach landen ihre Wörter hier.'}</p>
      <div class="row-btns col">
        ${known >= 4 ? '<a class="btn" href="#/practice?free=1">Trotzdem üben (ohne Wertung)</a>' : ''}
        <a class="btn primary" href="#/">Zur Übersicht</a>
      </div></div>`;
    return;
  }

  return runQuiz(main, pool.map(w => wordQuestion(w)), {
    cram,
    onDone({ first }) {
      const right = [...first.values()].filter(Boolean).length;
      const wrong = [...first.entries()].filter(([, ok]) => !ok).map(([w]) => w);
      const t = today();
      const tomorrow = knownWords().filter(w => wordCard(w).d === t + 1).length;
      const next = nextStory();
      main.innerHTML = `
        <div class="card result">
          <div class="big-emoji">🎉</div>
          <h2>お疲れ様でした！</h2>
          <p class="muted">${first.size} Wörter · ${right} beim ersten Mal gewusst</p>
          ${!cram ? `<p class="muted">Morgen fällig: <b>${tomorrow}</b></p>` : ''}
          ${wrong.length ? `<div class="sub-title">Noch wackelig</div>${chips(wrong)}` : ''}
          <div class="row-btns col">
            ${next ? `<a class="btn primary" href="#/story/${next.id}">Weiterlesen: ${next.emoji} ${esc(next.title)}</a>` : ''}
            <a class="btn" href="#/">Fertig</a>
          </div>
        </div>`;
    },
  });
}

// ---------- Wörterliste ----------
export function renderWords(root) {
  const known = knownWords();
  const order = { learning: 0, young: 1, mature: 2 };
  const list = [...known].sort((a, b) => order[wordStatus(a)] - order[wordStatus(b)]);
  const due = dueWords().length;
  const waiting = wordPool().size - known.length;
  const p = progress();

  root.innerHTML = `
    ${header('Wörter')}
    <main class="page">
      <section class="card daily">
        <div class="stats">
          <div><b>${p.n}</b><small>gelernt</small></div>
          <div><b>${p.mature}</b><small>gefestigt</small></div>
          <div><b>${due}</b><small>fällig</small></div>
        </div>
        <div class="row-btns">
          <a class="btn primary" href="#/practice" ${due ? '' : 'aria-disabled="true"'}>🔁 Wiederholen</a>
          <a class="btn" href="#/practice?free=1" ${known.length >= 4 ? '' : 'aria-disabled="true"'}>Frei üben</a>
        </div>
      </section>
      <p class="muted small-note legend">
        <span class="st st-learning">Lernen</span> mit Übersetzung im Text ·
        <span class="st st-young">Gelernt</span> nur Lesung ·
        <span class="st st-mature">Sitzt</span> nur noch Japanisch
      </p>
      <a class="card quiz-entry" href="#/sentences">
        <span class="cat-emoji">✍️</span>
        <span class="cat-info"><b>Satztest</b><small>Sätze übersetzen oder selbst bilden – Antworten auf Romaji</small></span>
        <span class="chev">›</span>
      </a>
      <input class="search" id="search" type="search" placeholder="Suchen: 海, umi, Meer …" autocomplete="off" autocapitalize="off">
      ${list.length ? `<ul class="words" id="list">${list.map(wordRow).join('')}</ul>` : '<p class="muted center">Noch keine Wörter – lies deine erste Geschichte!</p>'}
      ${waiting ? `<p class="muted center small-note">📖 ${waiting} weitere Wörter im Wortschatz.</p>` : ''}
    </main>`;

  root.addEventListener('click', e => {
    if (e.target.closest('[data-speak]')) return;
    const w = e.target.closest('[data-w]');
    if (w) openSheet(root, w.dataset.w);
  });
  const search = $('#search', root), ul = $('#list', root);
  search.addEventListener('input', () => {
    const s = search.value.trim().toLowerCase();
    if (!ul) return;
    for (const li of ul.children) {
      const x = wordInfo(li.dataset.w);
      li.hidden = !!s && ![x.w, x.k, x.ro, x.de].some(f => f.toLowerCase().includes(s));
    }
  });
}
