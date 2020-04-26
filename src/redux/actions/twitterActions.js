export const setTwitterResult = (request, result, notification, loading) => {
    return {
        type : "SET_TWITTER_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            request : request,
            result : result,
        }
    }
};

export const setTwitterLoading = (loading) => {
    return {
        type : "SET_TWITTER_LOADING",
        payload : loading
    }
};

export const setTwitterLoadingMessage = (message) => {
    return {
        type: "SET_TWITTER_LOADING_MSG",
        payload: message
    }
}

export const setTwitterTweet = (message) => {
    return {
        type: "SET_TWITTER_TWEET",
        payload: message
    }
}

export const setTwitterUrl = (message) => {
    return {
        type: "SET_TWITTER_URL",
        payload: message
    }
}

export const setTweetText = (message) => {
    return {
        type: "SET_TWITTER_TWEET",
        payload: message
    }
}

export const setTweetTag = (message) => {
    return {
        type: "SET_TWEET_TAG",
        payload: message
    }
}

export const setTweetMedia = (message) => {
    return {
        type: "SET_TWITTER_MEDIA",
        payload: message
    }
}

export const cleanTwitterState = () => {
    return {
        type: "TWITTER_CLEAN_STATE",
        payload: {
            notification: false,
            loading: false,
            loadingMessage: "",
            url: "",
            request: "",
            resultData: null,
            tweet: "",
            mediaUrl: "",
        }
    }
};