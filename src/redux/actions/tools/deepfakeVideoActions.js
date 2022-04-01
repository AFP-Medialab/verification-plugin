
export const resetDeepfake = () => {
    return {
        type: "DEEPFAKE_VIDEO_RESET"
    }
};

export const setDeepfakeType = (type) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_TYPE",
        payload: type
    }
};

export const setDeepfakeLoadingVideo = (loading) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_LOADING",
        payload: loading
    }
};

export const setDeepfakeResultVideo = (url, result) => {
    return {
        type: "SET_DEEPFAKE_VIDEO_RESULT",
        payload: {
            url: url,
            result: result,
        }
    }
};

