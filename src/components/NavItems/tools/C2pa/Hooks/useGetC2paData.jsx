import { createC2pa, selectProducer } from "c2pa";
//import wasmSrc from "./public/c2paAssets/toolkit_bg.wasm"
//import workerSrc from "./c2paAssets/c2pa_worker_min.js";

async function getC2paData(image) {
  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  try {
    const { manifestStore } = await c2pa.read(image);
    console.log("manifestStore", manifestStore);
  } catch (err) {
    console.error("Error reading image:", err);
  }
}

export default getC2paData;
