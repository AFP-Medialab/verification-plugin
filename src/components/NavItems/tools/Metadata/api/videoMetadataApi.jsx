import { isValidUrl } from "@Shared/Utils/URLUtils";
import { parseMetadata } from "@uswriting/exiftool";

import zeroPerlWasmUrl from "/zeroperl.wasm?url";

const wasmFetch = (url) =>
  fetch(url.endsWith("zeroperl.wasm") ? zeroPerlWasmUrl : url);

export const extractVideoMetadata = async (url) => {
  if (!isValidUrl(url)) {
    throw new Error("Invalid URL");
  }

  const response = await fetch(url, {
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const blob = await response.blob();

  const jsonMetadata = await parseMetadata(
    new File([blob], "video-file", {
      type: blob.type,
    }),
    {
      args: ["-a", "-g1", "-json", "-n"],
      transform: (data) => JSON.parse(data),
      fetch: wasmFetch,
    },
  );

  if (!jsonMetadata.success) {
    throw new Error("No metadata found.");
  }
  console.log(jsonMetadata.data[0]);
  return jsonMetadata.data[0];
};
