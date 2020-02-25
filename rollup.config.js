import resolve from "rollup-plugin-node-resolve";
import omt from "@surma/rollup-plugin-off-main-thread";
import { terser } from "rollup-plugin-terser";
import ejs from "./rollup/ejs.js";

export default {
  input: "src/main.js",
  output: {
    dir: "build",
    format: "amd",
    entryFileNames: "[name].[hash].js"
  },
  plugins: [
    resolve(),
    omt(),
    terser(),
    ejs({
      src: "src/index.html.ejs",
      dest: "build/index.html"
    })
  ]
};
