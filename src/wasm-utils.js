export async function compile(source) {
  if ("compileStreaming" in WebAssembly) {
    return WebAssembly.compileStreaming(source);
  }
  const resp = await source;
  const body = await resp.arrayBuffer();
  return WebAssembly.compile(body);
}
