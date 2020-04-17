export const setAssistantResult = (url, result, processUrl, processType) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            url : url,
            result : result,
            processUrl : processUrl,
            processImage : processType,
        }
    }
};

export const cleanAssistantState = () => {
    return {
        type: "ASSISTANT_CLEAN_STATE"
    }
};