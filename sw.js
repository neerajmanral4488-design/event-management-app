const CACHE_NAME = 'event-mgmt-shell-v1';
const SHELL_FILE = './index.html';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add(SHELL_FILE);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  // Only cache-fallback the app shell page itself. Every data call goes to
  // script.google.com (a different origin) and must always hit the network
  // — caching those would show stale stock/requests, so they're left alone.
  const url = e.request.url;
  if (e.request.mode === 'navigate' || url.indexOf('index.html') !== -1 || url.endsWith('/')) {
    e.respondWith(
      fetch(e.request).catch(function () {
        return caches.match(SHELL_FILE);
      })
    );
  }
});
