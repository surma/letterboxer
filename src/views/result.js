import { h, Fragment } from "../dom-jsx.js";
import { downloadBlob } from "../dom-utils.js";
import { canvasToBlob } from "../image-utils.js";

let canvas;
let back;
const view = (
  <>
    {(back = <button>Back</button>)}
    {(canvas = <canvas />)}
    <button
      onclick={async () => {
        const blob = await canvasToBlob(canvas, "image/jpeg", 100);
        const file = new File([blob], "image.jpeg", { type: "image/jpeg" });
        downloadBlob(file);
      }}
    >
      JPEG
    </button>
    <button
      onclick={async () => {
        const blob = await canvasToBlob(canvas, "image/png");
        const file = new File([blob], "image.png", { type: "image/png" });
        downloadBlob(file);
      }}
    >
      PNG
    </button>
  </>
);

export { view, canvas, back };
