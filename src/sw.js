/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { serveShareTarget } from "./sw-utils.js";

import fileList from "file-list:";

const excludedResources = ["sw.js", "_headers"];

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
  const url = new URL(event.request.url);
  if (url.pathname === "/share-target" && event.request.method === "POST") {
    serveShareTarget(event);
    return;
  }
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

const waitingResolvers = new Map();
addEventListener("message", ev => {
  const resolvers = waitingResolvers.get(ev.data);
  if (!resolvers) {
    return;
  }
  waitingResolvers.delete(ev.source);
  resolvers.forEach(resolve => resolve(ev));
});

// Dirrrrty
self.nextMessage = message => {
  return new Promise((resolve, reject) => {
    setTimeout(() => reject(`Didn’t receive "${message}" in time`), 5000);
    let resolvers = waitingResolvers.get(message);
    if (!resolvers) {
      resolvers = [];
      waitingResolvers.set(message, resolvers);
    }
    resolvers.push(resolve);
  });
};
