import wasmUrl from "asc:./addition.as";

async function run() {
  const { instance } = await WebAssembly.instantiateStreaming(
    fetch(wasmUrl),
    {}
  );
  console.log(instance.exports.add(4, 5));
}
run();
