// Service Worker Version (update this when making changes)
const CACHE_VERSION = 'v2';
const CACHE_NAME = `waslak-cache-${CACHE_VERSION}`;

// List of assets to cache
const ASSETS_TO_CACHE = [
  // Core HTML
  '/',
  '/index.html',
  '/purchase.html',

  // CSS
  '/index.css',

  // Images
  '/images/waslak%20(1).webp',
  '/images/book_1.webp',
  '/images/book_2.webp',
  '/images/Couteur1.webp',
  '/images/wifiadapter.webp',
  '/images/bnkly.webp',
  '/images/msrvi.png',
  '/images/sedad.png',

  // External Fonts (cache Google Fonts CSS)
  'https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;700&display=swap'
];

// Install Event - Cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch Event - Serve cached content when available
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached response if found
        if (response) {
          return response;
        }

        // Clone the request for network fallback
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cache the new response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(event.request, responseToCache);
            });

          return response;
        }).catch(() => {
          // Fallback for failed requests
          return caches.match('/offline.html'); // Optional: Create an offline page
        });
      })
  );
});
