/*
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

export function h(name, attrs, ...children) {
  if (typeof name === "function") {
    return name(attrs, ...children);
  }
  const el = document.createElement(name);
  for (const [attrName, attrValue] of Object.entries(attrs || {})) {
    if (attrName in el) {
      el[attrName] = attrValue;
    } else {
      el.setAttribute(attrName, attrValue);
    }
  }
  el.append(...children.flat());
  return el;
}

export function Fragment(attrs, ...children) {
  return children.flat();
}

export function render(target, el, { append = false, replace = true } = {}) {
  if (!append && replace) {
    while (target.firstChild) {
      target.firstChild.remove();
    }
  }
  if (!Array.isArray(el)) {
    el = [el];
  }
  target.append(...el);
}
