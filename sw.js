// Offline-Unterstützung: Netzwerk zuerst (immer aktuell), bei Funkloch aus dem Cache.
const CACHE = 'kotoba-v2';
const CORE = ['./', './index.html', './css/app.css', './js/app.js', './manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
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
