self.addEventListener("install", function(event) {
  event.waitUntil(caches.delete("attheme-editor").then(function() {
    caches.open("attheme-editor").then(function(cache) {
      return cache.addAll([
        "index.html",
        "default_values.js",
        "script.js",
        "style.css",
        "transparency.svg",
        "favicon.png",
        "/attheme-editor/",
        "download.svg"
      ]).then(function() {
        self.skipWaiting();
      });
    });
  }));
});

async function recache(request) {
  setTimeout(function() {
    caches.open("attheme-editor").then(function(cache) {
      cache.delete(request).then(function() {
        cache.add(request.url);
      });
    });
  }, 1000);
}

self.addEventListener("activate", function(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if ("onLine" in navigator && navigator.onLine) {
      response = fetch(event.request) || response;
      if (event.request.url.slice(0, 4) == "http") {
        recache(event.request);
      }
      return response;
    }
    return response || fetch(event.request);
  }));
});
