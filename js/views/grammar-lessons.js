import { LESSON_UNITS, GRAMMAR_SOURCES, TE_FORM_TABLE } from '../../data/grammar-lessons.js';
import { grammarLessons, grammarLesson, lessonProgress, lessonStats, nextGrammarLesson, lessonExample, lessonQuestions, matchesLessonAnswer, lessonQuestionKey, markLessonRead, finishLessonTest, filterLessons } from '../grammar-lessons.js';
import { quizRecord, bump, save } from '../store.js';
import { storyById } from '../stories.js';
import { header, esc, $, go, shuffle, bar, speakBtn } from '../ui.js';

const lessonUrl = id => `#/grammar/lesson/${id}`;
const testUrl = id => `${lessonUrl(id)}/test`;
const number = lesson => grammarLessons().indexOf(lesson) + 1;
const sourcesHtml = () => `<details class="grammar-details"><summary>Quellen zum Weiterlesen</summary><p>Eigene Erklärungen und Übungssätze. Fachlicher Abgleich mit den Materialien der Japan Foundation:</p><ul>${GRAMMAR_SOURCES.map(([name, url]) => `<li><a href="${url}" target="_blank" rel="noopener">${esc(name)}</a></li>`).join('')}</ul></details>`;
const label = progress => progress.passed ? 'Test bestanden' : progress.learned ? 'Gelesen · Test offen' : 'Noch offen';

export function render(root) {
  const lessons = grammarLessons(), next = nextGrammarLesson();
  const passed = lessons.filter(l => lessonProgress(l.id).passed).length;
  const read = lessons.filter(l => lessonProgress(l.id).learned).length;
  root.innerHTML = `${header('Grammatik lernen')}<main class="page grammar-page">
    <section class="card grammar-course-intro"><div class="kind">Dein Lernpfad</div><h2>Ein neuer Satzbau, eine neue Lektion.</h2>
      <p>Verstehen, an Beispielen nachvollziehen und selbst anwenden. Jede Lektion erklärt ein Muster und hat einen eigenen Test. Alle Lektionen sind sofort zugänglich.</p>
      <div class="stats"><div><b>${read}/${lessons.length}</b><small>gelesen</small></div><div><b>${passed}/${lessons.length}</b><small>Tests bestanden</small></div></div>${bar(passed / lessons.length)}
      <a class="btn primary wide" href="${lessonUrl(next.id)}">${passed === lessons.length ? 'Zum Wiederholen' : 'Weiterlernen'}: ${esc(next.title)}</a>
      <p class="muted small-note">Pro Test: Verständnis, zwei Lücken und ein neuer Satz. Fehler kannst du gezielt wiederholen.</p>
    </section>
    <section class="card grammar-course-tools"><label for="lesson-search">Eine Satzstruktur finden</label><input class="search" id="lesson-search" type="search" placeholder="z. B. Vergangenheit, bevor, ni, te-Form …" autocomplete="off">
      <div class="lesson-filters"><label>Bereich<select id="lesson-unit"><option value="all">Alle Bereiche</option>${Object.entries(LESSON_UNITS).map(([id, name]) => `<option value="${id}">${esc(name)}</option>`).join('')}</select></label><label>Stand<select id="lesson-status"><option value="all">Alle Lektionen</option><option value="open">Test noch offen</option><option value="passed">Test bestanden</option></select></label></div>
      <p id="lesson-count" class="muted small-note" role="status"></p></section>
    <div id="lesson-list"></div>
    <section class="card"><div class="card-title">Nachschlagen & frei üben</div><p>Dein bisheriges Formelblatt, die Vergleiche no / ni und wa / ga sowie die Übungen mit deinen gelernten Story-Sätzen findest du weiterhin hier.</p><div class="row-btns col"><a class="btn" href="#/grammar/reference">Formelblatt & bisheriges Lernprofil</a><a class="btn" href="#/sentences">Ganze Story-Sätze üben</a></div>${sourcesHtml()}</section>
  </main>`;
  function update() {
    const filtered = filterLessons($('#lesson-search', root).value, $('#lesson-unit', root).value, $('#lesson-status', root).value);
    $('#lesson-count', root).textContent = `${filtered.length} von ${lessons.length} Lektionen`;
    $('#lesson-list', root).innerHTML = filtered.length ? Object.entries(LESSON_UNITS).map(([unit, title]) => {
      const group = filtered.filter(l => l.unit === unit);
      if (!group.length) return '';
      return `<section class="lesson-unit"><h2>${esc(title)}</h2><ol class="lesson-list">${group.map(l => {
        const progress = lessonProgress(l.id), stats = lessonStats(l.id);
        return `<li class="card lesson-card"><a class="lesson-main" href="${lessonUrl(l.id)}"><span class="lesson-number${progress.passed ? ' passed' : ''}">${progress.passed ? '✓' : number(l)}</span><span><h3>${esc(l.title)}</h3><p>${esc(l.goal)}</p><small>${label(progress)}${stats.n ? ` · Bester kompletter Test: ${progress.best || 0} %` : ''}</small></span><span class="chev" aria-hidden="true">›</span></a><div class="lesson-card-actions"><a href="${lessonUrl(l.id)}">Lektion öffnen</a><a href="${testUrl(l.id)}">Test starten · 4 Aufgaben</a></div></li>`;
      }).join('')}</ol></section>`;
    }).join('') : '<section class="card"><p>Keine passende Lektion. Versuche einen anderen Suchbegriff oder Bereich.</p></section>';
  }
  $('#lesson-search', root).addEventListener('input', update);
  $('#lesson-unit', root).addEventListener('change', update);
  $('#lesson-status', root).addEventListener('change', update);
  update();
}

