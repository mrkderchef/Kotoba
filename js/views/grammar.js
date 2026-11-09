import { GRAMMAR_RULES, GRAMMAR_GROUPS, VERB_STEMS } from '../../data/grammar.js';
import { grammarRule, grammarKey, grammarTopic, topicRules, grammarProfile, grammarMatches, formulaQuestions, storyGrammarQuestions } from '../grammar.js';
import { sentenceCatalog, sentencePool } from '../sentences.js';
import { state, quizRecord, quizStats, bump, save } from '../store.js';
import { header, esc, $, go, shuffle, bar } from '../ui.js';

const status = s => !s.n ? 'Noch nicht geübt' : `${Math.round(s.r / s.n * 100)} % richtig · ${s.n}×`;
const ruleLink = r => `#/grammar/${r.id}`;
const table = () => `<div class="grammar-table-wrap"><table class="grammar-table"><caption>Ein Stamm, vier höfliche Formen</caption>
  <thead><tr><th>Zeit</th><th>Bejaht</th><th>Verneint</th></tr></thead>
  <tbody><tr><th>Gegenwart / Zukunft</th><td><b>nomi + masu</b><br>ich trinke / werde trinken</td><td><b>nomi + masen</b><br>ich trinke nicht / werde nicht trinken</td></tr>
  <tr><th>Vergangenheit</th><td><b>nomi + mashita</b><br>ich habe getrunken</td><td><b>nomi + masen deshita</b><br>ich habe nicht getrunken</td></tr></tbody></table></div>`;
const formula = r => `<div class="grammar-formula">${esc(r.formula)}</div><p>${esc(r.explain)}</p><div class="tip">${esc(r.remember)}</div>`;

