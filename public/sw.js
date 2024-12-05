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

self.addEventListener("activate", (event) => {
  console.log("Service Worker activated");
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

  const TIMEOUT_MS = 5000;

  // Helper to timeout fetch requests
  const timeoutFetch = (request, timeout) => {
    return Promise.race([
      fetch(request),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Timeout")), timeout)
      ),
    ]);
  };

  // Network-first strategy for API calls and dynamic content
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      timeoutFetch(event.request, TIMEOUT_MS)
        .then((response) => {
          // Only cache successful responses (status 200)
          if (response.ok) {
            const clonedResponse = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(event.request, clonedResponse))
              .catch((error) => console.error("Cache write failed:", error));
          }
          return response;
        })
        .catch(() => {
          // Serve from cache if network fails
          return caches.match(event.request).catch((error) => {
            console.error("Cache read failed:", error);
            throw error;
          });
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
      return timeoutFetch(event.request, TIMEOUT_MS).then((response) => {
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }
        const clonedResponse = response.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, clonedResponse))
          .catch((error) => console.error("Cache write failed:", error));
        return response;
      });
    })
  );
});
