export const setAssistantResult = (url, result, processUrl, processType, mainUrl) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            url : url,
            result : result,
            processUrl : processUrl,
            processType : processType,
        }
    }
};

export const setIsTweet = (isTweet) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            isTweet: isTweet
        }
    }
};

export const setAssistantUrl = (url) => {
    return {
        type : "SET_ASSISTANT_RESULT",
        payload : {
            url: url
        }
    }
};

export const cleanAssistantState = () => {
    return {
        type: "ASSISTANT_CLEAN_STATE"

    }
};