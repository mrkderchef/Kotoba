import { state, local, streak, dayKey, dayActivity, section, kanaStats } from '../store.js';
import { counts, learnedCount } from '../srs.js';
import { KANA, KANA_BY_CHAR } from '../../data/kana.js';
import { syncEnabled } from '../sync.js';
import { header, bar, esc } from '../ui.js';

const KINDS = ['vocab', 'custom', 'kanji', 'phrase'];

function greeting() {
  const h = new Date().getHours();
  if (h >= 4 && h < 11) return ['おはよう！', 'ohayou – Guten Morgen'];
  if (h >= 11 && h < 18) return ['こんにちは！', 'konnichiwa – Hallo'];
  return ['こんばんは！', 'konbanwa – Guten Abend'];
}

export function kanaProgress(script) {
  const rows = KANA[script].flatMap(g => g.rows);
  const passed = rows.filter(r => section(r.id).passed).length;
  const next = rows.find(r => !section(r.id).learned) || rows.find(r => !section(r.id).passed);
  return { rows, passed, total: rows.length, next };
}

function heatmap() {
  const weeks = 16;
  const now = new Date(Date.now() - 4 * 3600 * 1000);
  const dow = (now.getDay() + 6) % 7; // Montag = 0
  const start = Date.now() - (weeks * 7 - 7 + dow) * 86400000;
  const vals = [];
  for (let i = 0; i < weeks * 7; i++) {
    const t = start + i * 86400000;
    const future = i > (weeks - 1) * 7 + dow;
    vals.push(future ? null : { k: dayKey(t), n: dayActivity(dayKey(t)) });
  }
  const max = Math.max(10, ...vals.filter(Boolean).map(v => v.n));
  const lvl = n => (n === 0 ? 0 : n < max * 0.25 ? 1 : n < max * 0.5 ? 2 : n < max * 0.75 ? 3 : 4);
  let cells = '';
  for (let w = 0; w < weeks; w++) {
    cells += '<div class="hm-col">';
    for (let d = 0; d < 7; d++) {
      const v = vals[w * 7 + d];
      cells += v ? `<i class="l${lvl(v.n)}" title="${v.k}: ${v.n}"></i>` : '<i class="empty"></i>';
    }
    cells += '</div>';
  }
  return `<div class="heatmap">${cells}</div>`;
}

export function render(root) {
  const [jp, sub] = greeting();
  const c = counts(KINDS);
  const total = c.due + c.new;
  const cv = counts(['vocab', 'custom']), ck = counts(['kanji']), cp = counts(['phrase']);
  const h = kanaProgress('h'), k = kanaProgress('k');
  const s = streak();
  const todayN = dayActivity(dayKey());

  const weak = Object.keys(state.kana)
    .map(ch => ({ ch, ...kanaStats(ch) }))
    .filter(x => x.n >= 2 && x.w > 0 && KANA_BY_CHAR[x.ch])
    .sort((a, b) => b.w / b.n - a.w / a.n || b.w - a.w)
    .slice(0, 10);

  const learnedRows = [...h.rows, ...k.rows].filter(r => section(r.id).learned).map(r => r.id);

  root.innerHTML = `
    ${header('Kotoba')}
    <main class="page">
      <section class="hero">
        <div>
          <div class="hello jp">${jp}</div>
          <div class="muted">${sub}</div>
        </div>
        <div class="streak ${s ? '' : 'zero'}" title="Tage in Folge gelernt"><span>🔥</span><b>${s}</b><small>${s === 1 ? 'Tag' : 'Tage'}</small></div>
      </section>

      <section class="card daily">
        <div class="card-title">Heute</div>
        <div class="due-grid">
          <a href="#/vocab" class="due"><b>${cv.due}</b><span>fällig</span><em>+${cv.new} neu</em><small>Vokabeln</small></a>
          <a href="#/vocab?tab=kanji" class="due"><b>${ck.due}</b><span>fällig</span><em>+${ck.new} neu</em><small>Kanji</small></a>
          <a href="#/phrases" class="due"><b>${cp.due}</b><span>fällig</span><em>+${cp.new} neu</em><small>Phrasen</small></a>
        </div>
        ${total
          ? `<a class="btn primary big" href="#/review/${KINDS.join(',')}">Tägliche Wiederholung · ${total} Karten</a>`
          : `<div class="done">✨ Alles erledigt für heute! ${todayN ? `(${todayN} Antworten)` : ''}</div>`}
      </section>

      <section class="card">
        <div class="card-title">Kana</div>
        <div class="kana-prog">
          <a href="#/kana/h" class="kp"><span class="jp">あ</span><div><b>Hiragana</b>${bar(h.passed / h.total)}<small>${h.passed}/${h.total} Abschnitte bestanden</small></div></a>
          <a href="#/kana/k" class="kp"><span class="jp">ア</span><div><b>Katakana</b>${bar(k.passed / k.total)}<small>${k.passed}/${k.total} Abschnitte bestanden</small></div></a>
        </div>
        <div class="row-btns">
          ${h.next ? `<a class="btn" href="#/kana/learn/${h.next.id}">Weiter: ${esc(h.next.label)} (あ)</a>`
            : k.next ? `<a class="btn" href="#/kana/learn/${k.next.id}">Weiter: ${esc(k.next.label)} (ア)</a>` : ''}
          ${learnedRows.length ? `<a class="btn" href="#/kana/test?rows=${learnedRows.join(',')}&n=20&title=Schnelltest">⚡ Schnelltest</a>` : ''}
        </div>
        ${weak.length ? `
          <div class="sub-title">Deine Schwachstellen</div>
          <div class="weak">${weak.map(w => `<span class="jp" title="${w.w}× falsch von ${w.n}">${w.ch}</span>`).join('')}</div>
          <a class="btn small" href="#/kana/test?chars=${encodeURIComponent(weak.map(w => w.ch).join(','))}&rep=2&title=Schwachstellen">Schwachstellen üben</a>` : ''}
      </section>

      <section class="card">
        <div class="card-title">Fortschritt</div>
        <div class="stats">
          <div><b>${learnedCount('vocab') + learnedCount('custom')}</b><small>Vokabeln</small></div>
          <div><b>${learnedCount('kanji')}</b><small>Kanji</small></div>
          <div><b>${learnedCount('phrase')}</b><small>Phrasen</small></div>
        </div>
        ${heatmap()}
      </section>

      <p class="foot muted">${syncEnabled()
        ? (local.lastSyncError ? `⚠️ Sync: ${esc(local.lastSyncError)}` : `☁️ Synchronisiert ${local.lastSync ? new Date(local.lastSync).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' }) : '…'}`)
        : '<a href="#/settings">☁️ Sync zwischen iPhone & Mac einrichten</a>'}</p>
    </main>`;
}
