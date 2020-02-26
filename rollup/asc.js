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
