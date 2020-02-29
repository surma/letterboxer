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

import { promises as fsp } from "fs";
import { basename } from "path";

export default function({ files }) {
  return {
    name: "statics",
    async buildStart() {
      for (const file of files) {
        const { id } = await this.resolve(file);
        this.addWatchFile(id);
        const source = await fsp.readFile(id);
        this.emitFile({
          type: "asset",
          fileName: basename(id),
          source
        });
      }
    }
  };
}
