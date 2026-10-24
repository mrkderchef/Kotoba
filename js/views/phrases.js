import { save, deckOn, setDeck } from '../store.js';
import { SITUATIONS } from '../../data/phrases.js';
import { phraseItems, itemStatus, STATUS_LABEL } from '../cards.js';
import { counts } from '../srs.js';
import { header, esc, $, go, bar, speakBtn, romajiHtml, toast } from '../ui.js';

function toggle(key, label = 'Aktiv') {
  return `<label class="switch" title="Sätze dieser Situation in die tägliche Wiederholung aufnehmen"><input type="checkbox" data-deck="${key}" ${deckOn(key) ? 'checked' : ''}><span></span><small>${label}</small></label>`;
}

function bindToggles(root) {
  root.addEventListener('change', e => {
    const k = e.target.dataset?.deck;
    if (!k) return;
    setDeck(k, e.target.checked);
    save();
    toast(e.target.checked ? 'Aktiviert – die Sätze kommen in deine tägliche Wiederholung' : 'Pausiert');
  });
}

export function renderOverview(root) {
  const c = counts(['phrase']);
  const items = phraseItems();
  root.innerHTML = `
    ${header('Phrasen')}
    <main class="page">
      <section class="card daily">
        <div class="due-grid two">
          <div class="due"><b>${c.due}</b><span>fällig</span><small>Wiederholen</small></div>
          <div class="due"><b>${c.new}</b><span>neu</span><small>heute</small></div>
        </div>
        <a class="btn primary wide" href="#/review/phrase" ${c.due + c.new ? '' : 'aria-disabled="true"'}>Phrasen lernen</a>
        <p class="muted small-note">Schalte die Situationen ein, die du gerade brauchst. Sätze, die <b>du sagst</b>, werden Deutsch → Japanisch abgefragt; Sätze, die du <b>hörst 👂</b>, Japanisch → Deutsch.</p>
      </section>
      <ul class="sits">
        ${SITUATIONS.map(s => {
          const its = items.filter(i => i.cat === s.id);
          const learned = its.filter(i => ['young', 'mature'].includes(itemStatus(i))).length;
          return `<li class="sit ${deckOn(`p:${s.id}`) ? 'active' : ''}">
            <a href="#/phrases/${s.id}" class="sit-main">
              <span class="sit-emoji">${s.emoji}</span>
              <span class="cat-info"><b>${esc(s.title)}</b>${bar(learned / its.length)}<small>${learned}/${its.length} Sätze gelernt</small></span>
            </a>
            ${toggle(`p:${s.id}`)}
          </li>`;
        }).join('')}
      </ul>
    </main>`;
  bindToggles(root);
}

export function renderSituation(root, [id]) {
  const sit = SITUATIONS.find(s => s.id === id);
  if (!sit) return go('#/phrases');
  const items = phraseItems().filter(i => i.cat === id);
  root.innerHTML = `
    ${header(`${sit.emoji} ${esc(sit.title)}`, '#/phrases')}
    <main class="page">
      <div class="tip">💡 ${esc(sit.tip)}</div>
      <div class="cat-bar">
        ${toggle(`p:${id}`, 'In täglicher Wiederholung')}
        <a class="btn small" href="#/cram/phrase/${id}">Üben (frei)</a>
      </div>
      <label class="switch hide-toggle"><input type="checkbox" id="hide"><span></span><small>Übersetzung verdecken (antippen zum Aufdecken)</small></label>
      <ul class="phrases" id="list">
        ${items.map(i => `
          <li class="phrase ${i.heard ? 'heard' : ''}">
            <div class="who">${i.heard ? '👂 Du hörst' : '🗣 Du sagst'} <span class="st st-${itemStatus(i)}">${STATUS_LABEL[itemStatus(i)]}</span></div>
            <div class="p-jp jp">${esc(i.w)} ${speakBtn(i.k)}</div>
            ${i.k !== i.w ? `<div class="p-kana jp">${esc(i.k)}</div>` : ''}
            <div class="cover">
              ${romajiHtml(i.ro)}
              <div class="p-de">${esc(i.de)}</div>
              ${i.note ? `<div class="note">${esc(i.note)}</div>` : ''}
            </div>
          </li>`).join('')}
      </ul>
    </main>`;
  bindToggles(root);
  const list = $('#list', root);
  $('#hide', root).addEventListener('change', e => {
    list.classList.toggle('hiding', e.target.checked);
    list.querySelectorAll('.phrase').forEach(p => p.classList.remove('shown'));
  });
  list.addEventListener('click', e => {
    if (e.target.closest('[data-speak]')) return;
    const p = e.target.closest('.phrase');
    if (p && list.classList.contains('hiding')) p.classList.toggle('shown');
  });
}
