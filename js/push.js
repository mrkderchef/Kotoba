// Lern-Erinnerung per Web Push.
// Die App meldet sich hier an; das Senden übernimmt der GitHub-Actions-Job (scripts/reminder.mjs).
import { state, local, save } from './store.js';
import { syncNow, syncEnabled } from './sync.js';

const VAPID_PUBLIC = 'BHRtyRYo6gLxv2T3KFuHjo6qo6bTMmQ79plbiEa0ePPVcYCEbqx--UZzIeOgOPcaRlTtUBBTSdxrOSlN6GEzC4o';

export const pushSupported = () => 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;
export const isStandalone = () => matchMedia('(display-mode: standalone)').matches || navigator.standalone === true;
export const isIOS = () => /iPhone|iPad|iPod/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

export function myPush() {
  return state.push?.[local.deviceId];
}

function keyBytes(b64) {
  const s = (b64 + '='.repeat((4 - (b64.length % 4)) % 4)).replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

function store(entry) {
  state.push ||= {};
  state.push[local.deviceId] = { ...entry, u: Date.now() };
  save();
  if (syncEnabled()) syncNow();
}

// Muss aus einem Tipp/Klick heraus aufgerufen werden (iOS-Vorgabe)
export async function enablePush(hour) {
  if (!pushSupported()) throw new Error('Push wird hier nicht unterstützt.');
  const perm = await Notification.requestPermission();
  if (perm !== 'granted') throw new Error('Benachrichtigungen wurden nicht erlaubt. In den iPhone-Einstellungen → Mitteilungen → Kotoba kannst du das ändern.');
  const reg = await navigator.serviceWorker.ready;
  const sub = (await reg.pushManager.getSubscription()) ||
    (await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: keyBytes(VAPID_PUBLIC) }));
  store({ on: true, sub: sub.toJSON(), hour, tz: Intl.DateTimeFormat().resolvedOptions().timeZone, device: isIOS() ? 'iPhone' : 'Mac' });
}

export async function disablePush() {
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) await sub.unsubscribe();
  } catch {}
  store({ on: false });
}

export function setPushHour(hour) {
  const p = myPush();
  if (p?.on) store({ ...p, hour });
}

// Beim Start: falls das System die Anmeldung erneuert hat, neue Adresse speichern
export async function refreshPush() {
  const p = myPush();
  if (!p?.on || !pushSupported() || Notification.permission !== 'granted') return;
  try {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (!sub) return store({ ...p, on: false });
    if (sub.endpoint !== p.sub?.endpoint) store({ ...p, sub: sub.toJSON() });
  } catch {}
}

// Lokale Probe-Benachrichtigung (prüft nur die Erlaubnis, nicht den Versand über GitHub)
export async function testLocal() {
  const reg = await navigator.serviceWorker.ready;
  await reg.showNotification('Kotoba 言葉', { body: 'So sieht deine Erinnerung aus. がんばって！', icon: 'icons/icon-192.png', tag: 'kotoba-test' });
}
