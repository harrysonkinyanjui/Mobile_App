
const CACHE_NAME = "number-converter-v2";

const APP_FILES = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json"
];

// Install the service worker and cache the website files.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Activate and remove older app caches.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(
            (key) =>
              key.startsWith("number-converter-") &&
              key !== CACHE_NAME
          )
          .map((key) => caches.delete(key))
      )
    )
  );

  self.clients.claim();
});

// Load cached files when offline.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request);
    })
  );
});
