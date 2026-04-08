const CACHE_NAME = 'program-rehberim-v2';
const ASSETS = [
  './',
  './index.html',
  './css/app.css',
  './js/app.js',
  './js/pages.js',
  './js/components.js',
  './js/hafta.js',
  './js/pdf-viewer.js',
  './manifest.json',
  './data/FKH_10_database.json',
  './data/HDS_10_database.json',
  './data/SYR_10_database.json',
  './data/TDB_9_database.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // PDF'leri network-first yap (buyuk dosyalar)
  if (e.request.url.includes('/pdfs/')) {
    e.respondWith(
      fetch(e.request).catch(() => caches.match(e.request))
    );
    return;
  }
  // Diger dosyalari cache-first yap
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
      const clone = resp.clone();
      caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
      return resp;
    }))
  );
});
