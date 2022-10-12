//DEPRECATED TO REMOVED

import { createAction } from "@reduxjs/toolkit"

export const setThumbnailsResult = createAction("SET_THUMBNAILS_RESULT")
/*export const setThumbnailsResult = (url, result, notification, loading) => {
    return {
        type : "SET_THUMBNAILS_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};*/

export const setThumbnailsLoading = createAction("SET_THUMBNAILS_LOADING")
/*export const setThumbnailsLoading = (loading) => {
    return {
        type : "SET_THUMBNAILS_LOADING",
        payload : loading
    }
};*/

export const cleanThumbnailsState = createAction("THUMBNAILS_CLEAN_STATE")
/*export const cleanThumbnailsState = () => {
    return {
        type: "THUMBNAILS_CLEAN_STATE"
    }
}*/