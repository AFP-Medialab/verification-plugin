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

export const setAnalysisResult = (url, result) => {
    return {
        type : "SET_ANALYSIS_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setKeyfranesResult = (url, result) => {
    return {
        type : "SET_KEYFRAMES_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setThumbnailsResult = (url, result) => {
    return {
        type : "SET_THUMBNAILS_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setMagnifierResult = (url, result) => {
    return {
        type : "SET_MAGNIFIER_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setKeyMetadadaResult = (url, result) => {
    return {
        type : "SET_METADATA_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setVideoRightsResult = (url, result) => {
    return {
        type : "SET_VIDEO_RIGHTS_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};

export const setForensicsResult = (url, result) => {
    return {
        type : "SET_FORENSIC_RESULT",
        payload : {
            url : url,
            result : result,
        }
    }
};