import { createAction } from "@reduxjs/toolkit";

export const resetAudioExtraction = createAction("AUDIO_EXTRACTION_RESET");

export const setAudioExtractionLoading = createAction(
  "SET_AUDIO_EXTRACTION_LOADING",
);

export const setAudioExtractionUrl = createAction("SET_AUDIO_EXTRACTION_URL");

export const setAudioExtractionResult = createAction(
  "SET_AUDIO_EXTRACTION_RESULT",
);