export function renderLesson(root, [id]) {
  const lesson = grammarLesson(id);
  if (!lesson) return go('#/grammar');
  const progress = lessonProgress(id), index = number(lesson), next = grammarLessons()[index];
  root.innerHTML = `${header(`Lektion ${index}`, '#/grammar')}<main class="page grammar-page">
    <section class="card"><div class="kind">${esc(LESSON_UNITS[lesson.unit])}</div><h2>${esc(lesson.title)}</h2><p class="lesson-goal"><b>Danach kannst du:</b> ${esc(lesson.goal)}</p><div class="grammar-formula">${esc(lesson.formula)}</div></section>
    <section class="card"><div class="card-title">So funktioniert der Satzbau</div>${lesson.explain.map((text, i) => `<div class="lesson-step"><span>${i + 1}</span><p>${esc(text)}</p></div>`).join('')}</section>
    <section class="card"><div class="card-title">Schritt für Schritt am Beispiel</div>${lesson.examples.map(ex => {
      const parsed = lessonExample(ex);
      return `<div class="grammar-example lesson-example"><div class="row-between"><span class="jp" lang="ja">${esc(ex.jp)}</span>${speakBtn(ex.jp)}</div><div class="lesson-romaji">${esc(parsed.before)}<strong>${esc(parsed.answer)}</strong>${esc(parsed.after)}</div><div>${esc(ex.de)}</div></div>`;
    }).join('')}<p class="muted small-note">Der hervorgehobene Teil zeigt das Lernziel dieser Lektion. Lies den Rest mit: Erst im ganzen Satz wird die Funktion deutlich.</p>
    ${id === 'te-form' ? `<div class="grammar-table-wrap"><table class="grammar-table"><caption>Die te-Form nach Verbgruppe</caption><thead><tr><th>Regel</th><th>Beispiele</th></tr></thead><tbody>${TE_FORM_TABLE.map(([rule, example]) => `<tr><th>${esc(rule)}</th><td>${esc(example)}</td></tr>`).join('')}</tbody></table></div>` : ''}</section>
    <section class="card"><div class="card-title">Darauf achten</div><p>${esc(lesson.caution)}</p></section>
    <section class="card lesson-test-entry"><div class="card-title">Jetzt selbst anwenden</div><p>Vier Aufgaben nur zu dieser Lektion: eine Verständnisfrage, zwei Lücken und ein neuer Satz mit Wortbausteinen. Du bekommst nach jeder Antwort eine Erklärung.</p><p class="muted small-note">Bestanden ab 3 von 4 Antworten ohne Hilfe. ${progress.passed ? `Schon bestanden · Bestwert ${progress.best} %.` : progress.best ? `Bisheriger Bestwert: ${progress.best} %.` : 'Du kannst den Test jederzeit wiederholen.'}</p><a class="btn primary wide" id="lesson-read-test" href="${testUrl(id)}">Lektion gelesen → Test starten</a><button class="btn wide" id="lesson-read" type="button">${progress.learned ? '✓ Als gelesen gespeichert' : 'Als gelesen markieren'}</button></section>
    ${lesson.stories.length ? `<section class="card"><div class="card-title">Im Lesemodus wiederfinden</div><p>Dieses Muster begegnet dir auch in den zugehörigen Geschichten.</p><div class="grammar-jumps">${lesson.stories.map(storyById).filter(Boolean).map(s => `<a href="#/story/${s.id}">${s.emoji} ${esc(s.title)}</a>`).join('')}</div></section>` : ''}
    <div class="row-btns">${next ? `<a class="btn wide" href="${lessonUrl(next.id)}">Nächste Lektion: ${esc(next.title)}</a>` : '<a class="btn wide" href="#/grammar">Zur Lektionsübersicht</a>'}</div>
  </main>`;
  const mark = () => { markLessonRead(id); save(); $('#lesson-read', root).textContent = '✓ Als gelesen gespeichert'; };
  $('#lesson-read', root).onclick = mark;
  $('#lesson-read-test', root).addEventListener('click', mark);
}

