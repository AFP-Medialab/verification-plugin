import { isValidUrl } from "@Shared/Utils/URLUtils";
import exifr from "exifr";

const exifrOptions = {
  exif: true,
  gps: true,
  iptc: true,
  jfif: true,
  tiff: true,
  mergeOutput: false,
};

/**
 *
 * @param url {string}
 * @returns {Promise<Error|any|null>}
 */
export async function getImageMetadataFromUrl(url) {
  try {
    // Validate the URL format
    if (!isValidUrl(url)) {
      return new Error("Invalid URL provided");
    }

    // Fetch the image
    const response = await fetch(url);

    // Check for a successful response
    if (!response.ok) {
      return new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`,
      );
    }

    // Check if the content-type is an image
    const contentType = response.headers.get("Content-Type");
    if (!contentType || !contentType.startsWith("image/")) {
      return new Error("The provided URL is not an image");
    }

    // Convert response to a Blob
    const blob = await response.blob();

    // Extract metadata using exifr
    const metadata = await exifr.parse(blob, exifrOptions);

    // Handle missing metadata
    if (!metadata) {
      return new Error("No EXIF metadata found in the image");
    }

    return metadata;
  } catch (error) {
    console.error("Error extracting metadata:", error.message);
    return null; // Return null instead of throwing to prevent app crashes
  }
}

/**
 *
 * @param file { ArrayBuffer | SharedArrayBuffer | Buffer | Uint8Array | DataView | string | Blob | File | HTMLImageElement}
 * @returns {Promise<any>}
 */
export const getImageMetadataFromFile = async (file) => {
  return await exifr.parse(file, exifrOptions);
};
