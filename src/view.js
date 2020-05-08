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

import { h, render } from "./dom-jsx.js";

export { h, render };

export default class View {
  constructor(target) {
    this.bindings = {};
    if (!target) {
      this.el = this._markup;
    } else {
      this.el = target.children[0];
    }
    for (const bindee of this.el.querySelectorAll("[data-bind]")) {
      const name = bindee.dataset.bind;
      delete bindee.dataset.bind;
      this.bindings[name] = bindee;
    }
  }

  render(target) {
    render(target, this.el, { replace: true });
  }
}
