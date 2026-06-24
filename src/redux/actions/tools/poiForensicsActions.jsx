import { createAction } from "@reduxjs/toolkit";

export const resetPoiForensics = createAction("POI_FORENSICS_RESET");

export const setPoiForensicsLoading = createAction("SET_POI_FORENSICS_LOADING");

export const setPoiForensicsResult = createAction("SET_POI_FORENSICS_RESULT");

export const setPoiForensicsUrl = createAction("SET_POI_FORENSICS_URL");

export const setPoiForensicsFile = createAction("SET_POI_FORENSICS_FILE");

export const setSelectedPoi = createAction("SET_SELECTED_POI");

export const setSelectedMode = createAction("SET_SELECTED_MODE");

export const setStatus = createAction("SET_STATUS");
