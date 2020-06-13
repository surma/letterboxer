import { get, set } from "idb-keyval";
import {
  fromEvent,
  subscribe,
  map,
  concat,
  just,
  combineLatest,
  debounce
} from "observables-with-streams";

import { h, Fragment } from "../dom-jsx.js";

let image;
let back;
let submit;
let width;
let height;
let color;
let border;
const view = (
  <>
    <style>{`
      img {
        max-width: 100%;
      }
    `}</style>
    {(back = <button id="back">Back</button>)}
    {(width = <input type="number" value="1" min="1" max="4000" id="width" />)}
    {
      (height = (
        <input type="number" value="1" min="1" max="4000" id="height" />
      ))
    }
    {
      (border = (
        <input
          type="number"
          value="10"
          min="0"
          max="50"
          step="0.1"
          id="border"
        />
      ))
    }
    {(color = <input type="color" value="#ffffff" id="color" />)}
    {(submit = <input type="submit" value="Letterbox!" />)}
    {(image = <img />)}
  </>
);

async function getWithDefault(key, def) {
  const value = await get(key);
  if (!value) {
    return def;
  }
  return value;
}

(async function() {
  const [widthV, heightV, colorV, borderV] = await Promise.all([
    getWithDefault("width", 1),
    getWithDefault("height", 1),
    getWithDefault("color", "#ffffff"),
    getWithDefault("border", "10")
  ]);
  width.value = widthV;
  height.value = heightV;
  color.value = colorV;
  border.value = borderV;
  combineLatest(
    concat(
      just(widthV),
      fromEvent(width, "change").pipeThrough(
        map(ev => parseInt(ev.target.value))
      )
    ),
    concat(
      just(heightV),
      fromEvent(height, "change").pipeThrough(
        map(ev => parseInt(ev.target.value))
      )
    ),
    concat(
      just(colorV),
      fromEvent(color, "change").pipeThrough(map(ev => ev.target.value))
    ),
    concat(
      just(borderV),
      fromEvent(border, "change").pipeThrough(map(ev => ev.target.value))
    )
  )
    .pipeThrough(debounce(1000))
    .pipeTo(
      subscribe(async ([width, height, color, border]) => {
        set("width", width);
        set("height", height);
        set("color", color);
        set("border", border);
      })
    );
})();

export function reset() {
  image.src = "";
}

export { border, view, back, submit, image, width, height, color };
