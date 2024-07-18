import { createC2pa, selectEditsAndActivity, selectProducer } from "c2pa";
import {
  c2paCurrentImageIdSet,
  c2paLoadingSet,
  c2paMainImageIdSet,
  c2paResultSet,
  c2paStateCleaned,
  c2paUrlSet,
  c2paValidationIssuesSet,
} from "redux/reducers/tools/c2paReducer";
import { getIn } from "yup";
//import wasmSrc from "./public/c2paAssets/toolkit_bg.wasm"
//import workerSrc from "./c2paAssets/c2pa_worker_min.js";

const exifData = (assertions) => {
  console.log("assertions: ", assertions);
  let captureInfo = null;

  for (let i = 0; i < assertions.length; i++) {
    if (assertions[i].label === "stds.exif") {
      if (!captureInfo) captureInfo = {};
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

  return captureInfo;
};

const getIngredients = (ingredients) => {
  let ingredientInfo = [];
  for (let i = 0; i < ingredients.length; i++) {
    let thumbnail = ingredients[i].thumbnail;
    let url = thumbnail.getUrl();
    console.log("url: ", url.url);
    let ingredientManifest = ingredients[i].manifest
      ? ingredients[i].manifest
      : null;
    ingredientInfo.push({
      title: ingredients[i].title,
      url: url.url,
      manifest: ingredientManifest,
    });
  }
  return ingredientInfo;
};

export async function readManifest(manifest, parent, result, url, depth) {
  console.log("url: ", url);
  const res = {
    url: url,
    parent: parent,
  };

  if (manifest) {
    const manifestId = manifest.instanceId;

    const manifestData = {};

    manifestData.title = manifest.title;
    manifestData.signatureInfo = {
      issuer: manifest.signatureInfo.issuer,
      time: manifest.signatureInfo.time,
    };

    const editsAndActivity = await selectEditsAndActivity(manifest);
    if (editsAndActivity) manifestData.editsAndActivity = editsAndActivity;

    const captureInfo = exifData(manifest.assertions.data);
    if (captureInfo) manifestData.captureInfo = captureInfo;

    if (manifest.ingredients.length > 0) {
      let children = [];

      for (let i = 0; i < manifest.ingredients.length; i++) {
        let thumbnail = manifest.ingredients[i].thumbnail;
        let ingredientUrl = thumbnail.getUrl();
        //console.log("url: ", url.url);
        let ingredientId;
        if (depth < 5 && manifest.ingredients[i].manifest) {
          let { id, data } = await readManifest(
            manifest.ingredients[i].manifest,
            manifestId,
            result,
            ingredientUrl.url,
            depth + 1,
          );
          ingredientId = id;
          result = data;
        } else {
          ingredientId = manifest.ingredients[i].instanceId;
          result[ingredientId] = { url: ingredientUrl, parent: manifestId };
        }
        children.push(ingredientId);
        manifestData.children = children;
      }
    }
    //res.ingredients = getIngredients(manifest.ingredients);

    const producer = selectProducer(manifest);
    if (producer) manifestData.producer = producer.name;

    console.log(manifestData);
    res.manifestData = manifestData;

    result[manifestId] = res;

    return { id: manifestId, data: result };
  } else {
    console.log("no data");
  }
}

async function getC2paData(image, dispatch) {
  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  dispatch(c2paLoadingSet(true));
  const url = URL.createObjectURL(image);
  dispatch(c2paUrlSet(url));

  try {
    const { manifestStore } = await c2pa.read(image);
    console.log("manifestStore", manifestStore);

    if (manifestStore) {
      const activeManifest = manifestStore.activeManifest
        ? manifestStore.activeManifest
        : null;

      if (manifestStore.validationStatus.length > 0)
        dispatch(c2paValidationIssuesSet(true));

      if (activeManifest) {
        console.log("active: ", activeManifest);

        const { id, data } = await readManifest(
          activeManifest,
          null,
          {},
          url,
          0,
        );
        console.log("res", data);
        dispatch(c2paResultSet(data));
        dispatch(c2paCurrentImageIdSet(id));
        dispatch(c2paMainImageIdSet(id));
        console.log("dispatched");
        // const res = {
        //   c2paInfo: true,
        //   title: activeManifest.title,
        //   signatureInfo: {
        //     issuer: activeManifest.signatureInfo.issuer,
        //     time: activeManifest.signatureInfo.time,
        //   },
        // };

        // const editsAndActivity = await selectEditsAndActivity(activeManifest);
        // console.log("edits and activity: ", editsAndActivity);
        // if (editsAndActivity) res.editsAndActivity = editsAndActivity;

        // const captureInfo = exifData(activeManifest.assertions.data);

        // if (captureInfo) {
        //   console.log(captureInfo);
        //   res.captureInfo = captureInfo;
        // }

        // if (manifestStore.validationStatus.length > 0) {
        //   res.validationIssues = true;
        // }
        // if (activeManifest.ingredients.length > 0) {
        //   res.ingredients = getIngredients(activeManifest.ingredients);
        //   //console.log(ingredients);
        // }

        // const producer = selectProducer(activeManifest);
        // console.log("producer: ", producer);
        // if (producer) res.producer = producer.name;

        //dispatch(c2paResultsSet(res));
      } else {
        console.log("no active manifest");
      }
    } else {
      dispatch(c2paResultSet(null));
    }
    dispatch(c2paLoadingSet(false));
  } catch (err) {
    console.error("Error reading image:", err);
    dispatch(c2paLoadingSet(false));
  }
}

export default getC2paData;
