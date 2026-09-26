const CACHE_NAME = 'event-mgmt-shell-v1';

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.add('./index.html');
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  // Only manage the wrapper shell itself; let the embedded app's own
  // requests (to script.google.com) pass straight through untouched.
  if (e.request.mode === 'navigate' || e.request.url.indexOf('index.html') !== -1) {
    e.respondWith(
      fetch(e.request).catch(function () {
        return caches.match('./index.html');
      })
    );
  }
});