export function renderTest(root, [id], query = {}) {
  const lesson = grammarLesson(id);
  if (!lesson) return go('#/grammar');
  const all = lessonQuestions(id);
  const wanted = query.retry ? new Set(query.retry.split(',')) : null;
  const selected = wanted ? all.filter(q => wanted.has(q.id)) : all;
  if (!selected.length) return go(testUrl(id));
  const results = [], questions = shuffle(selected);
  let index = 0, checked = false, hinted = false, chosen = '';
  root.innerHTML = `<header class="top session"><a class="back" href="${lessonUrl(id)}" aria-label="Test beenden">✕</a><h1>${wanted ? 'Fehler wiederholen' : `Test · Lektion ${number(lesson)}`}</h1><span id="lesson-score"></span></header><main class="page grammar-page"><p class="muted small-note">${esc(lesson.title)}</p><div id="lesson-progress">${bar(0)}</div><section id="lesson-exercise" class="card grammar-exercise"></section></main>`;
  const host = $('#lesson-exercise', root);
  function show() {
    checked = false; hinted = false; chosen = '';
    const q = questions[index];
    $('#lesson-score', root).textContent = `${index + 1}/${questions.length}`;
    $('#lesson-progress .bar span', root).style.width = `${index / questions.length * 100}%`;
    host.innerHTML = `<div class="kind">${q.kind === 'choice' ? 'Verstehen' : q.kind === 'gap' ? 'Muster ergänzen' : 'Neuen Satz bauen'}</div><h2>${esc(q.prompt)}</h2>
      ${q.kind === 'gap' ? `<div class="grammar-gap">${esc(q.before)}<span class="grammar-blank">___</span>${esc(q.after)}</div><p class="muted small-note">Setze nur den fehlenden Teil des Bauplans ein.</p>` : ''}
      ${q.kind === 'choice' ? `<div class="opts">${shuffle(q.choices).map((choice, i) => `<button class="opt" type="button" data-choice="${esc(choice)}">${esc(choice)}</button>`).join('')}</div>` : `<form id="lesson-answer-form" class="form"><label for="lesson-answer">${q.kind === 'build' ? esc(q.de) : 'Deine Ergänzung'}<input id="lesson-answer" required autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="${q.kind === 'build' ? 'Den ganzen Satz auf Romaji schreiben' : 'Fehlenden Teil auf Romaji schreiben'}"></label>
      ${q.kind === 'build' ? `<div class="sentence-words"><b>Wortbausteine</b><p class="muted small-note">Antippen oder selbst tippen. Verwende alle Bausteine; bilde den Satz im Bauplan dieser Lektion.</p><div class="lesson-word-bank">${shuffle(q.ro.replace(/[.,!?"']/g, '').trim().split(/\s+/)).map((word, i) => `<button class="btn small" type="button" data-token="${esc(word)}" data-token-id="${i}">${esc(word)}</button>`).join('')}</div><button class="btn small ghost" type="button" id="lesson-clear">Eingabe leeren & Bausteine zurücksetzen</button></div>` : ''}
      <button class="btn primary big" id="lesson-check" type="submit">Antwort prüfen</button></form>`}
      <button class="btn small ghost" id="lesson-hint" type="button">Bauplan als Hilfe zeigen</button><div id="lesson-help" class="tip" hidden>${esc(lesson.formula)}</div><button class="btn ghost" id="lesson-skip" type="button">Lösung zeigen</button><div class="sentence-feedback" id="lesson-feedback" aria-live="polite" aria-atomic="true"></div>`;
    if (q.kind !== 'choice') {
      $('#lesson-answer-form', root).onsubmit = e => { e.preventDefault(); if (!e.isComposing) check(false); };
      $('#lesson-answer', root).onkeydown = e => { if (e.key === 'Enter' && e.isComposing) e.preventDefault(); };
      $('#lesson-answer', root).focus({ preventScroll: true });
    }
    $('#lesson-hint', root).onclick = () => { hinted = true; $('#lesson-help', root).hidden = false; $('#lesson-hint', root).hidden = true; };
    $('#lesson-skip', root).onclick = () => check(true);
    const clear = $('#lesson-clear', root);
    if (clear) clear.onclick = () => { if (checked) return; $('#lesson-answer', root).value = ''; host.querySelectorAll('[data-token]').forEach(b => b.disabled = false); };
    host.scrollIntoView({ block: 'start' });
  }
  host.addEventListener('click', e => {
    if (checked) return;
    const choice = e.target.closest('[data-choice]');
    if (choice) { chosen = choice.dataset.choice; check(false); }
    const token = e.target.closest('[data-token]');
    if (token) { const input = $('#lesson-answer', root); input.value = `${input.value.trim()} ${token.dataset.token}`.trim(); token.disabled = true; }
  });
  function check(skip) {
    if (checked) return;
    const q = questions[index], input = $('#lesson-answer', root);
    const answer = q.kind === 'choice' ? chosen : input.value;
    if (!skip && !answer.trim()) return input?.reportValidity();
    checked = true;
    const correct = !skip && matchesLessonAnswer(answer, q, lesson);
    results.push({ id: q.id, correct, hinted, answer });
    quizRecord(lessonQuestionKey(id, q.id), correct ? (hinted ? .5 : 1) : 0); bump('x'); save();
    if (input) input.readOnly = true;
    host.querySelectorAll('[data-choice], [data-token], #lesson-clear').forEach(b => b.disabled = true);
    host.querySelectorAll('[data-choice]').forEach(b => { if (b.dataset.choice === q.answer) b.classList.add('right'); else if (b.dataset.choice === answer) b.classList.add('wrong'); });
    const checkButton = $('#lesson-check', root); if (checkButton) checkButton.hidden = true;
    $('#lesson-skip', root).hidden = true; $('#lesson-hint', root).hidden = true;
    $('#lesson-feedback', root).innerHTML = `<div class="fb-head ${correct && !hinted ? 'ok' : 'warn'}">${correct ? hinted ? '✓ Richtig mit Hilfe' : '✓ Richtig!' : 'Schau dir das Muster nochmal an.'}</div>
      ${!correct && answer ? `<p class="muted small-note">Deine Antwort: ${esc(answer)}</p>` : ''}
      <div class="sentence-solution"><b>${q.kind === 'choice' ? 'Richtige Antwort' : 'Musterlösung'}</b><div class="sentence-romaji">${esc(q.kind === 'choice' ? q.answer : q.ro)}</div>${q.jp ? `<div class="jp" lang="ja">${esc(q.jp)} ${speakBtn(q.jp)}</div><div>${esc(q.de)}</div>` : ''}</div>
      <div class="grammar-formula">${esc(lesson.formula)}</div><p>${esc(lesson.explain[q.kind === 'build' ? 1 : 0])}</p><p class="muted small-note">${esc(lesson.caution)}</p>
      <button class="btn primary big" id="lesson-next" type="button">${index + 1 === questions.length ? 'Auswertung ansehen' : 'Nächste Aufgabe'}</button>`;
    $('#lesson-next', root).onclick = () => { index++; index < questions.length ? show() : finish(); };
    $('#lesson-next', root).focus({ preventScroll: true });
  }
  function finish() {
    const summary = finishLessonTest(id, results, { retry: !!wanted }); save();
    const missed = results.filter(r => !r.correct || r.hinted);
    $('#lesson-score', root).textContent = '';
    $('#lesson-progress .bar span', root).style.width = '100%';
    host.innerHTML = `<div class="grammar-finish"><div class="kind">${wanted ? 'Wiederholung' : 'Lektionstest'}</div><h2>${summary.passed ? 'Test bestanden!' : wanted && !missed.length ? 'Diese Aufgaben klappen jetzt.' : 'Weiter festigen'}</h2><p><b>${summary.right} von ${results.length}</b> ohne Hilfe richtig · ${summary.percent} %</p><p class="muted small-note">${wanted ? 'Die Fehlerwiederholung trainiert einzelne Aufgaben. Deinen Bestwert und das Bestehen aktualisiert ein kompletter Test.' : 'Bestanden ab 3 von 4 Antworten ohne Hilfe. Dein Bestwert bleibt gespeichert.'}</p>
      ${missed.length ? `<div class="sub-title">Hier nochmal nachschauen</div><ul class="sentence-mistakes">${missed.map(r => { const q = all.find(x => x.id === r.id); return `<li><b>${esc(q.kind === 'build' ? q.de : q.prompt)}</b><span>${esc(q.kind === 'choice' ? q.answer : q.ro)}</span><small>${r.hinted && r.correct ? 'Mit Hilfe gelöst' : 'Noch festigen'}</small></li>`; }).join('')}</ul><a class="btn primary wide" href="${testUrl(id)}?retry=${missed.map(r => r.id).join(',')}">Nur diese Aufgaben wiederholen</a>` : ''}
      <a class="btn wide" href="${testUrl(id)}">Kompletten Test wiederholen</a><a class="btn wide" href="${lessonUrl(id)}">Erklärung nochmal lesen</a><a class="btn ghost wide" href="#/grammar">Zur Lektionsübersicht</a>
      ${summary.passed && grammarLessons()[number(lesson)] ? `<a class="btn primary wide" href="${lessonUrl(grammarLessons()[number(lesson)].id)}">Zur nächsten Lektion</a>` : ''}</div>`;
    host.scrollIntoView({ block: 'start' });
  }
  show();
}
