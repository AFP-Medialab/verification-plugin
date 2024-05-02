import { createAction } from "@reduxjs/toolkit";

export const setForensicsResult = createAction("SET_FORENSIC_RESULT");

export const setForensicMask = createAction("SET_FORENSIC_MASK");

export const setForensicsLoading = createAction("SET_FORENSIC_LOADING");

export const resetForensicState = createAction("RESET_FORENSIC_STATE");

export const setForensicsGifAnimateShow = createAction("SET_FORENSIC_GIF_SHOW");

export const setForensicsGifAnimateHide = createAction("SET_FORENSIC_GIF_HIDE");

export const setForensicMaskGif = createAction("SET_FORENSIC_MASK_GIF");

export const setForensicKey = createAction("SET_FORENSIC_ERROR_KEY");

export const setForensicDisplayItem = createAction("SET_FORENSIC_DISPLAY_ITEM");

export const setForensicInputFile = createAction("SET_FORENSIC_LOCAL_FILE");

export const setForensicImageRatio = createAction("SET_FORENSIC_IMAGE_RATIO");
