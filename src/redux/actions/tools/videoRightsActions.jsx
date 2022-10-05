export const setVideoRightsResult = (url, result, notification, loading) => {
    return {
        type : "SET_VIDEO_RIGHTS_RESULT",
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
        type : "SET_VIDEO_RIGHTS_LOADING",
        payload : loading
    }
};

export const cleanVideoRightsState = () => {
    return {
        type: "VIDEO_RIGHTS_CLEAN_STATE"
    }
};