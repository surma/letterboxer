/**
 * Copyright 2020 Google Inc. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { api } from "./worker-singleton.js";
import { createImageData, renderImageData } from "./image-utils.js";

const form = document.querySelector("#form");
form.onsubmit = async ev => {
  ev.preventDefault();
  const imgurl = URL.createObjectURL(form.file.files[0]);
  const image = await createImageData(imgurl);
  const letterboxedImage = await api.letterbox(
    image,
    parseInt(form.width.value),
    parseInt(form.height.value),
    0,
    0,
    0,
    255
  );
  const canvas = renderImageData(letterboxedImage);
  document.body.append(canvas);
};
