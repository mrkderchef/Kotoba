import { state, local, saveLocal, save, section, updateSection, kanaRecord, kanaStats, bump } from '../store.js';
import { KANA, SCRIPT_NAMES, ROW_BY_ID, KANA_BY_CHAR, answers, CONFUSABLES } from '../../data/kana.js';
import { speak } from '../speech.js';
import { header, esc, $, $$, go, shuffle, bar, speakBtn } from '../ui.js';

const MODES = { type: 'Tippen', choice: 'Auswahl', reverse: 'Umgekehrt' };

function rowStatus(id) {
  const s = section(id);
  if (s.passed) return `<span class="badge ok" title="Bestanden">★ ${s.best}%</span>`;
  if (s.best) return `<span class="badge warn" title="Bester Versuch">${s.best}%</span>`;
  if (s.learned) return '<span class="badge" title="Angeschaut">✓ gelernt</span>';
  return '';
}

// ---------------- Übersicht ----------------
export function renderOverview(root, [script = 'h']) {
  const groups = KANA[script];
  const allRows = groups.flatMap(g => g.rows);
  const allSid = `${script}-all`;
  root.innerHTML = `
    ${header('Kana')}
    <main class="page">
      <div class="seg">
        ${Object.entries(SCRIPT_NAMES).map(([k, n]) => `<a href="#/kana/${k}" class="${k === script ? 'on' : ''}"><span class="jp">${k === 'h' ? 'あ' : 'ア'}</span> ${n}</a>`).join('')}
      </div>
      <p class="muted intro-text">Pro Abschnitt: erst <b>Lernen</b> (Eselsbrücken anschauen), dann <b>Test</b>. Ab 90 % gilt ein Abschnitt als bestanden ★. Danach die ganze Gruppe und am Ende alles zusammen testen.</p>
      ${groups.map(g => {
        const passed = g.rows.filter(r => section(r.id).passed).length;
        return `
        <section class="card group">
          <div class="group-head">
            <div class="card-title">${esc(g.title)}</div>
            <small class="muted">${passed}/${g.rows.length} ★</small>
          </div>
          ${g.intro ? `<details class="intro"><summary>💡 ${esc(g.intro.title)} – so funktioniert’s</summary><div class="intro-body">${g.intro.html}</div></details>` : ''}
          <ul class="rows">
            ${g.rows.map(r => `
              <li>
                <a class="row-main" href="#/kana/learn/${r.id}">
                  <span class="row-kana jp">${r.kana.map(k => k.c).join(' ')}</span>
                  <span class="row-label">${esc(r.label)} ${rowStatus(r.id)}</span>
                </a>
                <div class="row-act">
                  <a class="btn small ghost" href="#/kana/learn/${r.id}">Lernen</a>
                  <a class="btn small" href="#/kana/test?rows=${r.id}&rep=2&sid=${r.id}&title=${encodeURIComponent(r.label)}">Test</a>
                </div>
              </li>`).join('')}
          </ul>
          <a class="btn wide" href="#/kana/test?rows=${g.rows.map(r => r.id).join(',')}&sid=${g.id}&title=${encodeURIComponent(g.title)}">Ganze Gruppe testen ${section(g.id).best ? `<small>(Bestwert ${section(g.id).best}%)</small>` : ''}</a>
        </section>`;
      }).join('')}
      <section class="card">
        <div class="card-title">Gesamttest</div>
        <p class="muted">Alle ${SCRIPT_NAMES[script]} durcheinander – der Endgegner.</p>
        <div class="row-btns">
          <a class="btn primary" href="#/kana/test?rows=${allRows.map(r => r.id).join(',')}&sid=${allSid}&title=${encodeURIComponent('Alle ' + SCRIPT_NAMES[script])}">Alle ${SCRIPT_NAMES[script]} ${section(allSid).best ? `(${section(allSid).best}%)` : ''}</a>
          <a class="btn" href="#/kana/test?rows=${[...KANA.h, ...KANA.k].flatMap(g => g.rows).map(r => r.id).join(',')}&sid=hk-all&title=${encodeURIComponent('Hiragana + Katakana')}">あ + ア gemischt</a>
          <a class="btn ghost" href="#/kana/custom">Eigener Test …</a>
        </div>
      </section>
      <section class="card">
        <div class="card-title">Verwechslungsgefahr</div>
        <ul class="confuse">
          ${CONFUSABLES.map(([a, b, t]) => `<li><span class="jp pair">${a} ${b}</span><span>${esc(t)}</span></li>`).join('')}
        </ul>
      </section>
    </main>`;
}

