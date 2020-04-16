export const setAssistantResult = (url, result, processUrl) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            url : url,
            result : result,
            processUrl : processUrl
        }
    }
};

export const cleanAssistantState = () => {
    return {
        type: "ASSISTANT_CLEAN_STATE"
    }
};