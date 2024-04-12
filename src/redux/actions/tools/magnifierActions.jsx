import { createAction } from "@reduxjs/toolkit";

export const setMagnifierResult = createAction("SET_MAGNIFIER_RESULT");

export const setMagnifierLoading = createAction("SET_MAGNIFIER_LOADING");

export const resetMagnifierState = createAction("MAGNIFIER_RESET_STATE");
