import { isValidUrl } from "@Shared/Utils/URLUtils";
import { parseMetadata } from "@uswriting/exiftool";

export const extractVideoMetadata = async (url) => {
  if (!isValidUrl(url)) {
    throw new Error("Invalid URL");
  }

  // Fetch the video
  const response = await fetch(url, {
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`HTTP error ${response.status}`);
  }

  const blob = await response.blob();

  // Parse the metadata
  const jsonMetadata = await parseMetadata(
    new File([blob], "video-file", {
      type: blob.type,
    }),
    {
      args: ["-a", "-g1", "-json", "-n"],
      transform: (data) => JSON.parse(data),
    },
  );

  if (!jsonMetadata.success) {
    throw new Error("No metadata found.");
  }

  return jsonMetadata.data[0];
};
