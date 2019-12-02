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

export const setAnalysisLoading = (loading) => {
    return {
        type : "SET_ANALYSIS_LOADING",
        payload : loading
    }
};

export const cleanAnalysisState = () => {
    return {
        type : "ANALYSIS_CLEAN_STATE"
    }
};