// ---------------- Lernen ----------------
export function renderLearn(root, [rowId]) {
  const row = ROW_BY_ID[rowId];
  if (!row) return go('#/kana');
  const group = KANA[row.script].find(g => g.rows.includes(row));
  const rowsFlat = KANA[row.script].flatMap(g => g.rows);
  const nextRow = rowsFlat[rowsFlat.indexOf(row) + 1];
  const slides = [];
  if (group.intro && group.rows[0] === row) slides.push({ intro: group.intro });
  row.kana.forEach(k => slides.push({ k }));
  slides.push({ end: true });
  let i = 0;

  root.innerHTML = `
    <header class="top session">
      <a class="back" href="#/kana/${row.script}" aria-label="Schließen">✕</a>
      <h1>${SCRIPT_NAMES[row.script]} · ${esc(row.label)}</h1>
      <span></span>
    </header>
    <main class="page learn">
      <div class="dots">${slides.map((_, j) => `<i data-j="${j}"></i>`).join('')}</div>
      <div class="slide card" id="slide"></div>
      <div class="learn-nav">
        <button class="btn ghost" id="prev">‹ Zurück</button>
        <button class="btn primary" id="next">Weiter ›</button>
      </div>
    </main>`;

  const el = $('#slide', root);
  const font = state.settings.kanaFont;

  function show() {
    const s = slides[i];
    $$('.dots i', root).forEach((d, j) => d.classList.toggle('on', j <= i));
    $('#prev', root).disabled = i === 0;
    $('#next', root).style.visibility = s.end ? 'hidden' : '';
    if (s.intro) {
      el.innerHTML = `<div class="intro-slide"><div class="card-title">💡 ${esc(s.intro.title)}</div>${s.intro.html}</div>`;
    } else if (s.k) {
      const k = s.k;
      el.innerHTML = `
        <div class="kana-big jp f-${font}">${k.c}</div>
        <div class="kana-romaji">${k.r} ${speakBtn(k.c)}</div>
        <div class="mnemonic"><span class="emoji">${k.e}</span><p>${k.m}</p></div>
        <div class="fonts">
          <span><b class="jp f-sans">${k.c}</b><small>Gothic</small></span>
          <span><b class="jp f-serif">${k.c}</b><small>Mincho</small></span>
          <span><b class="jp f-hand">${k.c}</b><small>Handschrift</small></span>
          ${k.hira ? `<span><b class="jp">${k.hira}</b><small>Hiragana</small></span>` : ''}
        </div>`;
      if (state.settings.autoSpeak) speak(k.c);
    } else {
      updateSection(row.id, { learned: true });
      save();
      el.innerHTML = `
        <div class="end-slide">
          <div class="big-emoji">🎯</div>
          <h2>Angeschaut!</h2>
          <p class="jp recap">${row.kana.map(k => `<span>${k.c}<small>${k.r}</small></span>`).join('')}</p>
          <p class="muted">Jetzt testen, solange es frisch ist.</p>
          <a class="btn primary big" href="#/kana/test?rows=${row.id}&rep=2&sid=${row.id}&title=${encodeURIComponent(row.label)}">Abschnitt testen</a>
          <button class="btn ghost" id="again">Nochmal ansehen</button>
          ${nextRow ? `<a class="btn ghost" href="#/kana/learn/${nextRow.id}">Nächster Abschnitt: ${esc(nextRow.label)} ›</a>` : ''}
        </div>`;
      $('#again', el).onclick = () => { i = 0; show(); };
    }
  }
  const prev = () => { if (i > 0) { i--; show(); } };
  const next = () => { if (i < slides.length - 1) { i++; show(); } };
  $('#prev', root).onclick = prev;
  $('#next', root).onclick = next;

  const onKey = e => { if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); next(); } if (e.key === 'ArrowLeft') prev(); };
  document.addEventListener('keydown', onKey);
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    x0 = null;
  });
  show();
  return () => document.removeEventListener('keydown', onKey);
}

