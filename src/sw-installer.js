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

const searchParams = new URLSearchParams(location.search);
const shouldUninstall = searchParams.has("no-cache");

(async () => {
  if (!shouldUninstall) {
    navigator.serviceWorker.register("./sw.js");
  }

  if (shouldUninstall) {
    const reg = await navigator.serviceWorker.getRegistration();
    if (reg) {
      await reg.unregister();
    }
  }
})();
