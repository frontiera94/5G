const CACHE_NAME = 'waxai-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
];

// Cache static assets on install
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

// Clean up old caches on activate
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Network-first for API calls, cache-first for static assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Always go network-first for API calls
  if (url.hostname.includes('open-meteo.com')) {
    event.respondWith(
      fetch(request)
        .then((res) => res)
        .catch(() => new Response(JSON.stringify({ error: 'Offline' }), {
          headers: { 'Content-Type': 'application/json' },
        }))
    );
    return;
  }

  // Cache-first for everything else
  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});