// ---------------- Test ----------------
function pickItems(q) {
  let items = [];
  if (q.chars) items = q.chars.split(',').map(c => KANA_BY_CHAR[c]).filter(Boolean);
  else if (q.rows) items = q.rows.split(',').flatMap(id => (ROW_BY_ID[id]?.kana || []).map(k => ({ ...k, row: id, script: ROW_BY_ID[id].script })));
  return items;
}

function noAdjacentDupes(list) {
  for (let i = 1; i < list.length; i++) {
    if (list[i].c === list[i - 1].c) {
      const j = list.findIndex((x, idx) => idx > i && x.c !== list[i].c);
      if (j > 0) [list[i], list[j]] = [list[j], list[i]];
    }
  }
  return list;
}

function distractors(item, pool, field) {
  const conf = CONFUSABLES.flatMap(([a, b]) => (a === item.c ? [b] : b === item.c ? [a] : []));
  const sameScript = pool.filter(p => p.script === item.script && p.r !== item.r);
  const preferred = sameScript.filter(p => conf.includes(p.c) || p.row === item.row);
  const chosen = [];
  for (const p of [...shuffle(preferred), ...shuffle(sameScript)]) {
    if (chosen.length >= 3) break;
    if (!chosen.some(c => c[field] === p[field] || c.r === p.r)) chosen.push(p);
  }
  return shuffle([item, ...chosen]);
}

