import { controller } from "./image-stream-singleton.js";

async function getMostActiveServiceWorker() {
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return null;
  return reg.active || reg.waiting || reg.installing;
}

(async function() {
  navigator.serviceWorker.register("./sw.js");
  const reg = await getMostActiveServiceWorker();
  reg.postMessage("READY");
  navigator.serviceWorker.addEventListener("message", ev => {
    controller.enqueue(ev.data);
  });
})();