export function render(root) {
  const profile = grammarProfile();
  const attempts = profile.reduce((sum, s) => sum + s.n, 0);
  const right = profile.reduce((sum, s) => sum + s.r, 0);
  const weak = profile.filter(s => s.n && s.r / s.n < .8).sort((a, b) => b.w / b.n - a.w / a.n || b.t - a.t).slice(0, 3);
  const readLessons = [...new Map(sentenceCatalog().filter(s => state.read[s.story]).map(s => [s.story, s])).values()];
  root.innerHTML = `
    ${header('Meine Grammatik')}
    <main class="page grammar-page">
      <section class="card">
        <div class="card-title">🧭 Mein Lernprofil</div>
        <p>Erst ein Muster, dann der ganze Satz. Hier kannst du die Regeln wie Formeln nachschlagen und einzeln wiederholen.</p>
        <div class="stats"><div><b>${profile.filter(s => s.n).length}/${GRAMMAR_RULES.length}</b><small>Regeln geübt</small></div><div><b>${attempts}</b><small>Antworten</small></div><div><b>${attempts ? Math.round(right / attempts * 100) + ' %' : '–'}</b><small>richtig</small></div></div>
        ${weak.length ? `<div class="sub-title">Das fällt dir noch schwer</div><div class="grammar-jumps">${weak.map(s => `<a href="${ruleLink(s.rule)}">${esc(s.rule.label)} · ${Math.round(s.w / s.n * 100)} % Fehler</a>`).join('')}</div>` : '<p class="muted small-note">Starte mit no / ni oder wa / ga. Deine Übungen zeigen hier, was du noch festigen kannst.</p>'}
        <a class="btn primary wide" href="#/grammar/practice?source=rules&topic=all">Formeln kurz wiederholen</a>
      </section>
      <section class="card">
        <div class="card-title">Dein Satzbau-Rezept</div>
        <ol class="steps"><li><b>Worüber?</b> Thema + wa</li><li><b>Was / wo / wann?</b> Wörter mit passender Partikel ergänzen</li><li><b>Was passiert?</b> Verb mit passender Endung ans Ende</li></ol>
        <div class="grammar-formula">watashi wa · mizu o · nomimasu</div>
        <p class="muted small-note">Ich · Wasser · trinke. Das Thema kann entfallen, wenn klar ist, wer gemeint ist. Für „A ist B“ verwendest du A wa B desu.</p>
      </section>
      <section class="card">
        <div class="card-title">Die typischen Verwechslungen</div>
        <div class="grammar-compare"><div><b>no → Zugehörigkeit</b><p>watashi <strong>no</strong> hon<br><small>mein Buch</small></p></div><div><b>ni → Ziel / Zeit / Daseinsort</b><p>heya <strong>ni</strong> neko ga imasu<br><small>Im Zimmer ist eine Katze.</small></p></div></div>
        <a class="btn wide" href="#/grammar/practice?source=rules&topic=no-ni">Nur no / ni üben</a>
        <div class="grammar-compare"><div><b>wa → Thema</b><p>neko <strong>wa</strong> kawaii desu<br><small>Was die Katze betrifft: Sie ist süß.</small></p></div><div><b>ga → Subjekt</b><p>neko <strong>ga</strong> imasu<br><small>Da ist eine Katze.</small></p></div></div>
        <p class="muted small-note">wa / ga hängt vom Kontext ab. Lerne zuerst diese beiden Muster.</p>
        <a class="btn wide" href="#/grammar/practice?source=rules&topic=wa-ga">Nur wa / ga üben</a>
      </section>
      <section class="card">
        <div class="card-title">Verbendungen wie eine Formel</div>
        ${table()}
        <div class="tip grammar-reminder"><b>mashita, nicht ishita:</b> nomi + mashita → nomimashita. Bei shi + mashita → shimashita ist shi der Stamm von suru.</div>
        <a class="btn wide" href="#/grammar/practice?source=rules&topic=verbs">Nur Verbendungen üben</a>
        <details class="grammar-details"><summary>Wie bekomme ich den Stamm? Und wann desu?</summary>
          <p>Wenn du die masu-Form kennst, nimm masu weg: nomimasu → nomi. An diesen Stamm kommt eine der vier Endungen. Von der Wörterbuchform zum Stamm hängt es von der Verbgruppe ab:</p>
          <ul class="grammar-stems">${VERB_STEMS.map(([base, stem, de]) => `<li><b>${base} → ${stem}</b> · ${de}</li>`).join('')}</ul>
          <p><b>desu</b> steht zum Beispiel nach Nomen: gakusei desu = bin Student/in. Ein Verb wie nomimasu braucht kein zusätzliches desu. Bei i-Adjektiven wie takai gibt es eigene Zeit- und Verneinungsformen; verwende dort nicht einfach die Verbendungen.</p>
        </details>
      </section>
      ${Object.entries(GRAMMAR_GROUPS).map(([group, label]) => `<section class="card"><div class="card-title">${label} · Formelblatt</div><div class="grammar-rule-list">${profile.filter(s => s.rule.group === group).map(s => `<a class="grammar-rule" href="${ruleLink(s.rule)}"><span><b>${esc(s.rule.label)}</b> <span class="jp muted">${s.rule.kana}</span><small>${esc(s.rule.role)}</small></span><span class="muted small-note">${status(s)} ›</span></a>`).join('')}</div></section>`).join('')}
      <section class="card">
        <div class="card-title">Mit deinen gelernten Sätzen üben</div>
        <p>Nur eine Lücke ausfüllen: die Partikel oder die Verbendung. Der Rest des Satzes steht schon da.</p>
        ${storyGrammarQuestions().length ? '<a class="btn primary wide" href="#/grammar/practice?source=stories&topic=all">Lücken mit meinen Sätzen üben</a>' : '<p class="muted small-note">Nach einer Geschichte mit Beispielsätzen und ihrem Wortquiz erscheinen hier passende Übungen.</p>'}
        <a class="btn wide" href="#/sentences">Ganze Sätze auf Romaji schreiben</a>
        ${readLessons.length ? `<details class="grammar-details"><summary>Weitere Grammatik aus deinen Geschichten</summary>${readLessons.map(s => `<div class="grammar-story"><a href="#/story/${s.story}">${s.emoji} ${esc(s.title)}</a><p class="small-note">${esc(s.note)}</p></div>`).join('')}</details>` : ''}
      </section>
      <p class="foot muted small-note">Grundmuster für den Einstieg. Zum Weiterlesen: <a href="https://www.irodori.jpf.go.jp/en/starter/pdf.html" target="_blank" rel="noopener">Irodori · Japan Foundation</a></p>
    </main>`;
}

