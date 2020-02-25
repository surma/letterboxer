import {promises as fsp} from "fs";
import * as ejs from "ejs";

export default function({src, dest}) {
  return {
    async writeBundle(bundle) {
      const template = await fsp.readFile(src, "utf8");
      const output = ejs.render(template, {bundle});
      await fsp.writeFile(dest, output);
    }
  }
}