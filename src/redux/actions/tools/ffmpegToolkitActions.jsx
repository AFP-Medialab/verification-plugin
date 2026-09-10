import { createAction } from "@reduxjs/toolkit";

export const resetFfmpegToolkit = createAction("FFMPEG_TOOLKIT_RESET");

export const setFfmpegToolkitLoading = createAction(
  "SET_FFMPEG_TOOLKIT_LOADING",
);

export const setFfmpegToolkitUrl = createAction("SET_FFMPEG_TOOLKIT_URL");

export const setFfmpegToolkitFile = createAction("SET_FFMPEG_TOOLKIT_FILE");

export const setFfmpegToolkitFileName = createAction(
  "SET_FFMPEG_TOOLKIT_FILE_NAME",
);

export const setFfmpegToolkitResult = createAction("SET_FFMPEG_TOOLKIT_RESULT");

export const setBeginCutTime = createAction("SET_BEGIN_CUT_TIME");

export const setEndCutTime = createAction("SET_END_CUT_TIME");

export const setIframes = createAction("SET_IFRAMES");

export const setBottomLoading = createAction("SET_BOTTOM_LOADING");
