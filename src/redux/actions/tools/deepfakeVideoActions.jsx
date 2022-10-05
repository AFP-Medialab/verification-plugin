import { createAction } from "@reduxjs/toolkit"

export const resetDeepfake = createAction("DEEPFAKE_VIDEO_RESET")
/*export const resetDeepfake = () => {
    return {
        type: "DEEPFAKE_VIDEO_RESET"
    }
};*/

export const setDeepfakeType = createAction("SET_DEEPFAKE_VIDEO_TYPE")
/*export const setDeepfakeType = (type) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_TYPE",
        payload: type
    }
};*/

export const setDeepfakeLoadingVideo = createAction("SET_DEEPFAKE_VIDEO_LOADING") 
/*export const setDeepfakeLoadingVideo = (loading) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_LOADING",
        payload: loading
    }
};*/

export const setDeepfakeResultVideo = createAction("SET_DEEPFAKE_VIDEO_RESULT") 
/*export const setDeepfakeResultVideo = (url, result) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_RESULT",
        payload: {
            url: url,
            result: result,
        }
    }
};*/
