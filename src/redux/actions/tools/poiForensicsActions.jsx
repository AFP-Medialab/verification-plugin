import { createAction } from "@reduxjs/toolkit";

export const resetPoiForensics = createAction("POI_FORENSICS_RESET");

export const setPoiForensicsLoading = createAction("SET_POI_FORENSICS_LOADING");

export const setPoiForensicsResult = createAction("SET_POI_FORENSICS_RESULT");

export const setPoiForensicsUrl = createAction("SET_POI_FORENSICS_URL");
