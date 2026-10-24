import { state, local, saveLocal, save, deckOn, setDeck, addCustom, deleteCustom } from '../store.js';
import { VOCAB } from '../../data/vocab.js';
import { vocabItems, kanjiItems, customItems, itemStatus, STATUS_LABEL } from '../cards.js';
import { counts } from '../srs.js';
import { toRomaji, toHiragana, hasKana } from '../romaji.js';
import { header, esc, $, $$, go, bar, speakBtn, romajiHtml, toast } from '../ui.js';

function statusBadge(item) {
  const s = itemStatus(item);
  return `<span class="st st-${s}">${STATUS_LABEL[s]}</span>`;
}

export function wordRow(item) {
  const showKana = item.w !== item.k;
  return `<li class="word">
    <div class="w-jp"><span class="jp w">${esc(item.w)}</span>${showKana ? `<span class="jp k">${esc(item.k)}</span>` : ''}</div>
    <div class="w-de">${esc(item.de)}${romajiHtml(item.ro)}${item.note ? `<div class="note">${esc(item.note)}</div>` : ''}</div>
    <div class="w-side">${statusBadge(item)}${speakBtn(item.k)}</div>
  </li>`;
}

function kanjiRow(item) {
  return `<li class="word kanji-row">
    <div class="w-jp"><span class="jp w kanji-w">${item.w}</span></div>
    <div class="w-de"><b>${esc(item.de)}</b>
      <div class="readings"><span><small>On</small> <span class="jp">${item.on}</span> ${state.settings.showRomaji ? `<i>${item.onRo}</i>` : ''}</span>
      <span><small>Kun</small> <span class="jp">${item.kun}</span> ${state.settings.showRomaji && item.kunRo ? `<i>${item.kunRo}</i>` : ''}</span></div>
      <div class="note"><span class="jp">${item.ex}</span> (<span class="jp">${item.exk}</span>${state.settings.showRomaji ? ` · ${item.exRo}` : ''}) – ${esc(item.exde)}</div>
    </div>
    <div class="w-side">${statusBadge(item)}${speakBtn(item.exk)}</div>
  </li>`;
}

function toggle(key, label = 'Aktiv') {
  return `<label class="switch" title="Neue Karten aus diesem Deck lernen"><input type="checkbox" data-deck="${key}" ${deckOn(key) ? 'checked' : ''}><span></span><small>${label}</small></label>`;
}

function bindToggles(root) {
  root.addEventListener('change', e => {
    const k = e.target.dataset?.deck;
    if (!k) return;
    setDeck(k, e.target.checked);
    save();
    toast(e.target.checked ? 'Aktiviert – neue Karten kommen in die tägliche Wiederholung' : 'Pausiert – keine Karten mehr aus diesem Deck');
  });
}

