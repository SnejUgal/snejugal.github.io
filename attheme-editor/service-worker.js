self.addEventListener("install", function(event) {
  event.waitUntil(caches.open("attheme-editor").then(function(cache) {
    return cache.addAll([
      "index.html",
      "js/color.js",
      "js/values.js",
      "js/script.js",
      "js/functions.js",
      "css/style.css",
      "img/transparency.svg",
      "img/dark-transparency.svg",
      "img/favicon.png",
      "/attheme-editor/",
      "img/download.svg",
      "img/light.svg",
      "img/dark.svg"
    ]).then(function() {
      self.skipWaiting();
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

    if (event.request.url.indexOf("/variables-previews/") == -1 && "onLine" in navigator && navigator.onLine) {
      if (event.request.url.slice(0, 4) == "http") {
        recache(event.request);
      }
      return fetch(event.request) || response;
    }
    return response || fetch(event.request);
  }));
});
