import { createAction } from "@reduxjs/toolkit";

export const resetSyntheticImageDetectionImage = createAction(
  "SYNTHETIC_IMAGE_DETECTION_RESET",
);

export const setSyntheticImageDetectionLoading = createAction(
  "SET_SYNTHETIC_IMAGE_DETECTION_LOADING",
);

export const setSyntheticImageDetectionResult = createAction(
  "SET_SYNTHETIC_IMAGE_DETECTION_RESULT",
);

export const setSyntheticImageDetectionNearDuplicates = createAction(
  "SET_SYNTHETIC_IMAGE_DETECTION_NEAR_DUPLICATES",
);

export const setSyntheticImageDetectionUrl = createAction(
  "SET_SYNTHETIC_IMAGE_DETECTION_URL",
);
