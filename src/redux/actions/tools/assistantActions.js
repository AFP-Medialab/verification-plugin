export const setUrlMode = (mode) => {
    return {
        type : "SET_MODE",
        payload : mode
    }
};

export const setRequireLogin = (requireLogin) => {
    return {
        type : "SET_REQUIRE_LOGIN",
        payload : requireLogin
    }
};

export const setInputUrl = (inputUrl) => {
    return {
        type : "SET_INPUT_URL",
        payload : inputUrl
    }
};

export const setProcessUrlActions = (inputUrl, processUrl, processUrlType, actions) => {
    return {
        type : "SET_PROCESS_URL_ACTIONS",
        inputUrl: inputUrl,
        processUrl: processUrl,
        processUrlType: processUrlType,
        payload : actions
    }
};


export const setProcessUrl = (processUrl) => {
    return {
        type : "SET_PROCESS_URL",
        payload : processUrl
    }
};


export const setMediaLists = (imageList, videoList) => {
    return {
        type : "SET_MEDIA_LISTS",
        payload : {
            imageList: imageList,
            videoList: videoList
        }
    }
};


export const cleanAssistantState = () => {
    return {
        type: "CLEAN_STATE"
    }
};
