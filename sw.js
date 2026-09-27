/* Deliberately minimal: this app's whole point is live data from Supabase,
   so there is no good "offline" experience to fall back to anyway. Earlier
   versions cached the app shell and served it when a network request
   failed — but on a flaky mobile connection that could serve a stale or
   half-loaded copy of index.html right when the person was mid-navigation
   (e.g. switching departments), which looked like a blank/broken screen
   until they manually refreshed. Simplest fix: don't cache or intercept
   anything. The service worker still needs to exist and be registered for
   the app to qualify as installable, but it now just gets out of the way.
*/
self.addEventListener('install', function (e) {
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (names) {
      return Promise.all(names.map(function (name) { return caches.delete(name); }));
    })
  );
  self.clients.claim();
});

/* A fetch listener that does nothing but pass the request straight through
   to the network — kept only because some installability checks look for
   its mere presence. It never intercepts, caches, or serves anything of
   its own. */
self.addEventListener('fetch', function (e) {
  e.respondWith(fetch(e.request));
});
