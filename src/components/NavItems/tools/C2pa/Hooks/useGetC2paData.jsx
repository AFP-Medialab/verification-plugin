import {
  c2paCurrentImageIdSet,
  c2paMainImageIdSet,
  c2paResultSet,
} from "@/redux/reducers/tools/c2paReducer";
import { createC2pa } from "@contentauth/c2pa-web";
import wasmSrc from "@contentauth/c2pa-web/resources/c2pa.wasm?url";

/**
 * This function reads the image's capture information from the assertions
 * @param {Array} assertions array containing the assertions of a manifest
 * @returns {Object} parsed capture information
 */
const EXIF_FIELD_MAP = {
  make: ["EXIF:Make", "exif:Make"],
  model: ["EXIF:Model", "exif:Model"],
  dateTime: ["EXIF:DateTimeOriginal", "exif:DateTimeOriginal"],
  latitude: ["EXIF:GPSLatitude", "exif:GPSLatitude"],
  longitude: ["EXIF:GPSLongitude", "exif:GPSLongitude"],
};

const exifData = (assertions) => {
  const exifAssertions = assertions.filter((a) => a.label === "stds.exif");
  const actionAssertions = assertions.filter(
    (a) => a.label === "c2pa.actions.v2",
  );

  let captureInfo = null;
  if (exifAssertions.length > 0) {
    captureInfo = { allCaptureInfo: exifAssertions };
    for (const assertion of exifAssertions) {
      for (const [field, [upperKey, lowerKey]] of Object.entries(
        EXIF_FIELD_MAP,
      )) {
        const value = assertion.data[lowerKey] || assertion.data[upperKey];
        if (value) captureInfo[field] = value;
      }
    }
  }

  const producers = actionAssertions
    .flatMap((a) => a.data.actions)
    .filter(
      (action) => action.action === "c2pa.created" && action.parameters?.name,
    )
    .map((action) => ({ name: action.parameters.name }));

  return { captureInfo, producerInfo: producers.length > 0 ? producers : null };
};

/**
 * This function will recursively parse de data from a C2PA manifest and its children, and add it all to the result object
 * @param {Object} manifest the C2PA manifest to be read
 * @param {string=} parent id of manifest's parent if there is one
 * @param {Object} result Object containing the data for the manifests that have already been read
 * @param {string} url image corresponding with the manifest
 * @param {number} depth nunber of ancestors of the manifest already read, used to avoid having a result object that is too large if a manifest has many descendant
 * @param {Reader} c2pa reader use to fetch resources
 * @returns {Object} contains the id of the manifest that was just read, as well as the updated results
 */
async function readManifest(
  activeManifestId,
  manifests,
  parent,
  result,
  url,
  depth,
  reader,
) {
  // the object that will contain the data from this manifest, as well as the parent it
  const res = {
    url: url,
    parent: parent,
  };
  const manifest = manifests[activeManifestId];
  if (manifest) {
    const manifestId = manifest.instance_id;

    const manifestData = {};

    manifestData.title = manifest.title;
    manifestData.signatureInfo = {
      issuer: manifest.signature_info.issuer,
      commonName: manifest.signature_info.common_name,
      time: manifest.signature_info.time ? manifest.signature_info.time : null,
    };

    const softwareUsed = selectCreateSoftware(manifest.assertions);

    if (softwareUsed) manifestData.softwareUsed = softwareUsed;
    const generativeInfo = { assertion: manifest.assertions };

    if (generativeInfo) manifestData.generativeInfo = generativeInfo;
    const claimGenerator = getClaimGenerator(manifest);
    if (claimGenerator) manifestData.claimGenerator = claimGenerator;
    const { captureInfo, producerInfo } = exifData(manifest.assertions);
    if (captureInfo) manifestData.captureInfo = captureInfo;
    if (producerInfo) manifestData.producer = producerInfo;

    if (manifest.ingredients) {
      let children = [];

      for (let i = 0; i < manifest.ingredients.length; i++) {
        let thumbnail = manifest.ingredients[i].thumbnail;
        let ingredientUrl;

        try {
          ingredientUrl = thumbnail
            ? await resourceToObjectUrl(reader, thumbnail)
            : null;
        } catch {
          ingredientUrl = null;
        }

        let validationIssues = getValidationIssues(manifest.ingredients[i]);
        let ingredientId;
        // if a child has more than 5 ancestors, C2PA data will not be shown.
        if (depth < 5) {
          if (manifest.ingredients[i].active_manifest) {
            let { id, data } = await readManifest(
              manifest.ingredients[i].active_manifest,
              manifests,
              manifestId,
              result,
              ingredientUrl ?? null,
              depth + 1,
              reader,
            );
            ingredientId = id;
            result = data;
            result[id].validationIssues = validationIssues;
          } else {
            ingredientId = manifest.ingredients[i].instance_id;
            result[ingredientId] = {
              url: ingredientUrl ?? null,
              parent: manifestId,
            };
          }
        } else {
          ingredientId = manifest.ingredients[i].instance_id;
          result[ingredientId] = {
            url: ingredientUrl ?? null,
            parent: manifestId,
            depthExceeded: true,
          };
        }
        children.push(ingredientId);
        manifestData.children = children;
      }
    }

    res.manifestData = manifestData;

    result[manifestId] = res;

    return { id: manifestId, data: result };
  }
}

/**
 *
 * @param {Objet} Object that get the validation status
 */
function getValidationIssues(manifest) {
  let validationStatus = manifest.validation_status;
  if (validationStatus && validationStatus.length > 0) {
    let status = [];
    for (let i = 0; i < validationStatus.length; i++) {
      status.push({
        code: validationStatus[i].code,
        explanation: validationStatus[i].explanation,
      });
    }
    return { status };
  } else {
    return null;
  }
}

