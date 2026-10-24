import { state, local, save, bump, today, dayKey } from '../store.js';
import { buildSession, buildCram, newCards, schedule, GRADES, fmtInterval } from '../srs.js';
import { phraseItems, vocabItems, KIND_LABEL } from '../cards.js';
import { VOCAB } from '../../data/vocab.js';
import { SITUATIONS } from '../../data/phrases.js';
import { speak } from '../speech.js';
import { hasKanji } from '../romaji.js';
import { esc, $, go, speakBtn } from '../ui.js';

const NEW_FIELD = { vocab: 'nv', custom: 'nv', kanji: 'nk', phrase: 'np' };

function front(card) {
  const { item, dir } = card;
  if (item.kind === 'kanji') {
    return `<div class="f-label">Kanji – Bedeutung?</div><div class="f-main jp kanji-front">${item.w}</div>`;
  }
  if (dir === 'dj') {
    return `<div class="f-label">${item.kind === 'phrase' ? 'Wie sagst du auf Japanisch?' : 'Auf Japanisch?'}</div>
      <div class="f-main de">${esc(item.de)}</div>`;
  }
  const hint = item.kind !== 'phrase' && hasKanji(item.w)
    ? `<button class="btn small ghost" id="hint">Lesung zeigen</button><div class="hint jp" id="hintText" hidden>${esc(item.k)}</div>` : '';
  return `<div class="f-label">${item.kind === 'phrase' ? '👂 Was bedeutet das?' : 'Bedeutung?'}</div>
    <div class="f-main jp ${item.w.length > 6 ? 'long' : ''}">${esc(item.w)}</div>
    ${item.kind === 'phrase' ? speakBtn(item.k, 'big') : ''}${hint}`;
}

function back(card) {
  const { item, dir } = card;
  const ro = state.settings.showRomaji ? `<div class="b-ro">${esc(item.ro)}</div>` : '';
  const note = item.note ? `<div class="note">${esc(item.note)}</div>` : '';
  if (item.kind === 'kanji') {
    return `<div class="b-de">${esc(item.de)}</div>
      <div class="readings big">
        <div><small>On</small> <span class="jp">${item.on}</span>${state.settings.showRomaji ? ` <i>${item.onRo}</i>` : ''}</div>
        <div><small>Kun</small> <span class="jp">${item.kun}</span>${state.settings.showRomaji && item.kunRo ? ` <i>${item.kunRo}</i>` : ''}</div>
      </div>
      <div class="example"><span class="jp">${item.ex}</span> <span class="jp muted">${item.exk}</span> ${speakBtn(item.exk)}<br>${state.settings.showRomaji ? `<i>${item.exRo}</i> – ` : ''}${esc(item.exde)}</div>`;
  }
  if (dir === 'dj') {
    return `<div class="b-jp jp">${esc(item.w)} ${speakBtn(item.k)}</div>
      ${item.k !== item.w ? `<div class="b-kana jp">${esc(item.k)}</div>` : ''}${ro}${note}`;
  }
  return `${item.k !== item.w ? `<div class="b-kana jp">${esc(item.k)} ${speakBtn(item.k)}</div>` : `<div>${speakBtn(item.k)}</div>`}
    ${ro}<div class="b-de">${esc(item.de)}</div>${note}`;
}

