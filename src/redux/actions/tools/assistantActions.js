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


export const setProcessUrl = (processUrl, processUrlType) => {
    return {
        type : "SET_PROCESS_URL",
        processUrl : processUrl,
        processUrlType: processUrlType
    }
};

export const setProcessUrlType = (processUrlType) => {
    return {
        type : "SET_PROCESS_URL_TYPE",
        payload : processUrlType
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

export const setInputSCLoading = (inputSCLoading) => {
    return {
        type: "SET_INPUT_SC_LOADING",
        payload: inputSCLoading
    }
}


export const setTextMatchLoading = (textMatchingLoading) => {
    return {
        type: "SET_TEXT_MATCH_LOADING",
        payload: textMatchingLoading
    }
}

export const setAssistantLoading = (loading) => {
    return {
        type: "SET_LOADING",
        loading: loading
    }
}


export const setDbkfTextMatch = (claims) => {
    return {
        type: "SET_DBKF_CLAIMS",
        payload: claims
    }
}


export const setDbkfImageMatch = (claims) => {
    return {
        type: "SET_DBKF_IMAGE_MATCH",
        payload: claims
    }
}

export const setDbkfVideoMatch = (claims) => {
    return {
        type: "SET_DBKF_VIDEO_MATCH",
        payload: claims
    }
}

export const setOcrTextResult = (ocrText) => {
    return {
        type: "SET_OCR_TEXT_RESULT",
        payload: ocrText
    }
}

export const setOcrLoading = (ocrLoading) => {
    return {
        type: "SET_OCR_LOADING",
        payload: ocrLoading
    }
}

export const setSingleMediaPresent = (singleMediaPresent) => {
    return {
        type: "SET_SINGLE_MEDIA_PRESENT",
        payload: singleMediaPresent
    }
}

export const setWarningExpanded = (warningExpanded) => {
    return {
        type: "SET_WARNING_EXPANDED",
        payload: warningExpanded
    }
}

export const setDbkfMediaMatchLoading = (dbkfMediaMatchLoading) => {
    return {
        type: "SET_DBKF_MEDIA_MATCH_LOADING",
        payload: dbkfMediaMatchLoading
    }
}


export const cleanAssistantState = () => {
    return {
        type: "CLEAN_STATE"
    }
};
