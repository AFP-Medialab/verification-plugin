import { createAction } from "@reduxjs/toolkit"
export const setAnalysisResult = createAction("SET_ANALYSIS_RESULT")
/*export const setAnalysisResult = (url, result, notification, loading) => {
    return {
        type : "SET_ANALYSIS_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result
        }
    }
};*/

export const setAnalysisComments = createAction("SET_ANALYSIS_PAGINATION_COMMENTS")
/*export const setAnalysisComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_COMMENTS",
        payload : data
            
        
    }
};*/

export const setAnalysisLinkComments = createAction("SET_ANALYSIS_PAGINATION_LINK_COMMENTS")

/*export const setAnalysisLinkComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_LINK_COMMENTS",
        payload : data
            
        
    }
};*/

export const setAnalysisVerifiedComments = createAction("SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS")

/*export const setAnalysisVerifiedComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS",
        payload : data
            
        
    }
};*/

export const setAnalysisLoading = createAction("SET_ANALYSIS_LOADING")

/*export const setAnalysisLoading = (loading) => {
    return {
        type : "SET_ANALYSIS_LOADING",
        payload : loading
    }
};*/

export const cleanAnalysisState = createAction("ANALYSIS_CLEAN_STATE")

/*export const cleanAnalysisState = () => {
    return {
        type : "ANALYSIS_CLEAN_STATE"
    }
};*/