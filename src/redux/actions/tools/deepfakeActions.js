
export const resetDeepfake = () => {
    return {
        type: "DEEPFAKE_RESET"
    }
};

export const setDeepfakeType = (type) => {
    return {
        type: "SET_DEEPFAKE_TYPE",
        payload: type
    }
};

export const setDeepfakeLoading = (loading) => {
    return {
        type: "SET_DEEPFAKE_LOADING",
        payload: loading
    }
};

export const setDeepfakeResult = (url, result) => {
    return {
        type: "SET_DEEPFAKE_RESULT",
        payload: {
            url: url,
            result: result,
        }
    }
};

