import { isValidUrl } from "@Shared/Utils/URLUtils";

import { runExifTool } from "./exifToolUtils";

/**
 * Retrieves metadata from a video URL using ExifTool.
 * @param {string} url
 * @returns {Promise<Record<string, Record<string,unknown>>>}
 */
export const extractVideoMetadata = async (url) => {
  if (!isValidUrl(url)) {
    throw new Error("Invalid URL");
  }

  const response = await fetch(url, { mode: "cors" });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const blob = await response.blob();
  const filename = url.split("/").pop()?.split("?")[0] || "video";
  const file = new File([blob], filename, { type: blob.type });

  const result = await runExifTool(file, ["-json", "-G", "-n", "-a", "-u"]);

  if (!result) {
    throw new Error("No metadata found.");
  }

  return result;
};