export function renderRule(root, [id]) {
  const rule = grammarRule(id);
  if (!rule) return go('#/grammar');
  const exercises = storyGrammarQuestions(id);
  const examples = [...new Map(exercises.map(q => [q.sentence.id, q.sentence])).values()].slice(0, 3);
  root.innerHTML = `
    ${header(`${rule.label} · ${rule.kana}`, '#/grammar')}
    <main class="page grammar-page">
      <section class="card">
        <div class="card-title">${esc(rule.role)}</div>
        ${formula(rule)}
        <div class="grammar-example"><b>${esc(rule.example[0])}</b><div>${esc(rule.example[1])}</div></div>
        <p class="muted small-note">${esc(rule.caution)}</p>
        <p class="small-note">Dein Stand: ${status(quizStats(grammarKey(id)))}</p>
        <a class="btn primary wide" href="#/grammar/practice?source=rules&topic=${id}">Diese Formel wiederholen</a>
      </section>
      ${rule.group === 'verbs' ? `<section class="card">${table()}</section>` : ''}
      <section class="card"><div class="card-title">Beispiele aus deinen Geschichten</div>
        ${examples.length ? examples.map(s => `<div class="grammar-example"><b>${esc(s.ro)}</b><div>${esc(s.de)}</div><a class="muted small-note" href="#/story/${s.story}">${s.emoji} ${esc(s.title)}</a></div>`).join('') : '<p class="muted">Sobald du passende Geschichten und Wörter gelernt hast, erscheinen hier deine Beispielsätze.</p>'}
        ${exercises.length ? `<a class="btn primary wide" href="#/grammar/practice?source=stories&topic=${id}">Nur ${esc(rule.label)} in meinen Sätzen üben</a>` : ''}
      </section>
    </main>`;
}

