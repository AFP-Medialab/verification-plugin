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

export const setForensicsLoading = (loading) => {
    return {
        type : "SET_FORENSIC_LOADING",
        payload : loading
    }
};

export const cleanForensicState = () => {
    return {
        type : "FORENSIC_CLEAN_STATE"
    }
};