import { h, Fragment } from "../dom-jsx.js";
import { downloadBlob } from "../dom-utils.js";
import { canvasToBlob } from "../image-utils.js";

let jpegLink;
let pngLink;
let back;

async function setResult(canvas) {
  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", 100);
  const jpegFile = new File([jpegBlob], "image.jpeg", { type: "image/jpeg" });
  jpegLink.src = URL.createObjectURL(jpegFile);

  const pngBlob = await canvasToBlob(canvas, "image/png");
  const pngFile = new File([pngBlob], "image.png", { type: "image/png" });
  pngLink.src = URL.createObjectURL(pngFile);
}

const view = (
  <>
    <style>{`
      img {
        max-width: 100%;
      }
    `}</style>
    {(back = <button>Back</button>)}
    <fieldset>
      <legend>JPEG:</legend>
      {(jpegLink = <img src="image.jpg" />)}
    </fieldset>
    <fieldset>
      <legend>PNG:</legend>
      {(pngLink = <img src="image.png" />)}
    </fieldset>
  </>
);

export { view, setResult, back };
