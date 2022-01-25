export const setKeyframesResult = (url, result, notification, loading, video_id) => {
    return {
        type : "SET_KEYFRAMES_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
            video_id : video_id,
        }
    }
};

export const setKeyframesLoading = (loading) => {
    return {
        type : "SET_KEYFRAMES_LOADING",
        payload : loading
    }
};

export const setKeyframesSimilarityLoading = (loading) => {
    return {
        type: "SET_KEYFRAMES_SIMILARITY_LOADING",
        payload: loading
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

export const setSimilarity = (data) => {
    return {
        type: "KEYFRAMES_UPDATE_SIMILARITY",
        payload: data
    }
}

