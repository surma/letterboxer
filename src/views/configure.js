import { h, Fragment } from "../dom-jsx.js";

let image;
let back;
let submit;
let width;
let height;
let color;
const view = (
  <>
    {(back = <button id="back">Back</button>)}
    {(width = <input type="number" value="1" min="1" max="4000" id="width" />)}
    {
      (height = (
        <input type="number" value="1" min="1" max="4000" id="height" />
      ))
    }
    {(color = <input type="color" value="#ffffff" id="color" />)}
    {(submit = <input type="submit" value="Letterbox!" />)}
    {(image = <img />)}
  </>
);

export { view, back, submit, image, width, height, color };
