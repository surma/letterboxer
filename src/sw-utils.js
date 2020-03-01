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

export function serveShareTarget(event) {
  // Redirect so the user can refresh the page without resending data.
  event.respondWith(Response.redirect("/"));

  event.waitUntil(
    (async function() {
      const data = await event.request.formData();
      const client = await self.clients.get(event.resultingClientId);
      await nextMessage("READY");
      const file = data.get("file");
      client.postMessage({ file, action: "load-image" });
    })()
  );
}
