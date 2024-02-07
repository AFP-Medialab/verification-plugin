import { createAction } from "@reduxjs/toolkit";

export const resetSyntheticAudioDetectionAudio = createAction(
  "SYNTHETIC_AUDIO_DETECTION_RESET",
);

export const setSyntheticAudioDetectionLoading = createAction(
  "SET_SYNTHETIC_AUDIO_DETECTION_LOADING",
);

export const setSyntheticAudioDetectionResult = createAction(
  "SET_SYNTHETIC_AUDIO_DETECTION_RESULT",
);
