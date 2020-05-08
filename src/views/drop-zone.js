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

import View, { h } from "../view.js";

export default class DropZoneView extends View {
  get _markup() {
    return (
      <file-drop accept="image/*" id="dropzone" data-bind="drop">
        <style>{`
          file-drop {
            display: block;
            width: 100%;
            height: 100vh;
          }
          .drop-valid {
            background: green;
          }
          .drop-invalid {
            background: red;
          }
        `}</style>
        <input
          type="file"
          accept="image/png, image/jpeg"
          id="file"
          data-bind="input"
        />
      </file-drop>
    );
  }

  constructor(hydrateEl) {
    super(hydrateEl);
  }

  reset() {
    this.bindings.input.value = "";
  }
}
