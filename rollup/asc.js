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

import asc from "assemblyscript/cli/asc";
import { promises as fsp } from "fs";
import { basename } from "path";

const MARKER = "asc:";
export const PREFIX_MATCHER = /^asc:(.+)$/;
const defaultOpts = {
  matcher: PREFIX_MATCHER,
  compilerOptions: {}
};

export default function(opts) {
  opts = { ...defaultOpts, ...opts };

  return {
    async resolveId(id, importee) {
      const matches = opts.matcher.exec(id);
      if (!matches) {
        return;
      }
      id = await this.resolveId(matches[1], importee);
      return MARKER + id;
    },
    async load(id) {
      if (!id.startsWith(MARKER)) {
        return;
      }
      id = id.slice(MARKER.length);
      const fileName = basename(id, ".as");
      const ascCode = await fsp.readFile(id, "utf8");
      await asc.ready;
      const { binary } = asc.compileString(ascCode, opts.compilerOptions);
      const assetReferenceId = this.emitAsset(
        `${fileName}.wasm`,
        Buffer.from(binary.buffer)
      );
      return `export default import.meta.ROLLUP_ASSET_URL_${assetReferenceId}`;
    }
  };
}
