import { SENTENCES, SENTENCE_TOPICS } from '../../data/sentences.js';
import { matchesSentence, normalizeSentence, sentenceKey, sentencePool } from '../sentences.js';
import { quizRecord, quizStats, bump, save } from '../store.js';
import { header, esc, $, go, bar, shuffle, speakBtn } from '../ui.js';

const MODES = { translate: 'Übersetzen', build: 'Satz bilden', mix: 'Gemischt' };
const modeOf = value => Object.hasOwn(MODES, value) ? value : 'translate';
const topicOf = value => Object.hasOwn(SENTENCE_TOPICS, value) ? value : 'all';

export function renderStart(root) {
  let mode = 'translate', topic = 'all', size = '10';
  const stats = SENTENCES.flatMap(s => ['translate', 'build'].map(m => quizStats(sentenceKey(s.id, m))));
  const attempts = stats.reduce((n, s) => n + s.n, 0);
  const right = stats.reduce((n, s) => n + s.r, 0);
  root.innerHTML = `
    ${header('Satztest', '#/')}
    <main class="page">
      <section class="card">
        <div class="card-title">✍️ Ganze Sätze auf Romaji</div>
        <p>Übersetze deutsche Sätze oder bilde mit vorgegebenen Wörtern eigene Sätze. Deine Antwort tippst du selbst – zum Beispiel <b>watashi wa gakusei desu</b>.</p>
        <p class="muted small-note">${SENTENCES.length} Aufgaben mit Musterlösungen und Grammatik-Tipps. Großschreibung, Leerzeichen und Satzzeichen sind egal. Lange Vokale bitte mitschreiben, zum Beispiel ou oder ō.</p>
        ${attempts ? `<p class="small-note">Bisher ${attempts} Sätze getestet · ${Math.round(right / attempts * 100)} % richtig</p>` : ''}
      </section>
      <section class="card form">
        <label for="sentence-mode">Aufgabe
          <select id="sentence-mode">${Object.entries(MODES).map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select>
        </label>
        <p class="muted small-note" id="mode-description">Du siehst einen deutschen Satz und übersetzt ihn ins Japanische.</p>
        <label for="sentence-topic">Thema
          <select id="sentence-topic"><option value="all">Alle Themen</option>${Object.entries(SENTENCE_TOPICS).map(([id, label]) => `<option value="${id}">${label}</option>`).join('')}</select>
        </label>
        <label for="sentence-size">Umfang
          <select id="sentence-size"><option value="10">10 Sätze</option><option value="20">20 Sätze</option><option value="all">Alle Sätze</option></select>
        </label>
        <p class="muted small-note" id="sentence-count"></p>
        <button class="btn primary big" id="sentence-start">Satztest starten</button>
      </section>
      <a class="btn wide" href="#/quiz">🎯 Zum Wörtertest</a>
    </main>`;

  function updateCount() {
    const available = sentencePool(topic).length;
    $('#sentence-count', root).textContent = `${size === 'all' ? available : Math.min(+size, available)} verschiedene Sätze pro Runde. Schwache Sätze kommen in neuen Runden häufiger dran.`;
  }
  $('#sentence-mode', root).onchange = e => {
    mode = e.target.value;
    $('#mode-description', root).textContent = mode === 'build'
      ? 'Du bekommst eine Situation und Wörter in Romaji. Ergänze selbst die passenden Partikeln und Verbformen.'
      : mode === 'mix' ? 'Übersetzungen und Satzbau-Aufgaben wechseln sich ab.'
        : 'Du siehst einen deutschen Satz und übersetzt ihn ins Japanische.';
  };
  $('#sentence-topic', root).onchange = e => { topic = e.target.value; updateCount(); };
  $('#sentence-size', root).onchange = e => { size = e.target.value; updateCount(); };
  $('#sentence-start', root).onclick = () => go(`#/sentences/run?mode=${mode}&topic=${topic}&n=${size}`);
  updateCount();
}

