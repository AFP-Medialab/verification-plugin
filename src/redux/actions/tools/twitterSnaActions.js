export const setTwitterSnaResult = (request, result, notification, loading) => {
    return {
        type : "SET_TWITTER_SNA_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            request : request,
            result : result,
        }
    }
};

export const setTwitterSnaLoading = (loading) => {
    return {
        type : "SET_TWITTER_SNA_LOADING",
        payload : loading
    }
};

export const setTwitterSnaLoadingMessage = (message) => {
    return {
        type: "SET_TWITTER_SNA_LOADING_MSG",
        payload: message
    }
}

export const cleanTwitterSnaState = () => {
    return {
        type: "TWITTER_SNA_CLEAN_STATE"
    }
};