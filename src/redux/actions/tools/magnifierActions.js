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

export const setMagnifierLoading = (loading) => {
    return {
        type : "SET_MAGNIFIER_LOADING",
        payload : loading
    }
};

export const cleanMagnifierState = () => {
    return {
        type: "MAGNIFIER_CLEAN_STATE"
    }
};