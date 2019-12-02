export const setKeyframesResult = (url, result, notification, loading) => {
    return {
        type : "SET_KEYFRAMES_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setKeyframesLoading = (loading) => {
    return {
        type : "SET_KEYFRAMES_LOADING",
        payload : loading
    }
};

export const setKeyframesMessage = (message) => {
    return {
        type : "SET_KEYFRAMES_MESSAGE",
        payload : message
    }
};

export const cleanKeyframesState = () => {
    return {
        type : "KEYFRAMES_CLEAN_STATE"
    }
}