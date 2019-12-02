export const setMetadadaResult = (url, result, notification, loading, isImage) => {
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
};

export const setMetadadaLoading = (loading) => {
    return {
        type: "SET_METADATA_LOADING",
        payload: loading
    }
};

export const setMetadataIsImage = (bool) => {
    return {
        type : "SET_METADATA_IS_IMAGE",
        payload : bool
    }
};

export const cleanMetadataState = () => {
    return {
        type: "METADATA_CLEAN_STATE"
    }
}
