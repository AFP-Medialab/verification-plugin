import { createAction } from "@reduxjs/toolkit";

export const resetDeepfake = createAction("DEEPFAKE_VIDEO_RESET");

export const setDeepfakeLoadingVideo = createAction(
  "SET_DEEPFAKE_VIDEO_LOADING",
);

export const setDeepfakeResultVideo = createAction("SET_DEEPFAKE_VIDEO_RESULT");

export const setDeepfakeUrlVideo = createAction("SET_DEEPFAKE_VIDEO_URL");
