import fileList from "file-list:";

addEventListener("install", event => {
  const resources = fileList.filter(v => v !== "sw.js");

  event.waitUntil(
    (async () => {
      const cache = await caches.open("assets");
      await cache.addAll(["/", ...resources]);
    })()
  );
});

addEventListener("activate", event => {
  self.clients.claim();
});

addEventListener("fetch", event => {
  if (event.request.method !== "GET") {
    return;
  }
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(event.request, {
        ignoreSearch: true
      });
      return cachedResponse || fetch(event.request);
    })()
  );
});
