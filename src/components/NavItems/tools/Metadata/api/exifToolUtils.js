import { parseMetadata } from "@uswriting/exiftool";

// Groups produced by ExifTool that carry no useful user-facing metadata
const EXCLUDED_GROUPS = new Set(["ExifTool"]);

// Redirects zeroperl.wasm requests to the extension's bundled copy.
export const extensionFetch = (input, init) => {
  const url = typeof input === "string" ? input : (input.url ?? input);
  if (typeof url === "string" && url.endsWith("zeroperl.wasm")) {
    return fetch(chrome.runtime.getURL("zeroperl.wasm"), init);
  }
  return fetch(input, init);
};

/**
 * Run ExifTool on a File object and return grouped metadata.
 * @param {File} file
 * @param {string[]} args - ExifTool CLI args (defaults to image profile)
 * @returns {Promise<Record<string, Record<string,unknown>>|null>}
 */
export async function runExifTool(
  file,
  args = ["-json", "-G", "-n", "-a", "-u"],
) {
  const result = await parseMetadata(file, {
    args,
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

// Maps exifr group names (lowercase) to ExifTool group names (uppercase)
export const EXIFR_TO_EXIFTOOL_GROUP = {
  iptc: "IPTC",
  exif: "EXIF",
  gps: "GPS",
  jfif: "JFIF",
  tiff: "IFD0",
  xmp: "XMP",
};

/**
 * Parse ExifTool JSON output into grouped metadata object.
 * Tags with a "Group:Tag" prefix are grouped by their prefix;
 * unprefixed tags go into a "General" group.
 * @param {Record<string,unknown>} raw
 * @returns {Record<string, Record<string,unknown>>}
 */
export function groupExifToolOutput(raw) {
  const groups = {};
  for (const [key, value] of Object.entries(raw)) {
    if (key === "SourceFile") continue;
    const colonIndex = key.indexOf(":");
    const group = colonIndex !== -1 ? key.slice(0, colonIndex) : "General";
    if (EXCLUDED_GROUPS.has(group)) continue;
    const tag = colonIndex !== -1 ? key.slice(colonIndex + 1) : key;
    if (!groups[group]) groups[group] = {};
    groups[group][tag] = value;
  }
  return groups;
}

/**
 * Merges exifr grouped output into ExifTool grouped output.
 * ExifTool values take precedence; exifr fills in missing or empty tags.
 * @param {Record<string, Record<string,unknown>>|null} exiftoolGroups
 * @param {Record<string, Record<string,unknown>>|null} exifrGroups
 * @returns {Record<string, Record<string,unknown>>}
 */
export function mergeExifrFallback(exiftoolGroups, exifrGroups) {
  if (!exifrGroups) return exiftoolGroups ?? {};
  if (!exiftoolGroups) return exifrGroups;

  const merged = { ...exiftoolGroups };

  for (const [exifrKey, exifrData] of Object.entries(exifrGroups)) {
    if (!exifrData || typeof exifrData !== "object") continue;
    const groupKey =
      EXIFR_TO_EXIFTOOL_GROUP[exifrKey] ?? exifrKey.toUpperCase();

    if (!merged[groupKey]) {
      merged[groupKey] = { ...exifrData };
    } else {
      for (const [tag, value] of Object.entries(exifrData)) {
        if (merged[groupKey][tag] == null || merged[groupKey][tag] === "") {
          merged[groupKey][tag] = value;
        }
      }
    }
  }

  return merged;
}
