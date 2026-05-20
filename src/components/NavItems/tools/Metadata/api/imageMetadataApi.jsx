import { isValidUrl } from "@Shared/Utils/URLUtils";
import { parseMetadata } from "@uswriting/exiftool";
import exifr from "exifr";

import { groupExifToolOutput, mergeExifrFallback } from "./exifToolUtils";

const exifrOptions = {
  exif: false,
  gps: true,
  iptc: true,
  jfif: true,
  tiff: true,
  mergeOutput: false,
};

// Redirects zeroperl.wasm requests to the extension's bundled copy.
// Without this "trick" the extension is not able to access to the wasm file which
// contains everything we need to retrieve metadata
const extensionFetch = (input, init) => {
  const url = typeof input === "string" ? input : (input.url ?? input);
  if (typeof url === "string" && url.endsWith("zeroperl.wasm")) {
    return fetch(chrome.runtime.getURL("zeroperl.wasm"), init);
  }
  return fetch(input, init);
};

// From a file, run exif tool command with args that allows to retrieve every metadata possible
async function runExifTool(file) {
  const result = await parseMetadata(file, {
    args: ["-json", "-G", "-n", "-a", "-u"],
    fetch: extensionFetch,
    transform: (data) => {
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed[0] : parsed;
    },
  });

  if (!result.success) {
    console.error("ExifTool error:", result.error);
    return null;
  }

  return groupExifToolOutput(result.data);
}

/**
 * Function that retrieve metadata from a file in input
 * It uses both exiftool and exifr and merge the two to get as many metadatas as possible.
 * @param {File} file
 * @returns
 */
export async function extractMetadataFromFile(file) {
  const [exiftoolResult, exifrResult] = await Promise.all([
    runExifTool(file),
    exifr.parse(file, exifrOptions).catch(() => null),
  ]);
  return mergeExifrFallback(exiftoolResult, exifrResult);
}

/**
 * Function that retrieve metadata from an URL.
 * It uses both exiftool and exifr and merge the two to get as many metadatas as possible.
 * @param {File} file
 * @returns
 */
export async function extractMetadataFromUrl(urlString) {
  try {
    const response = await fetch(urlString);
    if (!response.ok)
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    const blob = await response.blob();

    // ExifTool requires a File object (needs a filename for format detection)
    const filename = urlString.split("/").pop()?.split("?")[0] || "image";
    const file = new File([blob], filename, { type: blob.type });

    const [exiftoolResult, exifrResult] = await Promise.all([
      runExifTool(file),
      exifr.parse(blob, exifrOptions).catch(() => null),
    ]);
    return mergeExifrFallback(exiftoolResult, exifrResult);
  } catch (error) {
    console.error("Error handling URL input:", error);
    return null;
  }
}
