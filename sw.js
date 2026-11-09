// Offline-Unterstützung: Netzwerk zuerst (immer aktuell), bei Funkloch aus dem Cache.
const CACHE = 'kotoba-v6';
const CORE = [
  './',
  './index.html',
  './css/app.css',
  './manifest.webmanifest',
  './js/app.js',
  './js/cards.js',
  './js/push.js',
  './js/reminder-text.js',
  './js/romaji.js',
  './js/sentences.js',
  './js/speech.js',
  './js/srs.js',
  './js/store.js',
  './js/stories.js',
  './js/sync.js',
  './js/ui.js',
  './js/views/home.js',
  './js/views/kana.js',
  './js/views/phrases.js',
  './js/views/quiz.js',
  './js/views/sentences.js',
  './js/views/read.js',
  './js/views/review.js',
  './js/views/settings.js',
  './js/views/vocab.js',
  './data/kana.js',
  './data/phrases.js',
  './data/sentences.js',
  './data/stories/01.js',
  './data/stories/02.js',
  './data/stories/03.js',
  './data/stories/04.js',
  './data/stories/05.js',
  './data/stories/06.js',
  './data/stories.js',
  './data/vocab.js',
  './data/words.js',
  './icons/apple-touch-icon.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('kotoba-v') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

function timeout(ms) {
  return new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
}

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  e.respondWith((async () => {
    const cache = await caches.open(CACHE);
    const net = fetch(e.request, { cache: 'no-cache' }).then(res => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    });
    try {
      return await Promise.race([net, timeout(3000)]);
    } catch {
      const hit = await cache.match(e.request, { ignoreSearch: true }) ||
        (e.request.mode === 'navigate' ? await cache.match('./index.html') : null);
      if (hit) return hit;
      return net.catch(() => Response.error());
    }
  })());
});

// ---------- Lern-Erinnerung (Web Push) ----------
self.addEventListener('push', e => {
  let data = {};
  try { data = e.data ? e.data.json() : {}; } catch { data = { body: e.data && e.data.text() }; }
  e.waitUntil(self.registration.showNotification(data.title || 'Kotoba 言葉', {
    body: data.body || 'Zeit für deine tägliche Wiederholung!',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'kotoba-reminder',
    data: { url: data.url || './' },
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = new URL(e.notification.data?.url || './', self.registration.scope).href;
  e.waitUntil((async () => {
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    const w = wins.find(c => c.url.startsWith(self.registration.scope));
    if (w) { await w.focus(); return w.navigate ? w.navigate(url).catch(() => {}) : null; }
    return self.clients.openWindow(url);
  })());
});
