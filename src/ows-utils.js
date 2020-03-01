import {
  combineLatestWith,
  subchain,
  map,
  buffer,
  filter,
  fromAsyncFunction,
  concatAll
} from "observables-with-streams";

export function gateOn(other) {
  return subchain(o =>
    o
      .pipeThrough(buffer(other))
      .pipeThrough(filter(v => v.length > 0))
      .pipeThrough(map(arr => arr.pop()))
  );
}

export function fromAsyncInitFunction(f) {
  return fromAsyncFunction(f).pipeThrough(concatAll());
}
