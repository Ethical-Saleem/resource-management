self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
      caches.open('static-cache-v1').then((cache) =>
          cache.addAll([
              '/',
              '/img/android-chrome-192x192.png',
              '/img/android-chrome-512x512.png',
              '/manifest.json'
          ])
      )
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request).then((response) =>
          response || fetch(event.request)
      )
  );
});