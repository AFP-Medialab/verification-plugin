
export const resetDeepfake = () => {
    return {
        type: "DEEPFAKE_IMAGE_RESET"
    }
};

export const setDeepfakeType = (type) => {
    return {
        type: "SET_DEEPFAKE_IMAGE_TYPE",
        payload: type
    }
};

export const setDeepfakeLoadingImage = (loading) => {
    return {
        type: "SET_DEEPFAK_IMAGE_LOADING",
        payload: loading
    }
};

export const setDeepfakeResultImage = (url, result) => {
    return {
        type: "SET_DEEPFAKE_IMAGE_RESULT",
        payload: {
            url: url,
            result: result,
        }
    }
};

