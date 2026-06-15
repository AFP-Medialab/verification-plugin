import { isValidUrl } from "@Shared/Utils/URLUtils";
import exifr from "exifr";

import { mergeExifrFallback, runExifTool } from "./exifToolUtils";

const exifrOptions = {
  exif: false,
  gps: true,
  iptc: true,
  jfif: true,
  tiff: true,
  mergeOutput: false,
};

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
