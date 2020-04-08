export const setAssistantResult = (url, result, mediatype, notification, loading) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            notification : notification,
            loading : loading,
            url : url,
            result : result,
        }
    }
};

export const setAssistantLoading = (loading) => {
    return {
        type : "SET_ASSITANT_LOADING",
        payload : loading
    }
};

export const cleanAssistantState = () => {
    return {
        type: "ASSISTANT_CLEAN_STATE"
    }
};