const selectCreateSoftware = (assertions) => {
  const actionAssertions = assertions.filter(
    (a) => a.label === "c2pa.actions.v2",
  );
  const editsAndActivity = actionAssertions
    .flatMap((a) => a.data.actions)
    .filter(
      (action) => action.action === "c2pa.created" && action.softwareAgent,
    )
    .map((action) => ({
      softwareAgent: action.softwareAgent.name,
      digitalSourceType: action.digitalSourceType,
    }));
  return editsAndActivity.length > 0 ? editsAndActivity : null;
};
const getClaimGenerator = (manifest) => {
  const generator = manifest.claim_generator;
  const generatorInfo = manifest.claim_generator_info?.map((info) => ({
    name: info.name,
    version: info.version,
  }));
  return { name: generator, info: generatorInfo };
};

const REMOTE_TRUST_BASE = "https://verify.contentauthenticity.org/trust";
const C2PA_ORG_TRUST_LIST_URL =
  "https://raw.githubusercontent.com/c2pa-org/conformance-public/main/trust-list/C2PA-TRUST-LIST.pem";

/**
 * Fetches a trust resource from a remote URL, falling back to a local copy in public/trust/ on failure.
 * @param {string} file filename (e.g. "anchors.pem")
 * @returns {Promise<string>}
 */
async function loadTrustResource(file) {
  try {
    const res = await fetch(`${REMOTE_TRUST_BASE}/${file}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch {
    const res = await fetch(`/trust/${file}`);
    return res.text();
  }
}

/**
 * Fetches the c2pa-org conformance trust list, falling back to a local copy on failure.
 * @returns {Promise<string>}
 */
async function loadC2paTrustList() {
  try {
    const res = await fetch(C2PA_ORG_TRUST_LIST_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.text();
  } catch {
    const res = await fetch("/trust/C2PA-TRUST-LIST.pem");
    return res.text();
  }
}

/**
 *
 * @returns {Object} settings allowing the C2PA. Read function to determine if the source of the Content Credentials is on the trusted list.
 * Combines contentauthenticity.org trust anchors with the c2pa-org conformance trust list.
 */
export async function getToolkitSettings() {
  const [trustAnchors, allowedList, trustConfig, c2paTrustList] =
    await Promise.all([
      loadTrustResource("anchors.pem"),
      loadTrustResource("allowed.sha256.txt"),
      loadTrustResource("store.cfg"),
      loadC2paTrustList(),
    ]);

  return {
    trust: {
      trustConfig,
      trustAnchors: trustAnchors + c2paTrustList,
      allowedList,
    },
    verify: {
      verifyTrust: true,
    },
  };
}

/**
 * Shared core: creates a c2pa reader from a URL, parses its manifest store,
 * and returns the result, currentImageId, and mainImageId.
 * @param {string} url
 * @returns {{ result: Object, currentImageId: string, mainImageId: string }}
 */
async function readC2paFromUrl(url) {
  const settings = await getToolkitSettings();
  const c2pa = await createC2pa({ wasmSrc });
  const response = await fetch(url);
  const blob = await response.blob();
  const reader = await c2pa.reader.fromBlob(blob.type, blob, settings);

  if (!reader) {
    const data = { id: { url } };
    return { result: data, currentImageId: "id", mainImageId: "id" };
  }

  try {
    const manifestStore = await reader.manifestStore();
    //console.log("manifestStore ", manifestStore)
    const activeManifestId = manifestStore.active_manifest ?? null;
    const manifests = manifestStore.manifests;
    const activeManifest = manifests[activeManifestId];

    let validationIssues = {
      state: manifestStore.validation_state,
      status: manifestStore.validation_status,
    };
    if (activeManifest) {
      const { id, data } = await readManifest(
        activeManifestId,
        manifests,
        null,
        {},
        url,
        0,
        reader,
      );
      data[id].validationIssues = validationIssues;
      return { result: data, currentImageId: id, mainImageId: id };
    }

    return { result: null, currentImageId: null, mainImageId: null };
  } finally {
    reader.free();
  }
}

/**
 * @param {string} url the url of the image containing C2PA data
 * @param {function} dispatch
 */
async function getC2paData(url, dispatch) {
  try {
    const { result, currentImageId, mainImageId } = await readC2paFromUrl(url);
    if (result) {
      dispatch(c2paResultSet(result));
      dispatch(c2paCurrentImageIdSet(currentImageId));
      dispatch(c2paMainImageIdSet(mainImageId));
    }
  } catch (err) {
    console.error("Error reading image:", err);
  }
}

/**
 * @param {string} url the url of the image containing C2PA data
 */
export async function getC2paDataHd(url) {
  const c2paData = {
    result: null,
    loading: false,
    url: null,
    currentImageId: null,
    mainImageId: null,
    validationIssues: false,
    thumbnail: null,
  };

  try {
    const { result, currentImageId, mainImageId } = await readC2paFromUrl(url);
    c2paData.result = result;
    c2paData.currentImageId = currentImageId;
    c2paData.mainImageId = mainImageId;
  } catch (err) {
    console.error("Error reading image:", err);
  }

  return c2paData;
}

const resourceToObjectUrl = async (reader, thumbnail) => {
  const ref = thumbnail.identifier;
  const contentType = thumbnail.format;
  const byteArray = await reader.resourceToBytes(ref);
  const blob = new Blob([byteArray], { type: contentType });
  return URL.createObjectURL(blob);
};

export default getC2paData;
