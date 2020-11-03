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


export const setScrapedData = (text, links, images, videos) => {
    return {
        type: "SET_SCRAPED_DATA",
        text: text,
        links: links,
        images: images,
        videos: videos
    }
}

export const setInputSC = (inputSC) => {
    return {
        type: "SET_INPUT_SC",
        payload: inputSC
    }
}


export const setLinkListSC = (linkListSC) => {
    return {
        type: "SET_LINK_LIST_SC",
        payload: linkListSC
    }
}

export const setInputSCLoading = (inputSCLoading) => {
    return {
        type: "SET_INPUT_SC_LOADING",
        payload: inputSCLoading
    }
}


export const setLinkListSCLoading = (linkListSCLoading) => {
    return {
        type: "SET_LIST_LIST_SC_LOADING",
        payload: linkListSCLoading
    }
}

export const setAssistantLoading = (loading) => {
    return {
        type: "SET_LOADING",
        loading: loading
    }
}


export const setDbkfClaims = (claims) => {
    return {
        type: "SET_DBKF_CLAIMS",
        payload: claims
    }
}


export const cleanAssistantState = () => {
    return {
        type: "CLEAN_STATE"
    }
};
