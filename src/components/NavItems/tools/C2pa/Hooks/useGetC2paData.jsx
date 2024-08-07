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
} from "redux/reducers/tools/c2paReducer";

/**
 *
 * @param {Array} assertions array containing the assertions of a manifest
 * @returns {Object} parsed capture information
 */
const exifData = (assertions) => {
  let captureInfo = null;
  let allCaptureInfo = null;

  for (let i = 0; i < assertions.length; i++) {
    if (assertions[i].label === "stds.exif") {
      if (!captureInfo) captureInfo = {};
      if (assertions[i]["data"]["EXIF:Make"]) {
        captureInfo.make = assertions[i]["data"]["EXIF:Make"];
      }
      if (assertions[i]["data"]["exif:Make"]) {
        captureInfo.make = assertions[i]["data"]["exif:Make"];
      }
      if (assertions[i]["data"]["EXIF:Model"]) {
        captureInfo.model = assertions[i]["data"]["EXIF:Model"];
      }
      if (assertions[i]["data"]["exif:Model"]) {
        captureInfo.model = assertions[i]["data"]["exif:Model"];
      }
      if (assertions[i]["data"]["EXIF:DateTimeOriginal"]) {
        captureInfo.dateTime = assertions[i]["data"]["EXIF:DateTimeOriginal"];
      }
      if (assertions[i]["data"]["exif:DateTimeOriginal"]) {
        captureInfo.dateTime = assertions[i]["data"]["exif:DateTimeOriginal"];
      }
      if (assertions[i]["data"]["EXIF:GPSLatitude"]) {
        captureInfo.latitude = assertions[i]["data"]["EXIF:GPSLatitude"];
      }
      if (assertions[i]["data"]["exif:GPSLatitude"]) {
        captureInfo.latitude = assertions[i]["data"]["exif:GPSLatitude"];
      }
      if (assertions[i]["data"]["EXIF:GPSLongitude"]) {
        captureInfo.longitude = assertions[i]["data"]["EXIF:GPSLongitude"];
      }
      if (assertions[i]["data"]["exif:GPSLongitude"]) {
        captureInfo.longitude = assertions[i]["data"]["exif:GPSLongitude"];
      }

      if (!allCaptureInfo) allCaptureInfo = [];
      allCaptureInfo.push(assertions[i]);
    }
  }
  if (captureInfo) captureInfo.allCaptureInfo = allCaptureInfo;
  return captureInfo;
};

/**
 *
 * @param {Object} manifest the c2pa manifest to be read
 * @param {string=} parent id of manifest parent if there is one
 * @param {Object} result Object containing the data for the manifests that have already been read
 * @param {*} url image corresponding with the manifest
 * @param {*} depth nunber of ancestors of the manifest already read, used to avoid having a result object that is too large if a manifest has many descendants
 * @returns
 */
async function readManifest(manifest, parent, result, url, depth) {
  // the object that will contain
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
    if (producerSocials && producerSocials.length > 0) {
      manifestData.producer
        ? (manifestData.producer.socials = producerSocials)
        : (manifestData.producer = { socials: producerSocials.name });
    }

    res.manifestData = manifestData;

    result[manifestId] = res;

    return { id: manifestId, data: result };
  }
}

/**
 *
 * @param {Array} validationStatus Array containing validation issues if there are any
 * @returns {Object} contains a boolean determining wheter or not the issues are do to trust in a source, as well as the messages for the issues
 */
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

/**
 *
 * @param {string} file
 * @returns
 */
async function loadTrustResource(file) {
  const res = await fetch(`https://contentcredentials.org/trust/${file}`);

  return res.text();
}

/**
 *
 * @returns {Object} settings allowing the c2pa.read function to determine if the source of the Content Credentials is on adobe's trusted list
 */
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

/**
 *
 * @param {Object} image the image containing c2pa data
 * @param {function} dispatch
 */

async function getC2paData(image, dispatch) {
  const settings = await getToolkitSettings();

  const c2pa = await createC2pa({
    wasmSrc: "./c2paAssets/toolkit_bg.wasm",
    workerSrc: "./c2paAssets/c2pa_worker_min.js",
  });

  dispatch(c2paLoadingSet(true));
  const url = URL.createObjectURL(image);

  try {
    const { manifestStore } = await c2pa.read(image, {
      settings: settings,
    });

    if (manifestStore) {
      const activeManifest = manifestStore.activeManifest
        ? manifestStore.activeManifest
        : null;

      let validationIssues = null;
      if (manifestStore.validationStatus.length > 0) {
        validationIssues = getValidationIssues(manifestStore.validationStatus);
      }
      if (activeManifest) {
        let { id, data } = await readManifest(activeManifest, null, {}, url, 0);
        data[id].validationIssues = validationIssues;
        dispatch(c2paResultSet(data));
        dispatch(c2paCurrentImageIdSet(id));
        dispatch(c2paMainImageIdSet(id));
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
