import {
  createC2pa,
  selectEditsAndActivity,
  selectProducer,
  selectSocialAccounts,
} from "c2pa";
import {
  c2paCurrentImageIdSet,
  c2paLoadingSet,
  c2paMainImageIdSet,
  c2paResultSet,
  c2paValidationIssuesSet,
} from "redux/reducers/tools/c2paReducer";

const exifData = (assertions) => {
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

// const getIngredients = (ingredients) => {
//   let ingredientInfo = [];
//   for (let i = 0; i < ingredients.length; i++) {
//     let thumbnail = ingredients[i].thumbnail;
//     let url = thumbnail.getUrl();
//     console.log("url: ", url.url);
//     let ingredientManifest = ingredients[i].manifest
//       ? ingredients[i].manifest
//       : null;
//     ingredientInfo.push({
//       title: ingredients[i].title,
//       url: url.url,
//       manifest: ingredientManifest,
//     });
//   }
//   return ingredientInfo;
// };

export async function readManifest(manifest, parent, result, url, depth) {
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
        let validationIssues = getValidationIssues(
          manifest.ingredients[i].validationStatus,
        );
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
          result[id].validationIssues = validationIssues;
        } else {
          ingredientId = manifest.ingredients[i].instanceId;
          result[ingredientId] = { url: ingredientUrl.url, parent: manifestId };
        }
        children.push(ingredientId);
        manifestData.children = children;
      }
    }

    const producer = selectProducer(manifest);
    if (producer) manifestData.producer = { name: producer.name };

    const producerSocials = selectSocialAccounts(manifest);
    console.log("socials: ", producerSocials);
    if (producerSocials && producerSocials.length > 0) {
      manifestData.producer
        ? (manifestData.producer.socials = producerSocials)
        : (manifestData.producer = { socials: producerSocials.name });
    }

    res.manifestData = manifestData;

    result[manifestId] = res;

    return { id: manifestId, data: result };
  } else {
    console.log("no data");
  }
}

function getValidationIssues(validationStatus) {
  if (validationStatus.length > 0) {
    let errorMessages = [];
    let trustedSourceIssue = false;

    for (let i = 0; i < validationStatus.length; i++) {
      if (validationStatus[i].code === "signingCredential.untrusted") {
        trustedSourceIssue = true;
      }
      errorMessages.push(validationStatus[i].explanation);
    }
    return { trustedSourceIssue, errorMessages };
  } else {
    return null;
  }
}

async function loadTrustResource(file) {
  const res = await fetch(`https://contentcredentials.org/trust/${file}`);

  return res.text();
}

async function getToolkitSettings() {
  const [trustAnchors, allowedList, trustConfig] = await Promise.all(
    ["anchors.pem", "allowed.sha256.txt", "store.cfg"].map(loadTrustResource),
  );

  return {
    trust: {
      trustConfig,
      trustAnchors,
      allowedList,
    },
    verify: {
      verifyTrust: true,
    },
  };
}

async function getC2paData(image, dispatch) {
  const settings = await getToolkitSettings();
  console.log(settings);

  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  dispatch(c2paLoadingSet(true));
  const url = URL.createObjectURL(image);
  // dispatch(c2paUrlSet(url));

  try {
    const { manifestStore } = await c2pa.read(image, {
      settings: settings,
    });

    if (manifestStore) {
      console.log(manifestStore);

      const activeManifest = manifestStore.activeManifest
        ? manifestStore.activeManifest
        : null;

      let validationIssues = null;
      if (manifestStore.validationStatus.length > 0) {
        validationIssues = getValidationIssues(manifestStore.validationStatus);
        // dispatch(c2paValidationIssuesSet(true));
        // dispatch(c2paResultSet({ photo: { url: url } }));
        // dispatch(c2paMainImageIdSet("photo"));
        // dispatch(c2paCurrentImageIdSet("photo"));
      }
      if (activeManifest) {
        let { id, data } = await readManifest(activeManifest, null, {}, url, 0);
        data[id].validationIssues = validationIssues;
        dispatch(c2paResultSet(data));
        dispatch(c2paCurrentImageIdSet(id));
        dispatch(c2paMainImageIdSet(id));
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
