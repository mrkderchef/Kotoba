import { state, local, save, saveLocal, setSetting, merge, replaceState, exportJSON, DEFAULT_SETTINGS } from '../store.js';
import { syncNow, disconnect, syncEnabled, onSyncStatus } from '../sync.js';
import { japaneseVoices, speak, canSpeak } from '../speech.js';
import { toHiragana, hiraToKata } from '../romaji.js';
import { header, esc, $, toast, go } from '../ui.js';

const num = (k, label, min, max) => `<label class="set-row"><span>${label}</span><input type="number" inputmode="numeric" min="${min}" max="${max}" data-num="${k}" value="${state.settings[k]}"></label>`;
const sw = (k, label, sub = '') => `<label class="set-row"><span>${label}${sub ? `<small>${sub}</small>` : ''}</span><span class="switch"><input type="checkbox" data-bool="${k}" ${state.settings[k] ? 'checked' : ''}><span></span></span></label>`;
const sel = (k, label, opts) => `<label class="set-row"><span>${label}</span><select data-sel="${k}">${Object.entries(opts).map(([v, n]) => `<option value="${v}" ${state.settings[k] === v ? 'selected' : ''}>${n}</option>`).join('')}</select></label>`;

function syncBlock() {
  if (!syncEnabled()) {
    return `
      <p>Synchronisiert deinen Fortschritt zwischen iPhone und Mac über ein <b>privates GitHub Gist</b> (kostenlos, kein eigener Server nötig).</p>
      <ol class="steps">
        <li>Auf GitHub einloggen (oder kostenlos registrieren).</li>
        <li><a href="https://github.com/settings/tokens/new?scopes=gist&description=Kotoba%20Sync" target="_blank" rel="noopener">Hier einen Token erstellen</a> – nur das Häkchen <b>„gist“</b>, Ablauf: <i>No expiration</i>.</li>
        <li>Token unten einfügen – auf <b>beiden Geräten</b> denselben.</li>
      </ol>
      <div class="inline-form">
        <input type="password" id="token" placeholder="ghp_…" autocomplete="off" autocapitalize="off" spellcheck="false">
        <button class="btn primary" id="connect">Verbinden</button>
      </div>`;
  }
  return `
    <p class="sync-state" id="syncState">${local.lastSyncError ? `⚠️ ${esc(local.lastSyncError)}` : local.lastSync ? `✅ Zuletzt synchronisiert: ${new Date(local.lastSync).toLocaleString('de-DE')}` : '…'}</p>
    <p class="muted small-note">Gist-ID: <code>${esc(local.gistId || '–')}</code></p>
    <div class="row-btns">
      <button class="btn primary" id="syncNow">Jetzt synchronisieren</button>
      <button class="btn ghost" id="disconnect">Trennen</button>
    </div>
    <p class="muted small-note">Synchronisiert automatisch beim Öffnen, nach dem Lernen und beim Schließen der App.</p>`;
}

