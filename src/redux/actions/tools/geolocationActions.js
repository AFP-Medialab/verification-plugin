
export const resetGeolocation = () => {
    return {
        type: "GEOLOCATION_RESET"
    }
};

export const setGeolocationLoading = (loading) => {
    return {
        type: "SET_GEOLOCATION_LOADING",
        payload: loading
    }
};

export const setGeolocationResult = (urlImage, result) => {
    return {
        type: "SET_GEOLOCATION_RESULT",
        payload: {
            urlImage: urlImage,
            result: result,
            loading: false,
        }
    }
};

