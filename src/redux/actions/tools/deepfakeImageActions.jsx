import { createAction } from "@reduxjs/toolkit";

export const resetDeepfake = createAction("DEEPFAKE_IMAGE_RESET");

export const setDeepfakeLoadingImage = createAction(
  "SET_DEEPFAKE_IMAGE_LOADING",
);

export const setDeepfakeResultImage = createAction("SET_DEEPFAKE_IMAGE_RESULT");

export const setDeepfakeUrlImage = createAction("SET_DEEPFAKE_IMAGE_URL");
