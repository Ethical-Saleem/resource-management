self.addEventListener("install", (event) => {
  console.log("Service Worker installing...");
  event.waitUntil(
    caches
      .open("static-cache-v1")
      .then((cache) =>
        cache.addAll([
          "/",
          "/img/android-chrome-192x192.png",
          "/img/android-chrome-512x512.png",
          "/manifest.json",
        ])
      )
  );
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName); // Clear outdated caches
          }
        })
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Network-first strategy for API calls and dynamic content
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Only cache successful responses (status 200)
          if (response.ok) {
            const clonedResponse = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clonedResponse);
            });
          }
          return response;
        })
        .catch(() => {
          // Serve from cache if network fails
          return caches.match(event.request);
        })
    );
    return;
  }
  event.respondWith(
    // caches.match(event.request).then((response) =>
    //     response || fetch(event.request)
    // )
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const clonedResponse = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clonedResponse);
        });
        return response;
      });
    })
  );
});
