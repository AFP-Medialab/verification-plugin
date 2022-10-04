import { createAction } from "@reduxjs/toolkit"
export const setAnalysisResult = createAction("SET_ANALYSIS_RESULT_IMAGE")
/*export const setAnalysisResult = (url, result, notification, loading, image) => {
    return {
        type : "SET_ANALYSIS_RESULT_IMAGE",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
            image: image
        }
    }
};*/

export const setAnalysisComments = createAction("SET_ANALYSIS_PAGINATION_COMMENTS_IMAGE")
/*export const setAnalysisComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_COMMENTS_IMAGE",
        payload : data
            
        
    }
};*/

export const setAnalysisLinkComments = createAction("SET_ANALYSIS_PAGINATION_LINK_COMMENTS_IMAGE")
/*export const setAnalysisLinkComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_LINK_COMMENTS_IMAGE",
        payload : data
            
        
    }
};*/
export const setAnalysisVerifiedComments = createAction("SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS_IMAGE")
/*export const setAnalysisVerifiedComments = (data) => {
    return {
        type : "SET_ANALYSIS_PAGINATION_VERIFIED_COMMENTS_IMAGE",
        payload : data
            
        
    }
};*/

export const setAnalysisLoading = createAction("SET_ANALYSIS_LOADING_IMAGE")
/*export const setAnalysisLoading = (loading) => {
    return {
        type : "SET_ANALYSIS_LOADING_IMAGE",
        payload : loading
    }
};*/

export const cleanAnalysisState = createAction("ANALYSIS_CLEAN_STATE_IMAGE")
/*export const cleanAnalysisState = () => {
    return {
        type : "ANALYSIS_CLEAN_STATE_IMAGE"
    }
};*/