// Lern-Erinnerung: läuft stündlich in GitHub Actions.
// Liest den Fortschritt aus dem Sync-Gist und schickt eine Push-Nachricht an jedes Gerät,
// auf dem die Erinnerung aktiv ist – aber nur, wenn heute noch nicht gelernt wurde.
import { fileURLToPath } from 'node:url';
import { reminderMessage } from '../js/reminder-text.js';

const SYNC_FILE = 'kotoba-sync.json';
const LOG_FILE = 'kotoba-push.json';
const VAPID_PUBLIC = 'BHRtyRYo6gLxv2T3KFuHjo6qo6bTMmQ79plbiEa0ePPVcYCEbqx--UZzIeOgOPcaRlTtUBBTSdxrOSlN6GEzC4o';
const APP_URL = 'https://mrkderchef.github.io/Kotoba/';

// Wie in der App: Tageswechsel um 4 Uhr, in der Zeitzone des Geräts
export function localDay(now, tz) {
  const fmt = t => Object.fromEntries(new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hourCycle: 'h23' })
    .formatToParts(t).map(p => [p.type, p.value]));
  const shifted = fmt(new Date(now - 4 * 3600e3));
  const key = `${shifted.year}-${shifted.month}-${shifted.day}`;
  return { key, num: Math.round(Date.UTC(+shifted.year, +shifted.month - 1, +shifted.day) / 86400000), hour: +fmt(new Date(now)).hour };
}

function activity(state, key) {
  const day = state.daily?.[key];
  if (!day) return 0;
  return Object.values(day).reduce((s, d) => s + (d.r || 0) + (d.k || 0) + (d.x || 0), 0);
}

function shiftKey(key, days) {
  const d = new Date(`${key}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function streakBefore(state, key) {
  let n = 0;
  for (let k = shiftKey(key, -1); activity(state, k) > 0; k = shiftKey(k, -1)) n++;
  return n;
}

export function dueCount(state, dayNum) {
  return Object.values(state.srs || {}).filter(c => c.d <= dayNum).length;
}

export function message(state, day) {
  const tone = state.settings?.reminderTone === 'nice' ? 'nice' : 'roast';
  return { ...reminderMessage({ due: dueCount(state, day.num), streak: streakBefore(state, day.key), tone }), url: APP_URL };
}

// Wer bekommt jetzt eine Nachricht?
export function decide(state, log, now, force = false) {
  const out = [];
  for (const [dev, p] of Object.entries(state.push || {})) {
    if (!p.on || !p.sub?.endpoint) continue;
    const day = localDay(now, p.tz || 'Asia/Tokyo');
    if (!force) {
      if (day.hour < (p.hour ?? 20)) continue;  // noch zu früh
      if (day.hour < 4) continue;               // nach Mitternacht nicht mehr stören
      if (log[dev] === day.key) continue;       // heute schon erinnert
      if (activity(state, day.key) > 0) continue; // heute schon gelernt 👍
    }
    out.push({ dev, sub: p.sub, day, payload: message(state, day) });
  }
  return out;
}

async function main() {
  const token = process.env.GIST_TOKEN;
  const vapidPrivate = process.env.VAPID_PRIVATE_KEY;
  const force = process.env.FORCE === 'true';
  if (!token || !vapidPrivate) {
    console.log('Secrets GIST_TOKEN / VAPID_PRIVATE_KEY fehlen – Erinnerung noch nicht eingerichtet.');
    return;
  }
  const gh = async (path, opts = {}) => {
    const res = await fetch('https://api.github.com' + path, {
      ...opts,
      headers: { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
    });
    if (!res.ok) throw new Error(`GitHub ${res.status}: ${await res.text()}`);
    return res.json();
  };
  const readFile = async f => {
    if (!f) return null;
    const text = f.truncated ? await (await fetch(f.raw_url, { headers: { Authorization: `Bearer ${token}` } })).text() : f.content;
    return JSON.parse(text);
  };

  let gistId = null;
  for (let page = 1; page <= 5 && !gistId; page++) {
    const list = await gh(`/gists?per_page=100&page=${page}`);
    gistId = list.find(g => g.files?.[SYNC_FILE])?.id;
    if (list.length < 100) break;
  }
  if (!gistId) { console.log('Kein Sync-Gist gefunden – ist der Sync in der App eingerichtet?'); return; }

  const gist = await gh(`/gists/${gistId}`);
  const state = await readFile(gist.files[SYNC_FILE]);
  const log = (await readFile(gist.files[LOG_FILE])) || {};
  const targets = decide(state, log, Date.now(), force);
  console.log(`${Object.values(state.push || {}).filter(p => p.on).length} Gerät(e) mit Erinnerung, ${targets.length} werden jetzt benachrichtigt.`);
  if (!targets.length) return;

  const { default: webpush } = await import('web-push');
  webpush.setVapidDetails(APP_URL, VAPID_PUBLIC, vapidPrivate);
  let changed = false;
  for (const t of targets) {
    try {
      await webpush.sendNotification(t.sub, JSON.stringify(t.payload), { TTL: 6 * 3600, urgency: 'normal' });
      console.log(`✓ ${t.dev}: ${t.payload.body}`);
    } catch (e) {
      console.log(`✗ ${t.dev}: ${e.statusCode || ''} ${e.body || e.message}`);
      if (e.statusCode !== 404 && e.statusCode !== 410) process.exitCode = 1;
    }
    if (!force) { log[t.dev] = t.day.key; changed = true; }
  }
  if (changed) {
    await gh(`/gists/${gistId}`, { method: 'PATCH', body: JSON.stringify({ files: { [LOG_FILE]: { content: JSON.stringify(log) } } }) });
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) await main();