// Gewichtete Auswahl ohne Wiederholungen innerhalb derselben Runde.
function selectQuestions(pool, count, mode) {
  const weighted = pool.map(sentence => {
    const modes = mode === 'mix' ? ['translate', 'build'] : [mode];
    const stats = modes.map(m => quizStats(sentenceKey(sentence.id, m)));
    const n = stats.reduce((sum, s) => sum + s.n, 0);
    const w = stats.reduce((sum, s) => sum + s.w, 0);
    const weight = 1 + 3 * (w + 0.5) / (n + 1.5);
    return { sentence, rank: -Math.log(Math.max(Number.MIN_VALUE, Math.random())) / weight };
  }).sort((a, b) => a.rank - b.rank).slice(0, count);
  const firstMode = Math.random() < 0.5 ? 0 : 1;
  return weighted.map(({ sentence }, i) => ({ sentence, mode: mode === 'mix' ? ['translate', 'build'][(i + firstMode) % 2] : mode }));
}

export function renderRun(root, _, q) {
  const mode = modeOf(q.mode), topic = topicOf(q.topic);
  const pool = sentencePool(topic, q.ids ? q.ids.split(',') : null);
  if (!pool.length) return go('#/sentences');
  const count = q.n === 'all' ? pool.length : Math.min(pool.length, ['10', '20'].includes(q.n) ? +q.n : 10);
  const questions = selectQuestions(pool, count, mode);
  const results = [];
  let current = null, checked = false, pending = null, index = 0;

  root.innerHTML = `
    <header class="top session">
      <a class="back" href="#/sentences" aria-label="Test beenden">✕</a>
      <h1>Satztest · ${esc(MODES[mode])}</h1>
      <span class="score" id="sentence-score"></span>
    </header>
    <main class="page sentence-session">
      <div id="sentence-progress" aria-label="Fortschritt">${bar(0)}</div>
      <section class="card sentence-card" id="sentence-card"></section>
    </main>`;
  const card = $('#sentence-card', root);

  function record() {
    if (!pending) return;
    results.push(pending);
    quizRecord(sentenceKey(pending.sentence.id, pending.mode), pending.correct ? 1 : 0);
    bump('x');
    pending = null;
    save();
  }

  function show() {
    current = questions[index];
    checked = false;
    const s = current.sentence;
    $('#sentence-score', root).textContent = `${index + 1}/${questions.length}`;
    $('#sentence-progress .bar span', root).style.width = `${index / questions.length * 100}%`;
    card.innerHTML = `
      <div class="kind">${esc(SENTENCE_TOPICS[s.topic])} · ${esc(MODES[current.mode])}</div>
      <h2 class="sentence-prompt">${esc(current.mode === 'build' ? s.task : s.de)}</h2>
      ${current.mode === 'build' ? `<div class="sentence-words"><div class="f-label">Deine Wörter · Reihenfolge und Grammatik ergänzt du</div><ul>${shuffle(s.words).map(w => `<li>${esc(w)}</li>`).join('')}</ul></div>` : '<p class="muted small-note">Übersetze ins Japanische. Verwende die höfliche Form.</p>'}
      <form class="form" id="sentence-form">
        <label for="sentence-answer">Deine Antwort auf Romaji
          <textarea id="sentence-answer" rows="3" lang="ja-Latn" inputmode="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Schreibe hier deinen Satz …" aria-describedby="sentence-input-hint" required></textarea>
        </label>
        <p class="muted small-note" id="sentence-input-hint">Zum Beispiel wa, o, ni · Enter zum Prüfen</p>
        <button class="btn primary big" type="submit" id="sentence-check">Antwort prüfen</button>
        <button class="btn ghost" type="button" id="sentence-skip">Weiß ich noch nicht · Lösung zeigen</button>
      </form>
      <div id="sentence-feedback" class="sentence-feedback" aria-live="polite" aria-atomic="true"></div>`;
    const input = $('#sentence-answer', root);
    $('#sentence-form', root).onsubmit = e => { e.preventDefault(); check(); };
    $('#sentence-skip', root).onclick = () => check(true);
    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && !e.isComposing && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault();
        check();
      }
    });
    input.focus({ preventScroll: true });
  }

  function check(skip = false) {
    if (checked || !current) return;
    const input = $('#sentence-answer', root);
    const answer = input.value.trim();
    if (!skip && !normalizeSentence(answer)) {
      input.setCustomValidity('Schreibe zuerst einen Satz auf Romaji oder zeige die Lösung.');
      input.reportValidity();
      input.oninput = () => input.setCustomValidity('');
      return;
    }
    const s = current.sentence;
    const correct = !skip && matchesSentence(answer, s);
    pending = { ...current, answer, correct, skipped: skip };
    checked = true;
    input.readOnly = true;
    $('#sentence-check', root).hidden = true;
    $('#sentence-skip', root).hidden = true;
    $('#sentence-feedback', root).innerHTML = `
      <div class="fb-head ${correct ? 'ok' : 'warn'}" id="sentence-verdict">${correct ? '✓ Richtig!' : skip ? 'Schau dir die Lösung an' : 'Vergleiche mit der Musterlösung'}</div>
      <div class="sentence-solution">
        <div class="f-label">Musterlösung</div>
        <div class="sentence-romaji">${esc(s.ro)}</div>
        <div class="jp">${esc(s.jp)} ${speakBtn(s.jp)}</div>
        <div>${esc(s.de)}</div>
      </div>
      <div class="tip">${esc(s.note)}</div>
      ${!correct && !skip ? `<p class="muted small-note">Andere Formulierungen sind möglich. Wenn dein Satz auch richtig ist, kannst du ihn selbst als richtig werten.</p><button class="btn wide" id="sentence-accept">Meine Antwort stimmt auch</button>` : ''}
      <button class="btn primary big" id="sentence-next">${index + 1 === questions.length ? 'Auswertung ansehen' : 'Nächster Satz'}</button>`;
    const accept = $('#sentence-accept', root);
    if (accept) accept.onclick = () => {
      pending.correct = true;
      const verdict = $('#sentence-verdict', root);
      verdict.className = 'fb-head ok';
      verdict.textContent = '✓ Selbst als richtig gewertet';
      accept.disabled = true;
      $('#sentence-next', root).focus({ preventScroll: true });
    };
    $('#sentence-next', root).onclick = () => {
      record();
      index++;
      if (index < questions.length) show();
      else finish();
    };
    $('#sentence-next', root).focus({ preventScroll: true });
  }

  function finish() {
    current = null;
    const right = results.filter(r => r.correct).length;
    const missed = results.filter(r => !r.correct);
    const pct = Math.round(right / results.length * 100);
    $('#sentence-score', root).textContent = '';
    $('#sentence-progress .bar span', root).style.width = '100%';
    card.className = 'card result';
    card.innerHTML = `
      <div class="pct ${pct >= 90 ? 'ok' : pct >= 70 ? 'warn' : 'bad'}">${pct} %</div>
      <h2>${pct >= 90 ? 'Sehr gut gemacht!' : 'Weiter so!'}</h2>
      <p>${right} von ${results.length} Sätzen richtig</p>
      ${missed.length ? `<div class="sub-title">Diese Sätze kannst du weiter üben</div><ul class="sentence-mistakes">${missed.map(r => `<li><b>${esc(r.sentence.de)}</b><div class="muted small-note">Deine Antwort: ${r.skipped ? 'Lösung aufgedeckt' : esc(r.answer)}</div><div class="sentence-romaji">${esc(r.sentence.ro)}</div></li>`).join('')}</ul>` : ''}
      <div class="row-btns col">
        ${missed.length ? `<a class="btn primary" href="#/sentences/run?mode=${mode}&topic=${topic}&n=all&ids=${encodeURIComponent(missed.map(r => r.sentence.id).join(','))}">Fehler nochmal üben · ${missed.length}</a>` : ''}
        <button class="btn ${missed.length ? '' : 'primary'}" id="sentence-again">Neue Runde</button>
        <a class="btn ghost" href="#/sentences">Fertig</a>
      </div>`;
    $('#sentence-again', root).onclick = () => go(`#/sentences/run?mode=${mode}&topic=${topic}&n=${q.n === 'all' ? 'all' : count}`);
    card.scrollIntoView({ block: 'start' });
  }

  show();
  return record;
}
