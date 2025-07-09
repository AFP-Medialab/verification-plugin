import { Buffer } from "buffer";

const IMAGE_FORMATS = {
  BLOB: "BLOB",
  URI: "URI",
  B64: "B64",
  UNKNOW: "UNKNOW",
  LOCAL: "LOCAL",
};

class ImageObject {
  constructor(obj, imageFormat) {
    this.obj = obj;

    if (
      typeof imageFormat !== "string" ||
      !Object.values(IMAGE_FORMATS).includes(imageFormat)
    ) {
      throw new Error(
        "[ImageObject.constructor] Error: Image format is not a string",
      );
    }

    if (!Object.values(IMAGE_FORMATS).includes(imageFormat)) {
      throw new Error(
        "[ImageObject.constructor] Error: Image format not supported",
      );
    }

    this.imageFormat = imageFormat;
  }
}

/**
 * Returns true if the string is in the base64 format, else false
 * @param {string} str
 * @returns {boolean}
 */
export const isBase64 = (str) => {
  // get rid of edge cases
  if (typeof str !== "string") return false;

  if (!str.includes(",")) return false;

  const strArr = str.split(",");
  const b64marker = strArr[0];
  const b64Str = strArr[1];

  // From https://stackoverflow.com/questions/7860392/determine-if-string-is-in-base64-using-javascript
  // test the b64 marker
  if (/^data:image\/\w+;base64/.test(b64marker) === false) {
    return false;
  }

  return Buffer.from(b64Str, "base64").toString("base64") === b64Str;
};

/**
 * Wrapper to retrieve a blob from url, b64 input, or local image path
 * @param {any} info
 * @returns {Promise<ImageObject>}
 */
export const getBlob = async (info) => {
  //console.log("Blob  ", info);
  if (!info) {
    throw new Error(`[getBlob] Error : bad parameter`);
  }

  const isImgUrl = typeof getImgUrl(info) === "string";

  const isb64 = isBase64(info);
  //console.log("isImgUrl ", isImgUrl);
  //console.log("isb64 ", isb64);
  let imgBlob;

  if (
    typeof info === "string" &&
    (info.startsWith("http") || info.startsWith("blob"))
  ) {
    imgBlob = await fetchImage(info);
  } else if (isImgUrl && !isb64) {
    imgBlob = await fetchImage(getImgUrl(info));
  } else if (isb64) {
    imgBlob = b64toBlob(info, "image/jpeg");
  } else {
    imgBlob = await getLocalImageFromSourcePath(
      getImgUrl(info),
      IMAGE_FORMATS.BLOB,
    );
  }

  if (!imgBlob) {
    throw new Error(`[getBlob] Error: imgBlob is not defined`);
  }

  return imgBlob;
};

export const getLocalImageFromSourcePath = async (src, imgFormat) => {
  if (!Object.values(IMAGE_FORMATS).includes(imgFormat)) {
    throw new Error(
      `[getLocalImageFromSourcePath] Error: Image format ${imgFormat} not supported`,
    );
  }
  //console.log("local image file ", src);
  let img = new Image();
  img.crossOrigin = "anonymous";
  // console.log(src);
  // console.log(src.toDataURL());

  const blob = await (await fetch(src)).blob();

  // const url = URL.createObjectURL(blob);

  if (imgFormat === IMAGE_FORMATS.BLOB) {
    return new ImageObject(blob, IMAGE_FORMATS.BLOB);
  }
  if (imgFormat === IMAGE_FORMATS.B64) {
    let reader = new FileReader();

    reader.readAsBinaryString(blob);

    reader.onloadend = () => {
      const base64String = reader.result;

      if (!base64String) {
        throw new Error(
          `[getLocalImageFromSourcePath] Error: Invalid type for base64string`,
        );
      }

      // console.log(base64String);

      return new ImageObject(base64String, IMAGE_FORMATS.B64);
    };

    img.src = src;
  }
};

export const getImgUrl = (info) => {
  if (typeof info === "string" && info.startsWith("http")) {
    return info;
  }

  const query = info.pageUrl;
  if (info.mediaType === "image") {
    return info.srcUrl;
  }
  return query;
};

const fetchImage = async (url) => {
  const response = await fetch(url);
  const blob = await response.blob();

  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

const b64toBlob = (content, contentType = "", sliceSize = 512) => {
  let image = content.substring(content.indexOf(",") + 1);
  const byteCharacters = atob(image);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, { type: contentType });
  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

// eslint-disable-next-line no-unused-vars
const b64toBlobde = (base64String, contentType = "") => {
  let image = base64String.substring(base64String.indexOf(",") + 1);
  const byteCharacters = atob(image);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  const byteArray = new Uint8Array(byteArrays);
  const blob = new Blob([byteArray], { type: contentType });
  return new ImageObject(blob, IMAGE_FORMATS.BLOB);
};

// const blobToBase64 = async (blob) => {
//   return new Promise((resolve, reject) => {
//     const reader = new FileReader();
//     reader.onload = () => resolve(reader.result);
//     reader.error = (err) => reject(err);
//     reader.readAsDataURL(blob);
//   });
// };
//not used
export const loadImage = (src, reverseSearchFunction) => {
  window.body.style.cursor = "wait";
  if (document !== undefined) document.body.style.cursor = "wait";
  let img = new Image();
  img.crossOrigin = "anonymous";
  img.onload = () => {
    let canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    canvas.getContext("2d").drawImage(img, 0, 0);

    // Get raw image data
    reverseSearchFunction(canvas.toDataURL("image/png"));
    canvas.remove();
  };
  img.onerror = (error) => {
    console.log("failed to load image", error);
    if (document !== undefined) {
      document.body.style.cursor = "default";
    }
    img.src = src;
  };
};

export { ImageObject, IMAGE_FORMATS };
