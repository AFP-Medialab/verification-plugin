import { createAction } from "@reduxjs/toolkit"

export const setMetadadaResult = createAction("SET_METADATA_RESULT")
/*export const setMetadadaResult = (url, result, notification, loading, isImage) => {
    return {
        type : "SET_METADATA_RESULT",
        payload : {
            isImage : isImage,
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};*/

export const setMetadadaLoading = createAction("SET_METADATA_LOADING")
/*export const setMetadadaLoading = (loading) => {
    return {
        type: "SET_METADATA_LOADING",
        payload: loading
    }
};*/

export const setMetadataIsImage = createAction("SET_METADATA_IS_IMAGE")

/*export const setMetadataIsImage = (bool) => {
    return {
        type : "SET_METADATA_IS_IMAGE",
        payload : bool
    }
};*/

export const cleanMetadataState = createAction("METADATA_CLEAN_STATE")
/*export const cleanMetadataState = () => {
    return {
        type: "METADATA_CLEAN_STATE"
    }
}*/

export const setMetadataMediaType = createAction("SET_METADATA_MEDIA_TYPE")
/*export const setMetadataMediaType = (type) => {
    return {
        type: "SET_METADATA_MEDIA_TYPE",
        payload: type
    }
}*/