function session(root, queue, { cram = false, title = '', exit = '#/', kinds = [] } = {}) {
  const startSize = queue.length;
  let cur = null, revealed = false;
  let reviewed = 0, again = 0;
  const undo = [];

  root.innerHTML = `
    <header class="top session">
      <a class="back" href="${exit}" aria-label="Beenden">✕</a>
      <h1>${esc(title)}</h1>
      <span class="counts" id="counts"></span>
    </header>
    <main class="page review">
      <div class="rcard card" id="card">
        <div class="kind" id="kind"></div>
        <div class="front" id="front"></div>
        <div class="rback" id="back" hidden></div>
      </div>
      <div class="answer-bar" id="bar"></div>
    </main>`;

  const el = { card: $('#card', root), front: $('#front', root), back: $('#back', root), bar: $('#bar', root), counts: $('#counts', root), kind: $('#kind', root) };

  function updateCounts() {
    const all = cur ? [cur, ...queue] : queue;
    if (cram) { el.counts.innerHTML = `<span>${all.length}</span>`; return; }
    let n = 0, l = 0, r = 0;
    for (const c of all) { const s = state.srs[c.id]; if (!s) n++; else if (s.i < 1) l++; else r++; }
    el.counts.innerHTML = `<span class="c-new" title="Neu">${n}</span><span class="c-learn" title="Nochmal">${l}</span><span class="c-rev" title="Wiederholung">${r}</span>`;
  }

  function show() {
    cur = queue.shift();
    revealed = false;
    if (!cur) return finish();
    const isNew = !cram && !state.srs[cur.id];
    el.kind.innerHTML = `${KIND_LABEL[cur.item.kind]}${isNew ? ' · <b class="new-tag">neu</b>' : ''}${undo.length ? ' <button class="undo" id="undo" title="Rückgängig (Z)">↶</button>' : ''}`;
    el.front.innerHTML = front(cur);
    el.back.hidden = true;
    el.back.innerHTML = '';
    el.card.classList.remove('revealed');
    el.bar.innerHTML = '<button class="btn primary big" id="reveal">Antwort zeigen <small>Leertaste</small></button>';
    $('#reveal', root).onclick = reveal;
    const hint = $('#hint', root);
    if (hint) hint.onclick = e => { e.stopPropagation(); $('#hintText', root).hidden = false; hint.remove(); };
    const u = $('#undo', root);
    if (u) u.onclick = e => { e.stopPropagation(); doUndo(); };
    if (cur.item.kind === 'phrase' && cur.dir === 'jd' && state.settings.autoSpeak) speak(cur.item.k);
    updateCounts();
  }

  function reveal() {
    if (revealed || !cur) return;
    revealed = true;
    el.back.innerHTML = back(cur);
    el.back.hidden = false;
    el.card.classList.add('revealed');
    if (state.settings.autoSpeak) speak(cur.item.kind === 'kanji' ? cur.item.exk : cur.item.k);
    if (cram) {
      el.bar.innerHTML = `<div class="grades two">
        <button class="grade again" data-g="1"><b>Nochmal</b><small>1</small></button>
        <button class="grade good" data-g="3"><b>Gewusst</b><small>3</small></button></div>`;
    } else {
      el.bar.innerHTML = `<div class="grades">${GRADES.map(g => `<button class="grade ${g.cls}" data-g="${g.g}"><b>${g.label}</b><small>${fmtInterval(schedule(cur.id, g.g).i)}</small></button>`).join('')}</div>`;
    }
  }

  function grade(g) {
    if (!revealed || !cur) return;
    const k = dayKey();
    undo.push({
      cur, queue: [...queue], prev: state.srs[cur.id] ? { ...state.srs[cur.id] } : undefined,
      daily: state.daily[k]?.[local.deviceId] ? { ...state.daily[k][local.deviceId] } : undefined, reviewed, again,
    });
    if (undo.length > 20) undo.shift();
    reviewed++;
    if (g === 1) again++;
    if (cram) {
      bump('x');
    } else {
      const wasNew = !state.srs[cur.id];
      state.srs[cur.id] = schedule(cur.id, g);
      bump('r');
      if (wasNew) bump(NEW_FIELD[cur.item.kind]);
    }
    if (g === 1) queue.splice(Math.min(3, queue.length), 0, cur);
    save();
    show();
  }

  function doUndo() {
    const u = undo.pop();
    if (!u) return;
    const k = dayKey();
    if (!cram) {
      if (u.prev) state.srs[u.cur.id] = { ...u.prev, u: Date.now() };
      else delete state.srs[u.cur.id];
    }
    if (u.daily) state.daily[k][local.deviceId] = u.daily;
    else if (state.daily[k]) delete state.daily[k][local.deviceId];
    queue.length = 0;
    queue.push(u.cur, ...u.queue);
    reviewed = u.reviewed; again = u.again;
    save();
    show();
  }

  el.bar.addEventListener('click', e => { const b = e.target.closest('[data-g]'); if (b) grade(+b.dataset.g); });
  el.card.addEventListener('click', e => { if (!e.target.closest('button')) reveal(); });

  const onKey = e => {
    if (e.metaKey || e.ctrlKey || e.altKey) { if ((e.metaKey || e.ctrlKey) && e.key === 'z') { e.preventDefault(); doUndo(); } return; }
    if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); revealed ? grade(3) : reveal(); }
    else if (/^[1-4]$/.test(e.key) && revealed) { const g = +e.key; if (!cram || g === 1 || g === 3) grade(g); }
    else if (e.key === 'z') doUndo();
    else if (e.key === 'r' && cur) speak(cur.item.kind === 'kanji' ? cur.item.exk : cur.item.k);
  };
  document.addEventListener('keydown', onKey);

  function finish() {
    const t = today();
    const tomorrow = Object.entries(state.srs).filter(([, s]) => s.d === t + 1).length;
    const moreNew = !cram && kinds.length ? newCards(kinds, { ignoreLimit: true }).length : 0;
    el.counts.innerHTML = '';
    root.querySelector('.review').innerHTML = `
      <div class="card result">
        <div class="big-emoji">${reviewed ? '🎉' : '🍵'}</div>
        <h2>${reviewed ? 'お疲れ様でした！' : 'Gerade nichts fällig'}</h2>
        <p class="muted">${reviewed ? `${reviewed} Antworten · ${reviewed - again} beim ersten Mal gewusst` : 'Alle Wiederholungen für heute erledigt.'}</p>
        ${!cram ? `<p class="muted">Morgen fällig: <b>${tomorrow}</b> Karten</p>` : ''}
        <div class="row-btns col">
          ${moreNew ? `<a class="btn" href="#/review/${kinds.join(',')}?extra=1">+ 5 weitere neue Karten</a>` : ''}
          ${cram && startSize ? '<button class="btn" id="redo">Nochmal üben</button>' : ''}
          <a class="btn primary" href="${exit}">Fertig</a>
        </div>
      </div>`;
    const r = $('#redo', root);
    if (r) r.onclick = () => go(location.hash);
  }

  show();
  return () => document.removeEventListener('keydown', onKey);
}

