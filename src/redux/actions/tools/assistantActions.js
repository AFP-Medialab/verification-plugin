export const setUrlMode = (mode) => {
    return {
        type : "SET_MODE",
        payload : mode
    }
};

export const setImageVideoSelected = (imageVideoSelected) => {
    return {
        type: "SET_IMAGE_VIDEO_SELECTED",
        payload: imageVideoSelected
    }
}

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

export const setProcessUrlActions = (processUrlType, actions) => {
    return {
        type : "SET_PROCESS_URL_ACTIONS",
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
        imageList: imageList,
        videoList: videoList
    }
};

export const setImageList = (imageList) => {
    return {
        type : "SET_IMAGE_LIST",
        imageList: imageList,
    }
};

export const setVideoList = (videoList) => {
    return {
        type : "SET_VIDEO_LIST",
        videoList: videoList,
    }
};


export const cleanAssistantState = () => {
    return {
        type: "CLEAN_STATE"
    }
};
