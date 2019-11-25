export const setTwitterSnaResult = (url, result, notification, loading) => {
    return {
        type : "SET_TWITTER_SNA_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
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