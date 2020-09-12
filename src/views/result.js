import { h, Fragment } from "../dom-jsx.js";
import { downloadBlob } from "../dom-utils.js";
import { canvasToBlob } from "../image-utils.js";

let canvas;
let jpegLink;
let pngLink;
let back;

async function setCanvas(cvs) {
  canvas.replaceWith(cvs);
  canvas = cvs;
  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 100);
  const jpegFile = new File([jpegBlob], "image.jpeg", { type: "image/jpeg" });
  jpegLink.href = URL.createObjectURL(jpegFile);

  const pngBlob = await canvasToBlob(canvas, "image/png");
  const pngFile = new File([pngBlob], "image.png", { type: "image/png" });
  pngLink.href = URL.createObjectURL(pngFile);
}

const view = (
  <>
    <style>{`
      canvas {
        max-width: 100%;
      }
	  #downloadbtns a {
	    border: 1px solid black;
	    margin: 1em;
	    padding: 1em;
	    display: inline-block;
	  }
    `}</style>
    {(back = <button>Back</button>)}
    {(canvas = <canvas />)}
    <fieldset id="downloadbtns">
      <legend>Download:</legend>
      {(jpegLink = <a download="image.jpg">JPEG</a>)}
      {(pngLink = <a download="image.png">PNG</a>)}
    </fieldset>
  </>
);

export { view, setCanvas, back };
