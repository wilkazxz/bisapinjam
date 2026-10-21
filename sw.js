/* Service worker BisaPINJAM: cache cangkang aplikasi agar terbuka cepat dan tetap tampil saat sinyal jelek.
   Data Firebase tidak di-cache di sini (Firestore punya penyimpanan offline sendiri). Naikkan V saat file diperbarui. */
const V = 'bisapinjam-v7';
const SHELL = ['./', 'index.html', 'admin.html', 'icon.jpg', 'splash.jpg'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.allSettled(SHELL.map(u => c.add(u)))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);
  if (u.origin !== location.origin) return;
  if (u.pathname.startsWith('/api/') || u.pathname === '/manifest.json') return; /* manifest & ikon dinamis: selalu ambil dari server */
  const key = u.origin + u.pathname;
  if (r.mode === 'navigate') {
    e.respondWith(fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(key, cp)); } return res; })
      .catch(() => caches.match(key).then(m => m || caches.match('index.html'))));
    return;
  }
  e.respondWith(caches.match(key).then(m => {
    const net = fetch(r).then(res => { if (res.ok) { const cp = res.clone(); caches.open(V).then(c => c.put(key, cp)); } return res; }).catch(() => m);
    return m || net;
  }));
});
