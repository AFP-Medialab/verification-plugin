export const setAssistantResult = (input, url, result, processUrl, processType) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            input: input,
            url : url,
            result : result,
            processUrl : processUrl,
            processType : processType,
        }
    }
};

export const cleanAssistantState = () => {
    return {
        type: "ASSISTANT_CLEAN_STATE"
    }
};