export function renderPractice(root, _, query) {
  const topic = grammarTopic(query.topic), source = query.source === 'stories' ? 'stories' : 'rules';
  const available = source === 'stories' ? storyGrammarQuestions(topic) : formulaQuestions(topic);
  if (!available.length) {
    root.innerHTML = `${header('Grammatik üben', '#/grammar')}<main class="page"><section class="card"><h2>Noch keine passenden Sätze</h2><p>Du kannst die Formel schon wiederholen. Passende Sätze kommen dazu, sobald du ihre Geschichte und Wörter gelernt hast.</p><a class="btn primary wide" href="#/grammar/practice?source=rules&topic=${topic}">Formel wiederholen</a></section></main>`;
    return;
  }
  // Schwache Regeln zuerst, bei Satzaufgaben möglichst verschiedene Sätze verwenden.
  const shuffled = shuffle(available).sort((a, b) => {
    const sa = quizStats(grammarKey(a.rule)), sb = quizStats(grammarKey(b.rule));
    return (sb.w + .5) / (sb.n + 1) - (sa.w + .5) / (sa.n + 1);
  });
  const selected = [], seen = new Set();
  for (const q of shuffled) {
    if (q.sentence && seen.has(q.sentence.id)) continue;
    selected.push(q);
    if (q.sentence) seen.add(q.sentence.id);
    if (selected.length === 6) break;
  }
  const results = [];
  let index = 0, checked = false;
  root.innerHTML = `<header class="top session"><a class="back" href="#/grammar" aria-label="Übung beenden">✕</a><h1>${source === 'stories' ? 'Eine Lücke, eine Regel' : 'Formeln wiederholen'}</h1><span id="grammar-score"></span></header><main class="page grammar-page"><div id="grammar-progress">${bar(0)}</div><section class="card grammar-exercise" id="grammar-exercise"></section></main>`;
  const host = $('#grammar-exercise', root);

  function show() {
    checked = false;
    const q = selected[index], rule = grammarRule(q.rule);
    $('#grammar-score', root).textContent = `${index + 1}/${selected.length}`;
    $('#grammar-progress .bar span', root).style.width = `${index / selected.length * 100}%`;
    host.innerHTML = `<div class="kind">${esc(GRAMMAR_GROUPS[rule.group])}</div>
      <h2>${esc(q.prompt)}</h2>
      ${q.sentence ? `<div class="grammar-gap"><span>${esc(q.before)}</span><span class="grammar-blank" aria-label="Lücke">___</span><span>${esc(q.after)}</span></div><p>${esc(q.sentence.de)}</p><a class="muted small-note" href="#/story/${q.sentence.story}">${q.sentence.emoji} ${esc(q.sentence.title)}</a>` : '<p class="muted small-note">Schreibe nur die gesuchte Partikel oder Endung, keinen ganzen Satz.</p>'}
      <button class="btn small ghost" id="grammar-hint" type="button">Formel als Hilfe zeigen</button><div class="tip" id="grammar-help" hidden>${esc(rule.formula)}<br>${esc(rule.remember)}</div>
      <form class="form" id="grammar-form"><label for="grammar-answer">${rule.group === 'verbs' ? 'Verbendung' : 'Partikel'} auf Romaji<input id="grammar-answer" type="text" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" required aria-describedby="grammar-input-hint"></label><p class="muted small-note" id="grammar-input-hint">Enter zum Prüfen</p><button class="btn primary big" id="grammar-check" type="submit">Antwort prüfen</button><button class="btn ghost" id="grammar-skip" type="button">Lösung zeigen</button></form>
      <div id="grammar-feedback" class="sentence-feedback" aria-live="polite" aria-atomic="true"></div>`;
    $('#grammar-hint', root).onclick = () => { $('#grammar-help', root).hidden = false; $('#grammar-hint', root).hidden = true; };
    $('#grammar-form', root).onsubmit = e => { e.preventDefault(); check(false); };
    $('#grammar-answer', root).onkeydown = e => { if (e.key === 'Enter' && e.isComposing) e.preventDefault(); };
    $('#grammar-skip', root).onclick = () => check(true);
    $('#grammar-answer', root).focus({ preventScroll: true });
  }

  function check(skip) {
    if (checked) return;
    const input = $('#grammar-answer', root), q = selected[index], rule = grammarRule(q.rule);
    if (!skip && !input.value.trim()) return input.reportValidity();
    checked = true;
    const correct = !skip && grammarMatches(input.value, rule);
    results.push({ rule: q.rule, correct });
    quizRecord(grammarKey(q.rule), correct ? 1 : 0);
    bump('x'); save();
    input.readOnly = true;
    $('#grammar-check', root).hidden = true;
    $('#grammar-skip', root).hidden = true;
    $('#grammar-feedback', root).innerHTML = `<div class="fb-head ${correct ? 'ok' : 'warn'}">${correct ? '✓ Richtig!' : `Die gesuchte Form ist ${esc(rule.label)}.`}</div><div class="grammar-formula">${esc(rule.formula)}</div><p>${esc(rule.explain)}</p>${q.sentence ? `<div class="grammar-example">${esc(q.before)}<strong>${esc(rule.label)}</strong>${esc(q.after)}</div>` : ''}<p class="muted small-note">${esc(rule.caution)}</p><button class="btn primary big" id="grammar-next">${index + 1 === selected.length ? 'Auswertung ansehen' : 'Nächste Formel'}</button>`;
    $('#grammar-next', root).onclick = () => { index++; index < selected.length ? show() : finish(); };
    $('#grammar-next', root).focus({ preventScroll: true });
  }

  function finish() {
    const right = results.filter(r => r.correct).length;
    const missed = [...new Set(results.filter(r => !r.correct).map(r => r.rule))];
    $('#grammar-score', root).textContent = '';
    $('#grammar-progress .bar span', root).style.width = '100%';
    host.innerHTML = `<div class="grammar-finish"><h2>${right === results.length ? 'Das Muster sitzt schon besser.' : 'Ein Muster nach dem anderen.'}</h2><p>${right} von ${results.length} richtig</p>${missed.length ? `<div class="sub-title">Diese Formeln nochmal anschauen</div><div class="grammar-jumps">${missed.map(id => `<a href="#/grammar/${id}">${esc(grammarRule(id).label)}</a>`).join('')}</div>` : ''}<div class="row-btns col"><button class="btn primary" id="grammar-again">Nochmal üben</button><a class="btn" href="#/grammar">Zu meinem Lernprofil</a><a class="btn ghost" href="#/sentences">Weiter mit ganzen Sätzen</a></div></div>`;
    $('#grammar-again', root).onclick = () => go(`#/grammar/practice?source=${source}&topic=${topic}`);
    host.scrollIntoView({ block: 'start' });
  }
  show();
}
