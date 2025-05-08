// Service Worker للصفحة الإدارية
const CACHE_NAME = 'admin-panel-v1';
const ASSETS_TO_CACHE = [
  '/index.html',
  '/purchase.html',
  '/index.css',
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        return response || fetch(event.request);
      })
  );
});
