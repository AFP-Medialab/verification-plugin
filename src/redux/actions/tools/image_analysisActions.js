export const setAnalysisResult = (url, result, notification, loading) => {
    return {
        type : "SET_ANALYSIS_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result
        }
    }
};
export const setAnalysisComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_COMMENTS",
        payload : data
            
        
    }
};
export const setAnalysisLinkComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_LINK_COMMENTS",
        payload : data
            
        
    }
};
export const setAnalysisVerifiedComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS",
        payload : data
            
        
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