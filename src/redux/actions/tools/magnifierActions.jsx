import { createAction } from "@reduxjs/toolkit"
export const setMagnifierResult = createAction("SET_MAGNIFIER_RESULT")

/*export const setMagnifierResult = (url, result, notification, loading) => {
    return {
        type : "SET_MAGNIFIER_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};*/

export const setMagnifierLoading = createAction("SET_MAGNIFIER_LOADING")
/*export const setMagnifierLoading = (loading) => {
    return {
        type : "SET_MAGNIFIER_LOADING",
        payload : loading
    }
};*/

export const cleanMagnifierState = createAction("MAGNIFIER_CLEAN_STATE")
/*export const cleanMagnifierState = () => {
    return {
        type: "MAGNIFIER_CLEAN_STATE"
    }
};*/