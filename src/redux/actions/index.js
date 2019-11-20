export const changeLanguage = (lang) => {
    return {
        type : 'CHANGE',
        payload : lang
    };
};

export const setDictionary = (text) => {
    return {
        type : "SET",
        payload : text
    };
};

export const selectPage = (number) => {
    return {
        type: "SELECT_PAGE",
        payload : number,
    }
};

export const selectTool = (number) => {
    return {
        type : "SELECT_TOOL",
        payload : number,
    }
};

export const toggleHumanRightsCheckBox = () => {
    return {
        type : "TOGGLE_HUMAN_RIGHTS_CHECKBOX"
    }
};

export const toggleUnlockExplanationCheckBox = () => {
    return {
        type : "TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX"
    }
};

export const setAnalysisResult = (url, result, notification, loading) => {
    return {
        type : "SET_ANALYSIS_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setKeyfranesResult = (url, result, notification, loading) => {
    return {
        type : "SET_KEYFRAMES_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

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

export const setMagnifierResult = (url, result, notification, loading) => {
    return {
        type : "SET_MAGNIFIER_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setKeyMetadadaResult = (url, result, notification, loading, isImage) => {
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

export const setForensicsResult = (url, result, notification, loading) => {
    return {
        type : "SET_FORENSIC_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setError = (string) => {
    return {
        type : "SET_ERROR",
        payload : string
    }
};

export const cleanError = () => {
    return {
        type : "CLEAN_ERROR",
    }
};

export const setAnalysisLoading = (loading) => {
    return {
        type : "SET_ANALYSIS_LOADING",
        payload : loading
    }
};

export const setKeyfranesLoading = (loading) => {
    return {
        type : "SET_KEYFRAMES_LOADING",
        payload : loading
    }
};

export const setThumbnailsLoading = (loading) => {
    return {
        type : "SET_THUMBNAILS_LOADING",
        payload : loading
    }
};

export const setMagnifierLoading = (loading) => {
    return {
        type : "SET_MAGNIFIER_LOADING",
        payload : loading
    }
};

export const setKeyMetadadaLoading = (loading) => {
    return {
        type: "SET_METADATA_LOADING",
        payload: loading
    }
};

export const setVideoRightsLoading = (loading) => {
    return {
        type : "SET_VIDEO_RIGHTS_LOADING",
        payload : loading
    }
};

export const setKeyfranesMessage = (message) => {
    return {
        type : "SET_KEYFRAMES_MESSAGE",
        payload : message
    }
};

export const setMetadataIsImage = (bool) => {
    return {
        type : "SET_METADATA_IS_IMAGE",
        payload : bool
    }
};


export const setForensicsLoading = (loading) => {
    return {
        type : "SET_FORENSIC_LOADING",
        payload : loading
    }
};

