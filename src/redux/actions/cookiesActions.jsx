import { createAction } from "@reduxjs/toolkit"

export const setTrue = createAction("SET_TRUE");
export const setStorageTrue = createAction("SET_STORAGE_TRUE");
export const setFalse = createAction("SET_FALSE");
//Attention faire l'appel avec !payload
export const toggleState = createAction("TOGGLE_STATE") ;