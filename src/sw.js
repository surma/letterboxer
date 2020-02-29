import fileList from "file-list:";

const excludedResources = ["sw.js"];

addEventListener("install", event => {
  const resourcesToCache = fileList.filter(
    file => !excludedResources.includes(file)
  );

  event.waitUntil(
    (async () => {
      const cache = await caches.open("assets");
      await cache.addAll(["/", ...resourcesToCache]);
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
