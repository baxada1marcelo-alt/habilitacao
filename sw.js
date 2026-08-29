const CACHE = 'hab-op-v1';
const ARQUIVOS = ['./', './index.html', './manifest.json', './icon-180.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARQUIVOS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
    const copia = resp.clone();
    caches.open(CACHE).then(c => c.put(e.request, copia));
    return resp;
  }).catch(() => caches.match('./index.html'))));
});
