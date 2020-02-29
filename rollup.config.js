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

import resolve from "rollup-plugin-node-resolve";
import omt from "@surma/rollup-plugin-off-main-thread";
import { terser } from "rollup-plugin-terser";
import { asc } from "rollup-plugin-assemblyscript";
import babel from "rollup-plugin-babel";

import ejs from "./rollup/ejs.js";
import fileList from "./rollup/file-list.js";
import statics from "./rollup/statics.js";

require("rimraf").sync("build");

export default {
  input: ["src/main.js", "src/sw.js"],
  output: {
    dir: "build",
    format: "amd",
    entryFileNames: "[name].[hash].js"
  },
  plugins: [
    resolve(),
    babel(),
    omt(),
    statics({
      files: ["src/_headers"]
    }),
    ejs({
      src: "src/index.html.ejs",
      dest: "index.html"
    }),
    {
      // Remove hash from ServiceWorker
      generateBundle(options, bundle) {
        const [key, chunk] = Object.entries(bundle).find(([_, chunk]) =>
          chunk.fileName.startsWith("sw.")
        );
        delete bundle[key];
        chunk.fileName = "sw.js";
        bundle["sw.js"] = chunk;
      }
    },
    fileList(),
    asc({
      compilerOptions: {
        optimizeLevel: 3,
        shrinkLevel: 2,
        runtime: "none",
        importMemory: true
      }
    }),
    terser({
      compress: true,
      mangle: true
    })
  ]
};
