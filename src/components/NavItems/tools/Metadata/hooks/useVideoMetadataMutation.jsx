import { useMutation } from "@tanstack/react-query";

import { extractVideoMetadata } from "../api/videoMetadataApi";

export const useVideoMetadataMutation = (options = {}) => {
  return useMutation({
    mutationFn: extractVideoMetadata,
    ...options,
  });
};
