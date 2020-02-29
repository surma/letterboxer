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

import { h } from "./dom-jsx.js";

export function nextEvent(el, name) {
  return new Promise(resolve =>
    el.addEventListener(name, resolve, { once: true })
  );
}

export function colorFromInput(input) {
  return input.value
    .slice(1)
    .split(/(..)/)
    .filter(Boolean)
    .map(v => parseInt(v, 16));
}

export function downloadBlob(b) {
  const url = URL.createObjectURL(b);
  const a = <a href={url} download={b.name}></a>;
  a.click();
  // TODO: Revoke ObjectURL?
}
