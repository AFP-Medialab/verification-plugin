import { createAction } from "@reduxjs/toolkit";

export const resetDeepfake = createAction("DEEPFAKE_IMAGE_RESET");

export const setDeepfakeType = createAction("SET_DEEPFAKE_IMAGE_TYPE");

export const setDeepfakeLoadingImage = createAction(
  "SET_DEEPFAKE_IMAGE_LOADING",
);

export const setDeepfakeResultImage = createAction("SET_DEEPFAKE_IMAGE_RESULT");
