import { createAction } from "@reduxjs/toolkit";

export const resetAudioVideoExtraction = createAction("AUDIO_EXTRACTION_RESET");

export const setAudioVideoExtractionLoading = createAction(
  "SET_AUDIO_EXTRACTION_LOADING",
);

export const setAudioVideoExtractionUrl = createAction(
  "SET_AUDIO_EXTRACTION_URL",
);

export const setAudioVideoExtractionResult = createAction(
  "SET_AUDIO_EXTRACTION_RESULT",
);

export const setBeginCutTime = createAction("SET_BEGIN_CUT_TIME");

export const setEndCutTime = createAction("SET_END_CUT_TIME");

export const setKeyframes = createAction("SET_KEYFRAMES");

export const setKeyframesLoading = createAction("SET_KEYFRAMES_LOADING");
