import { createAction } from "@reduxjs/toolkit";

export const resetDeepfake = createAction("DEEPFAKE_IMAGE_RESET");
/*export const resetDeepfake = () => {
    return {
        type: "DEEPFAKE_IMAGE_RESET"
    }
};*/

export const setDeepfakeType = createAction("SET_DEEPFAKE_IMAGE_TYPE");
/*export const setDeepfakeType = (type) => {
    return {
        type: "SET_DEEPFAKE_IMAGE_TYPE",
        payload: type
    }
};*/

export const setDeepfakeLoadingImage = createAction(
  "SET_DEEPFAKE_IMAGE_LOADING",
);
/*export const setDeepfakeLoadingImage = (loading) => {
    return {
        type: "SET_DEEPFAK_IMAGE_LOADING",
        payload: loading
    }
};*/

export const setDeepfakeResultImage = createAction("SET_DEEPFAKE_IMAGE_RESULT");

/*export const setDeepfakeResultImage = (url, result) => {
    return {
        type: "SET_DEEPFAKE_IMAGE_RESULT",
        payload: {
            url: url,
            result: result,
        }
    }
};*/
