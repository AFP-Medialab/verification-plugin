import { createC2pa, selectEditsAndActivity, selectProducer } from "c2pa";
import {
  c2paLoadingSet,
  c2paResultsSet,
  c2paStateCleaned,
  c2paUrlSet,
} from "redux/reducers/tools/c2paReducer";
//import wasmSrc from "./public/c2paAssets/toolkit_bg.wasm"
//import workerSrc from "./c2paAssets/c2pa_worker_min.js";

const exifData = (assertions) => {
  console.log("assertions: ", assertions);
  const captureInfo = {};

  for (let i = 0; i < assertions.length; i++) {
    if (assertions[i].label === "stds.exif") {
      if (assertions[i]["data"]["EXIF:Make"]) {
        captureInfo.make = assertions[i]["data"]["EXIF:Make"];
      }
      if (assertions[i]["data"]["EXIF:Model"]) {
        captureInfo.model = assertions[i]["data"]["EXIF:Model"];
      }
      if (assertions[i]["data"]["EXIF:DateTimeOriginal"]) {
        captureInfo.dateTime = assertions[i]["data"]["EXIF:DateTimeOriginal"];
      }
    }
  }
  return captureInfo !== {} ? captureInfo : null;
};

async function getC2paData(image, dispatch) {
  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  dispatch(c2paLoadingSet(true));
  dispatch(c2paUrlSet(URL.createObjectURL(image)));

  try {
    const { manifestStore } = await c2pa.read(image);
    console.log("manifestStore", manifestStore);

    if (manifestStore) {
      const activeManifest = manifestStore.activeManifest
        ? manifestStore.activeManifest
        : null;

      if (activeManifest) {
        const res = {
          c2paInfo: true,
          title: activeManifest.title,
          signatureInfo: {
            issuer: activeManifest.signatureInfo.issuer,
            time: activeManifest.signatureInfo.time,
          },
        };

        const editsAndActivity = await selectEditsAndActivity(activeManifest);
        //console.log("edits and activity: ", editsAndActivity);
        if (editsAndActivity) res.editsAndActivity = editsAndActivity;

        const captureInfo = exifData(activeManifest.assertions.data);
        if (captureInfo) res.captureInfo = captureInfo;

        if (manifestStore.validationStatus.length > 0) {
          res.validationIssues = true;
        }

        dispatch(c2paResultsSet(res));
      } else {
        console.log("no active manifest");
      }
    } else {
      dispatch(c2paResultsSet({ c2paInfo: false }));
    }
    dispatch(c2paLoadingSet(false));
  } catch (err) {
    console.error("Error reading image:", err);
    dispatch(c2paLoadingSet(false));
  }
}

export default getC2paData;