export function render(root) {
  const voices = japaneseVoices();
  root.innerHTML = `
    ${header('Einstellungen', '#/')}
    <main class="page settings">
      <section class="card">
        <div class="card-title">Lernen</div>
        ${num('newVocab', 'Neue Vokabeln pro Tag', 0, 100)}
        ${num('newKanji', 'Neue Kanji pro Tag', 0, 50)}
        ${num('newPhrases', 'Neue Phrasen pro Tag', 0, 50)}
        ${num('maxReviews', 'Max. Wiederholungen pro Tag', 10, 9999)}
        ${sw('vocabReverse', 'Vokabeln auch Deutsch → Japanisch', 'Zusätzliche Karte, sobald die normale sitzt')}
        ${sw('phraseReverse', 'Phrasen in beide Richtungen')}
        ${sw('showRomaji', 'Romaji anzeigen', 'Später ausschalten, um Kana zu festigen')}
        ${sw('autoSpeak', 'Automatisch vorlesen')}
      </section>

      <section class="card">
        <div class="card-title">Dein Name (für Phrasen)</div>
        <label class="set-row"><span>Romaji</span><input id="nameRo" value="${esc(state.settings.nameRomaji)}" placeholder="z. B. Mareku" autocapitalize="off"></label>
        <label class="set-row"><span>Katakana</span><input id="nameKa" value="${esc(state.settings.nameKana)}" placeholder="z. B. マレク" class="jp"></label>
        <p class="muted small-note">Tipp: Romaji eingeben, Katakana wird vorgeschlagen. Namen werden an die japanische Aussprache angepasst (Max → マックス).</p>
      </section>

      <section class="card">
        <div class="card-title">Aussehen & Stimme</div>
        ${sel('theme', 'Design', { auto: 'Automatisch', light: 'Hell', dark: 'Dunkel' })}
        ${sel('kanaFont', 'Schrift für Kana', { sans: 'Gothic (modern)', serif: 'Mincho (Buch)', hand: 'Handschrift' })}
        ${canSpeak() ? `
          <label class="set-row"><span>Stimme</span><select id="voice">${voices.length ? voices.map(v => `<option value="${esc(v.voiceURI)}" ${v.voiceURI === local.voiceURI ? 'selected' : ''}>${esc(v.name)}</option>`).join('') : '<option>Standard (ja-JP)</option>'}</select></label>
          <label class="set-row"><span>Tempo</span><input type="range" id="rate" min="0.5" max="1.3" step="0.05" value="${local.rate}"></label>
          <button class="btn small" id="testVoice">🔊 Testen: こんにちは</button>
          <p class="muted small-note">Bessere Stimmen: iPhone/Mac → Einstellungen → Bedienungshilfen → Gesprochene Inhalte → Stimmen → Japanisch (z. B. „Kyoko (Premium)“ laden).</p>` : '<p class="muted">Sprachausgabe wird in diesem Browser nicht unterstützt.</p>'}
      </section>

      <section class="card">
        <div class="card-title">☁️ Sync iPhone ⇄ Mac</div>
        <div id="sync">${syncBlock()}</div>
      </section>

      <section class="card">
        <div class="card-title">📲 Als App installieren</div>
        <p><b>iPhone:</b> In Safari öffnen → Teilen-Symbol <span class="kbd">⎋</span> → <b>„Zum Home-Bildschirm“</b>.</p>
        <p><b>Mac:</b> In Safari öffnen → Menü <b>Ablage → „Zum Dock hinzufügen…“</b>. Danach startet Kotoba wie eine normale App aus Dock/Launchpad – auch offline.</p>
      </section>

      <section class="card">
        <div class="card-title">Backup</div>
        <div class="row-btns">
          <button class="btn" id="export">Exportieren (.json)</button>
          <label class="btn">Importieren<input type="file" id="import" accept="application/json,.json" hidden></label>
        </div>
        <p class="muted small-note">Beim Import wird zusammengeführt – es geht nichts verloren.</p>
        <button class="btn danger small" id="reset">Gesamten Fortschritt löschen</button>
      </section>
      <p class="foot muted">Kotoba 言葉 · nur für dich · Daten bleiben auf deinen Geräten${syncEnabled() ? ' und in deinem privaten Gist' : ''}.</p>
    </main>`;

  root.addEventListener('change', e => {
    const t = e.target;
    if (t.dataset.num) {
      const v = Math.max(+t.min, Math.min(+t.max, parseInt(t.value, 10) || 0));
      t.value = v; setSetting(t.dataset.num, v); save();
    } else if (t.dataset.bool) {
      setSetting(t.dataset.bool, t.checked); save();
    } else if (t.dataset.sel) {
      setSetting(t.dataset.sel, t.value); save();
    }
  });

  const nameRo = $('#nameRo', root), nameKa = $('#nameKa', root);
  nameRo.addEventListener('change', () => {
    setSetting('nameRomaji', nameRo.value.trim());
    if (!nameKa.value.trim() && nameRo.value.trim()) {
      nameKa.value = hiraToKata(toHiragana(nameRo.value.trim().toLowerCase()));
      setSetting('nameKana', nameKa.value);
    }
    save();
  });
  nameKa.addEventListener('change', () => { setSetting('nameKana', nameKa.value.trim()); save(); });

  const voice = $('#voice', root);
  if (voice) voice.onchange = () => { local.voiceURI = voice.value; saveLocal(); speak('こんにちは'); };
  const rate = $('#rate', root);
  if (rate) rate.onchange = () => { local.rate = +rate.value; saveLocal(); speak('こんにちは'); };
  const tv = $('#testVoice', root);
  if (tv) tv.onclick = () => speak('こんにちは。日本語を勉強しています。');

  // Sync
  const syncEl = $('#sync', root);
  syncEl.addEventListener('click', async e => {
    const id = e.target.id;
    if (id === 'connect') {
      const token = $('#token', root).value.trim();
      if (!token) return;
      local.token = token; saveLocal();
      e.target.disabled = true; e.target.textContent = 'Verbinde …';
      await syncNow();
      if (local.lastSyncError) { toast(local.lastSyncError, 4000); local.token = ''; saveLocal(); }
      else toast('Verbunden! ☁️');
      syncEl.innerHTML = syncBlock();
    } else if (id === 'syncNow') {
      e.target.disabled = true;
      await syncNow();
      toast(local.lastSyncError ? local.lastSyncError : 'Synchronisiert ✅');
      syncEl.innerHTML = syncBlock();
    } else if (id === 'disconnect') {
      if (!confirm('Sync auf diesem Gerät trennen? (Dein Fortschritt bleibt erhalten.)')) return;
      disconnect();
      syncEl.innerHTML = syncBlock();
    }
  });
  const off = onSyncStatus(s => { const st = $('#syncState', root); if (st && s === 'syncing') st.textContent = '🔄 Synchronisiere …'; });

  // Backup
  $('#export', root).onclick = () => {
    const blob = new Blob([exportJSON()], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `kotoba-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  $('#import', root).onchange = async e => {
    const f = e.target.files[0];
    if (!f) return;
    try {
      const data = JSON.parse(await f.text());
      if (!data.srs) throw new Error();
      replaceState(merge(state, data));
      toast('Backup importiert ✅');
      go('#/');
    } catch { toast('Ungültige Backup-Datei'); }
  };
  $('#reset', root).onclick = () => {
    if (!confirm('Wirklich ALLEN Fortschritt löschen? Das kann nicht rückgängig gemacht werden.')) return;
    if (syncEnabled() && !confirm('Achtung: Sync ist aktiv. Der Fortschritt auf deinen anderen Geräten wird beim nächsten Sync wieder hierher übertragen. Trotzdem lokal löschen?')) return;
    replaceState({ settings: { ...DEFAULT_SETTINGS, u: Date.now() } });
    toast('Zurückgesetzt');
    go('#/');
  };
  return off;
}
