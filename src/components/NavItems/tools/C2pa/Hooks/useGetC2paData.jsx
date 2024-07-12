import { createC2pa, selectProducer } from "c2pa";
import {
  c2paLoadingSet,
  c2paResultsSet,
  c2paUrlSet,
} from "redux/reducers/tools/c2paReducer";
//import wasmSrc from "./public/c2paAssets/toolkit_bg.wasm"
//import workerSrc from "./c2paAssets/c2pa_worker_min.js";

async function getC2paData(image, dispatch) {
  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  dispatch(c2paLoadingSet(true));

  try {
    const { manifestStore } = await c2pa.read(image);
    console.log("manifestStore", manifestStore);

    const activeManifest = manifestStore.activeManifest
      ? manifestStore.activeManifest
      : null;

    if (activeManifest) {
      const res = {
        title: activeManifest.title,
        signatureInfo: {
          issuer: activeManifest.signatureInfo.issuer,
          time: activeManifest.signatureInfo.time,
        },
      };

      if (manifestStore.validationStatus.length > 0) {
        res.validationIssues = true;
      }

      dispatch(c2paResultsSet(res));
    } else {
      console.log("no active manifest");
    }
    dispatch(c2paUrlSet(URL.createObjectURL(image)));
    dispatch(c2paLoadingSet(false));
  } catch (err) {
    console.error("Error reading image:", err);
    dispatch(c2paLoadingSet(false));
  }
}

export default getC2paData;