const TITLES = { 'vocab,custom': 'Vokabeln', kanji: 'Kanji', phrase: 'Phrasen' };

export function renderReview(root, [kindsStr], q) {
  const kinds = kindsStr.split(',').filter(k => NEW_FIELD[k]);
  const queue = q.extra ? newCards(kinds, { ignoreLimit: true }).slice(0, 5) : buildSession(kinds);
  const exit = kinds.length === 1 && kinds[0] === 'phrase' ? '#/phrases' : kinds.includes('vocab') && !kinds.includes('phrase') || kinds[0] === 'kanji' && kinds.length === 1 ? '#/vocab' : '#/';
  return session(root, queue, { title: TITLES[kinds.join(',')] || 'Tägliche Wiederholung', exit, kinds });
}

export function renderCram(root, [type, id]) {
  if (type === 'phrase') {
    const sit = SITUATIONS.find(s => s.id === id);
    return session(root, buildCram(phraseItems().filter(i => i.cat === id)), { cram: true, title: `Üben: ${sit?.title || ''}`, exit: `#/phrases/${id}` });
  }
  const cat = VOCAB.find(c => c.id === id);
  return session(root, buildCram(vocabItems().filter(i => i.cat === id)), { cram: true, title: `Üben: ${cat?.title || ''}`, exit: `#/vocab/cat/${id}` });
}
