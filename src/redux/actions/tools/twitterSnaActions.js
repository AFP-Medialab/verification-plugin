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

export const setVideoRightsLoading = (loading) => {
    return {
        type : "SET_TWITTER_SNA_LOADING",
        payload : loading
    }
};