export function renderOverview(root, _, q) {
  const tab = q.tab || local.vocabTab || 'cats';
  local.vocabTab = tab; saveLocal();
  const cv = counts(['vocab', 'custom']);
  const ck = counts(['kanji']);
  const vItems = vocabItems();
  const cItems = customItems();

  let body = '';
  if (tab === 'cats') {
    body = `<ul class="cats">${VOCAB.map(cat => {
      const items = vItems.filter(i => i.cat === cat.id);
      const learned = items.filter(i => ['young', 'mature'].includes(itemStatus(i))).length;
      return `<li class="cat">
        <a href="#/vocab/cat/${cat.id}" class="cat-main">
          <span class="cat-emoji">${cat.emoji}</span>
          <span class="cat-info"><b>${esc(cat.title)}</b>${bar(learned / items.length)}<small>${learned}/${items.length} gelernt</small></span>
        </a>
        ${toggle(`v:${cat.id}`)}
      </li>`;
    }).join('')}</ul>`;
  } else if (tab === 'kanji') {
    const ks = kanjiItems();
    const learned = ks.filter(i => ['young', 'mature'].includes(itemStatus(i))).length;
    body = `
      <div class="kanji-head">
        <div><b>Kanji N5</b> · ${learned}/${ks.length} gelernt<br><small class="muted">Die ~100 Kanji der ersten Prüfungsstufe (JLPT N5), mit Lesungen und Beispiel.</small></div>
        ${toggle('kanji')}
      </div>
      <div class="kanji-grid">${ks.map(k => `<button class="kt st-${itemStatus(k)} jp" data-k="${k.w}" title="${esc(k.de)}">${k.w}</button>`).join('')}</div>
      <div id="kdetail"></div>`;
  } else {
    body = `
      <div class="kanji-head"><div><b>Eigene Vokabeln</b> · ${cItems.length}<br><small class="muted">Wörter, die dir im Alltag begegnen.</small></div>${toggle('custom')}</div>
      <a class="btn primary wide" href="#/vocab/add">+ Neue Vokabel</a>
      ${cItems.length ? `<ul class="words">${cItems.map(i => wordRow(i).replace('</li>', `<button class="del" data-del="${i.id}" title="Löschen">🗑</button></li>`)).join('')}</ul>`
        : '<p class="muted center">Noch keine eigenen Wörter.</p>'}`;
  }

  root.innerHTML = `
    ${header('Vokabeln')}
    <main class="page">
      <section class="card daily">
        <div class="due-grid two">
          <div class="due"><b>${cv.due}</b><span>fällig</span><em>+${cv.new} neu</em><small>Vokabeln</small></div>
          <div class="due"><b>${ck.due}</b><span>fällig</span><em>+${ck.new} neu</em><small>Kanji</small></div>
        </div>
        <div class="row-btns">
          <a class="btn primary" href="#/review/vocab,custom" ${cv.due + cv.new ? '' : 'aria-disabled="true"'}>Vokabeln lernen</a>
          <a class="btn" href="#/review/kanji" ${ck.due + ck.new ? '' : 'aria-disabled="true"'}>Kanji lernen</a>
        </div>
        ${!deckOn('kanji') ? '<p class="muted small-note">Kanji sind noch pausiert – aktiviere sie im Tab „Kanji“, wenn du so weit bist.</p>' : ''}
      </section>
      <input class="search" id="search" type="search" placeholder="Suchen: 駅, eki, Bahnhof …" autocomplete="off" autocapitalize="off">
      <div id="results"></div>
      <div id="tabbed">
        <div class="seg">
          <a href="#/vocab?tab=cats" class="${tab === 'cats' ? 'on' : ''}">Kategorien</a>
          <a href="#/vocab?tab=kanji" class="${tab === 'kanji' ? 'on' : ''}">Kanji</a>
          <a href="#/vocab?tab=custom" class="${tab === 'custom' ? 'on' : ''}">Eigene</a>
        </div>
        ${body}
      </div>
    </main>`;

  bindToggles(root);

  // Suche
  const all = [...vItems, ...cItems, ...kanjiItems()];
  const search = $('#search', root), results = $('#results', root), tabbed = $('#tabbed', root);
  search.addEventListener('input', () => {
    const s = search.value.trim().toLowerCase();
    tabbed.hidden = !!s;
    if (!s) { results.innerHTML = ''; return; }
    const hira = toHiragana(s);
    const hits = all.filter(i => [i.w, i.k, i.ro, i.de, i.on, i.kun, i.onRo, i.kunRo].some(f => f && String(f).toLowerCase().includes(s)) || (hasKana(hira) && i.k && i.k.includes(hira))).slice(0, 60);
    results.innerHTML = hits.length ? `<ul class="words">${hits.map(i => (i.kind === 'kanji' ? kanjiRow(i) : wordRow(i))).join('')}</ul>` : '<p class="muted center">Nichts gefunden.</p>';
  });

  // Kanji-Details
  const grid = $('.kanji-grid', root);
  if (grid) grid.addEventListener('click', e => {
    const b = e.target.closest('[data-k]');
    if (!b) return;
    const item = kanjiItems().find(k => k.w === b.dataset.k);
    $$('.kt', grid).forEach(x => x.classList.toggle('sel', x === b));
    $('#kdetail', root).innerHTML = `<ul class="words">${kanjiRow(item)}</ul>`;
    $('#kdetail', root).scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // Eigene löschen
  root.addEventListener('click', e => {
    const d = e.target.closest('[data-del]');
    if (!d) return;
    if (!confirm('Diese Vokabel löschen?')) return;
    deleteCustom(d.dataset.del);
    save();
    go('#/vocab?tab=custom');
  });
}

export function renderCategory(root, [id]) {
  const cat = VOCAB.find(c => c.id === id);
  if (!cat) return go('#/vocab');
  const items = vocabItems().filter(i => i.cat === id);
  root.innerHTML = `
    ${header(`${cat.emoji} ${esc(cat.title)}`, '#/vocab')}
    <main class="page">
      <div class="cat-bar">
        ${toggle(`v:${id}`, 'In täglicher Wiederholung')}
        <a class="btn small" href="#/cram/vocab/${id}">Üben (frei)</a>
      </div>
      <ul class="words">${items.map(wordRow).join('')}</ul>
    </main>`;
  bindToggles(root);
}

export function renderAdd(root) {
  root.innerHTML = `
    ${header('Neue Vokabel', '#/vocab?tab=custom')}
    <main class="page">
      <form class="card form" id="f">
        <label>Lesung (Kana) *<input name="k" required placeholder="z. B. えき – oder Romaji tippen: eki" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></label>
        <div class="preview muted" id="pv"></div>
        <label>Schreibweise mit Kanji <small class="muted">(optional)</small><input name="w" placeholder="z. B. 駅" autocomplete="off"></label>
        <label>Deutsch *<input name="de" required placeholder="z. B. Bahnhof" autocomplete="off"></label>
        <label>Notiz <small class="muted">(optional)</small><input name="note" placeholder="z. B. gesehen am Schild in Shibuya" autocomplete="off"></label>
        <button class="btn primary big" type="submit">Speichern</button>
        <p class="muted small-note">Tipp: Romaji werden beim Verlassen des Felds automatisch in Hiragana umgewandelt. Für Katakana nutze die japanische Tastatur.</p>
      </form>
    </main>`;
  const f = $('#f', root), pv = $('#pv', root);
  const kIn = f.elements.k;
  const upd = () => { pv.textContent = kIn.value ? `Romaji: ${toRomaji(kIn.value)}` : ''; };
  kIn.addEventListener('blur', () => { if (/[a-z]/i.test(kIn.value)) kIn.value = toHiragana(kIn.value); upd(); });
  kIn.addEventListener('input', upd);
  f.addEventListener('submit', e => {
    e.preventDefault();
    if (/[a-z]/i.test(kIn.value)) kIn.value = toHiragana(kIn.value);
    const k = kIn.value.trim(), w = f.elements.w.value.trim() || k, de = f.elements.de.value.trim();
    if (!k || !de) return;
    addCustom({ k, w, de, note: f.elements.note.value.trim() });
    save();
    toast(`„${w}“ gespeichert`);
    f.reset(); upd(); kIn.focus();
  });
}
