export const setThumbnailsResult = (url, result, notification, loading) => {
    return {
        type : "SET_THUMBNAILS_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setThumbnailsLoading = (loading) => {
    return {
        type : "SET_THUMBNAILS_LOADING",
        payload : loading
    }
};

export const cleanThumbnailsState = () => {
    return {
        type: "THUMBNAILS_CLEAN_STATE"
    }
}