export function renderTest(root, _, q) {
  const base = pickItems(q);
  if (!base.length) return go('#/kana');
  const pool = Object.entries(KANA_BY_CHAR).map(([c, k]) => ({ ...k, c }));
  const mode = MODES[q.mode] ? q.mode : (local.quizMode || 'type');
  const rep = Math.max(1, Math.min(3, +q.rep || 1));
  let list = noAdjacentDupes(shuffle(Array.from({ length: rep }, () => base).flat()));
  if (q.n) list = list.slice(0, +q.n);
  const total = list.length;
  const title = q.title || 'Kana-Test';
  const queue = [...list];
  const results = []; // erste Antwort je Frage
  const retried = new Set();
  let cur = null, locked = false, done = 0;

  const modeLinks = Object.entries(MODES).map(([m, n]) => {
    const p = new URLSearchParams({ ...q, mode: m });
    return `<a href="#/kana/test?${p}" class="${m === mode ? 'on' : ''}">${n}</a>`;
  }).join('');

  root.innerHTML = `
    <header class="top session">
      <a class="back" href="#/kana/${base[0].script}" aria-label="Beenden">✕</a>
      <h1>${esc(title)}</h1>
      <span class="score" id="score"></span>
    </header>
    <main class="page quiz">
      <div class="seg small">${modeLinks}</div>
      ${bar(0, 'quiz-bar')}
      <div class="q card" id="q">
        <div class="q-prompt jp" id="prompt"></div>
        <div class="q-feedback" id="fb"></div>
        ${mode === 'type' ? `<input id="answer" class="answer" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" enterkeyhint="go" placeholder="Romaji tippen …" aria-label="Antwort">`
          : '<div class="choices" id="choices"></div>'}
        <button class="btn primary" id="cont" hidden>Weiter ↵</button>
      </div>
      <p class="muted center hint">${mode === 'type' ? 'Richtig = geht automatisch weiter · Enter = prüfen' : 'Tasten 1–4 funktionieren auch'}</p>
    </main>`;

  const prompt = $('#prompt', root), fb = $('#fb', root), input = $('#answer', root), choices = $('#choices', root), cont = $('#cont', root);
  const qEl = $('#q', root);

  function updateTop() {
    const right = results.filter(r => r.ok).length;
    $('#score', root).innerHTML = `<span class="ok">✓ ${right}</span> <span class="bad">✗ ${results.length - right}</span>`;
    $('.quiz-bar span', root).style.width = `${(done / (total + retried.size)) * 100}%`;
  }

  function nextQ() {
    locked = false;
    qEl.classList.remove('right', 'wrong');
    fb.innerHTML = '';
    cont.hidden = true;
    cur = queue.shift();
    if (!cur) return finish();
    const isRetry = cur._retry;
    if (mode === 'reverse') {
      prompt.innerHTML = `<span class="ro-prompt">${cur.r}</span>`;
      prompt.classList.remove('jp');
    } else {
      prompt.innerHTML = `<span class="f-${state.settings.kanaFont}">${cur.c}</span>`;
    }
    if (isRetry) fb.innerHTML = '<small class="muted">Wiederholung</small>';
    if (input) { input.value = ''; input.disabled = false; input.focus(); }
    if (choices) {
      const opts = distractors(cur, pool, mode === 'reverse' ? 'c' : 'r');
      choices.innerHTML = opts.map((o, i) => `<button class="choice ${mode === 'reverse' ? 'jp' : ''}" data-r="${esc(o.r)}"><small>${i + 1}</small>${mode === 'reverse' ? o.c : o.r}</button>`).join('');
    }
    updateTop();
  }

  function answer(given) {
    if (locked) return;
    locked = true;
    const ok = answers(cur).includes(given);
    if (!cur._retry) {
      results.push({ item: cur, ok, given });
      kanaRecord(cur.c, ok);
      bump('k');
    }
    done++;
    if (!ok && !cur._retry && !retried.has(cur.c)) { retried.add(cur.c); queue.push({ ...cur, _retry: true }); }
    qEl.classList.add(ok ? 'right' : 'wrong');
    if (choices) $$('.choice', choices).forEach(b => {
      if (answers(cur).includes(b.dataset.r)) b.classList.add('right');
      else if (b.dataset.r === given) b.classList.add('wrong');
    });
    if (input) input.disabled = !ok;
    if (ok) {
      if (state.settings.autoSpeak && mode !== 'type') speak(cur.c);
      setTimeout(nextQ, mode === 'type' ? 350 : 600);
    } else {
      speak(cur.c);
      fb.innerHTML = `<div class="solution"><b class="jp">${cur.c}</b> = <b>${cur.r}</b>${given ? ` <span class="muted">(nicht „${esc(given)}“)</span>` : ''}</div>
        <div class="mnemonic small"><span class="emoji">${cur.e}</span><p>${cur.m}</p></div>`;
      cont.hidden = false;
      cont.focus();
    }
    updateTop();
  }

  if (input) {
    input.addEventListener('input', () => {
      const v = input.value.trim().toLowerCase();
      if (!locked && answers(cur).includes(v)) answer(v);
    });
    input.addEventListener('keydown', e => {
      if (e.key !== 'Enter') return;
      e.preventDefault();
      e.stopPropagation(); // sonst springt dieselbe Enter-Taste gleich zur nächsten Frage
      const v = input.value.trim().toLowerCase();
      if (v && !locked) answer(v);
    });
  }
  if (choices) choices.addEventListener('click', e => { const b = e.target.closest('.choice'); if (b) answer(b.dataset.r); });
  cont.onclick = () => { if (locked) nextQ(); };
  const onKey = e => {
    if (e.key === 'Enter' && locked && !cont.hidden) { e.preventDefault(); e.stopPropagation(); nextQ(); return; }
    if (choices && !locked && /^[1-4]$/.test(e.key)) $$('.choice', choices)[+e.key - 1]?.click();
  };
  document.addEventListener('keydown', onKey);

  function finish() {
    locked = true;
    const right = results.filter(r => r.ok).length;
    const pct = Math.round((right / results.length) * 100);
    // Abschnitte aktualisieren: Test-ID + jede Reihe einzeln
    if (q.sid) updateSection(q.sid, { best: pct, passed: pct >= 90 });
    // Eine Reihe zählt nur, wenn alle ihre Zeichen im Test vorkamen
    const byRow = {};
    for (const r of results) (byRow[r.item.row] ||= []).push(r);
    for (const [rowId, rs] of Object.entries(byRow)) {
      const covered = new Set(rs.map(r => r.item.c)).size === ROW_BY_ID[rowId]?.kana.length;
      const p = Math.round((rs.filter(r => r.ok).length / rs.length) * 100);
      if (covered) updateSection(rowId, { best: p, passed: p >= 90 });
    }
    save();
    const missed = [...new Map(results.filter(r => !r.ok).map(r => [r.item.c, r.item])).values()];
    const row = q.sid && ROW_BY_ID[q.sid];
    const rowsFlat = row ? KANA[row.script].flatMap(g => g.rows) : [];
    const nextRow = row && rowsFlat[rowsFlat.indexOf(row) + 1];
    const msg = pct === 100 ? 'Perfekt! 完璧！' : pct >= 90 ? 'Bestanden! すごい！' : pct >= 70 ? 'Fast! Noch einmal üben.' : 'Weiter üben – das wird!';
    $('.quiz', root).innerHTML = `
      <div class="card result">
        <div class="pct ${pct >= 90 ? 'ok' : pct >= 70 ? 'warn' : 'bad'}">${pct}%</div>
        <h2>${msg}</h2>
        <p class="muted">${right} von ${results.length} richtig beim ersten Versuch</p>
        ${missed.length ? `<div class="sub-title">Falsch beantwortet</div>
          <ul class="missed">${missed.map(m => `<li><b class="jp">${m.c}</b><span class="r">${m.r}</span><span class="m">${m.e} ${m.m}</span><span class="st">${kanaStats(m.c).w}× falsch</span></li>`).join('')}</ul>` : ''}
        <div class="row-btns col">
          ${pct >= 90 && nextRow ? `<a class="btn primary" href="#/kana/learn/${nextRow.id}">Weiter: ${esc(nextRow.label)} ›</a>` : ''}
          ${missed.length ? `<a class="btn ${pct >= 90 ? '' : 'primary'}" href="#/kana/test?chars=${encodeURIComponent(missed.map(m => m.c).join(','))}&rep=2&title=Fehler%20%C3%BCben&mode=${mode}">Fehler üben</a>` : ''}
          <button class="btn" id="redo">Nochmal</button>
          <a class="btn ghost" href="#/kana/${base[0].script}">Zur Übersicht</a>
        </div>
      </div>`;
    $('#redo', root).onclick = () => go(location.hash);
    if (pct >= 90) $('.result', root).classList.add('celebrate');
  }

  if (q.mode && MODES[q.mode]) { local.quizMode = q.mode; saveLocal(); }
  nextQ();
  return () => document.removeEventListener('keydown', onKey);
}

// ---------------- Eigener Test (Tofugu-Stil) ----------------
export function renderCustom(root) {
  const sel = new Set(local.customRows || ['h-vowels', 'h-k']);
  root.innerHTML = `
    ${header('Eigener Test', '#/kana')}
    <main class="page">
      <p class="muted">Wähle die Reihen, die du testen willst.</p>
      ${['h', 'k'].map(script => `
        <section class="card">
          <div class="card-title">${SCRIPT_NAMES[script]}</div>
          ${KANA[script].map(g => `
            <div class="pick-group">
              <label class="pick-all"><input type="checkbox" data-group="${g.id}"> <b>${esc(g.title)}</b></label>
              <div class="pick-rows">
                ${g.rows.map(r => `<label class="pick ${sel.has(r.id) ? 'on' : ''}"><input type="checkbox" value="${r.id}" data-g="${g.id}" ${sel.has(r.id) ? 'checked' : ''}><span class="jp">${r.kana.slice(0, 3).map(k => k.c).join('')}${r.kana.length > 3 ? '…' : ''}</span><small>${esc(r.label)}</small></label>`).join('')}
              </div>
            </div>`).join('')}
        </section>`).join('')}
      <section class="card sticky-bottom">
        <div class="seg small" id="mode">${Object.entries(MODES).map(([m, n]) => `<a href="#" data-m="${m}" class="${(local.quizMode || 'type') === m ? 'on' : ''}">${n}</a>`).join('')}</div>
        <button class="btn primary big" id="start">Test starten</button>
      </section>
    </main>`;
  let mode = local.quizMode || 'type';
  const syncGroups = () => $$('[data-group]', root).forEach(gc => {
    const boxes = $$(`[data-g="${gc.dataset.group}"]`, root);
    gc.checked = boxes.every(b => b.checked);
    gc.indeterminate = !gc.checked && boxes.some(b => b.checked);
  });
  root.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.group) $$(`[data-g="${t.dataset.group}"]`, root).forEach(b => { b.checked = t.checked; });
    $$('.pick', root).forEach(l => l.classList.toggle('on', $('input', l).checked));
    syncGroups();
  });
  $('#mode', root).addEventListener('click', e => {
    const a = e.target.closest('[data-m]');
    if (!a) return;
    e.preventDefault();
    mode = a.dataset.m;
    $$('#mode a', root).forEach(x => x.classList.toggle('on', x === a));
  });
  $('#start', root).onclick = () => {
    const rows = $$('[data-g]:checked', root).map(b => b.value);
    if (!rows.length) return;
    local.customRows = rows;
    saveLocal();
    go(`#/kana/test?rows=${rows.join(',')}&mode=${mode}&title=Eigener%20Test`);
  };
  syncGroups();
}
