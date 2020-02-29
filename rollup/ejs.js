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

import * as ejs from "ejs";

async function emitAsset(file, hashed) {
  const { id } = await this.resolve(file);
  this.addWatchFile(id);
  const source = await fsp.readFile(id);
  let name = basename(id);
  if (hashed) {
    this.emitFile({
      type: "asset",
      name,
      source
    });
  } else {
    this.emitFile({
      type: "asset",
      fileName: name,
      source
    });
  }
}

export default function({ files, hashedFiles }) {
  return {
    name: "ejs",
    async buildStart() {
      for (let file of files) {
        emitAsset.call(this, file, false);
      }
      for (let file of hashedFiles) {
        emitAsset.call(this, file, true);
      }
    },
    async generateBundle(options, bundle) {
      const ejsAssets = Object.values(bundle)
        .filter(chunk => chunk.type === "asset")
        .filter(asset => asset.fileName.endsWith(".ejs"));
      for (const asset of ejsAssets) {
        const template = asset.source.toString();
        const newSource = ejs.render(template, { bundle });
        asset.source = newSource;
        asset.fileName = asset.fileName.replace(/\.ejs$/, "");
      }
    }
  };
}
