export const setUrlMode = (mode) => {
    return {
        type : "SET_MODE",
        payload: {
            urlMode: mode
        }
    }
};


export const setImageVideoSelected = (imageVideoSelected) => {
    return {
        type: "SET_IMAGE_VIDEO_SELECTED",
        payload: {
            imageVideoSelected: imageVideoSelected,
        }
    }
}

export const setInputUrl = (inputUrl) => {
    return {
        type : "SET_INPUT_URL",
        payload: {
            inputUrl: inputUrl,
        }
    }
};


export const setProcessUrlActions = (contentType, actions) => {
    return {
        type : "SET_PROCESS_URL_ACTIONS",
        payload: {
            processUrlType: contentType,
            processUrlActions : actions
        }
    }
};


export const setProcessUrl = (processUrl, processUrlType, ocrDone, dbkfMediaMatchDone) => {
    return {
        type : "SET_PROCESS_URL",
        payload: {
            processUrl: processUrl,
            processUrlType: processUrlType,
            ocrDone: ocrDone,
            dbkfMediaMatchDone: dbkfMediaMatchDone

        }
    }
};


export const setScrapedData = (text,lang, links, images, videos) => {
    return {
        type: "SET_SCRAPED_DATA",
        payload: {
            urlText: text,
            textLang: lang,
            linkList: links,
            imageList: images,
            videoList: videos
        }
    }
}

export const setInputSourceCredDetails = (inputSC, inputSCLoading, inputSCDone, inputSCFail) => {
    return {
        type: "SET_INPUT_SC_DETAILS",
        payload: {
            inputUrlSourceCredibility: inputSC,
            inputSCLoading: inputSCLoading,
            inputSCDone: inputSCDone,
            inputSCFail: inputSCFail
        }
    }
}


export const setAssistantLoading = (loading) => {
    return {
        type: "SET_LOADING",
        payload:{
            loading: loading
        }
    }
}

export const setDbkfTextMatchDetails = (textMatch, textMatchLoading, textMatchDone, textMatchFail) => {
    return {
        type: "SET_DBKF_TEXT_MATCH_DETAILS",
        payload: {
            dbkfTextMatch: textMatch,
            dbkfTextMatchLoading: textMatchLoading,
            dbkfTextMatchDone: textMatchDone,
            dbkfTextMatchFail: textMatchFail
        }
    }
}

export const setDbkfImageMatchDetails = (imageMatch, dbkfMediaMatchLoading, dbkfMediaMatchDone, dbkfMediaMatchFail) => {
    return {
        type: "SET_DBKF_IMAGE_MATCH_DETAILS",
        payload: {
            dbkfImageMatch: imageMatch,
            dbkfMediaMatchLoading: dbkfMediaMatchLoading,
            dbkfMediaMatchDone: dbkfMediaMatchDone,
            dbkfMediaMatchFail: dbkfMediaMatchFail
        }
    }
}

export const setDbkfVideoMatchDetails = (videoMatch, dbkfMediaMatchLoading, dbkfMediaMatchDone, dbkfMediaMatchFail) => {
    return {
        type: "SET_DBKF_VIDEO_MATCH_DETAILS",
        payload: {
            dbkfImageMatch: videoMatch,
            dbkfMediaMatchLoading: dbkfMediaMatchLoading,
            dbkfMediaMatchDone: dbkfMediaMatchDone,
            dbkfMediaMatchFail: dbkfMediaMatchFail
        }
    }
}

export const setOcrDetails = (ocrText, ocrLoading, ocrDone) => {
    return {
        type: "SET_OCR_DETAILS",
        payload: {
            ocrResult: ocrText,
            ocrLoading: ocrLoading,
            ocrDone: ocrDone
        }
    }
}

export const setHpDetails = (hpResult, hpLoading, hpDone, hpFail) => {
    return {
        type: "SET_HP_DETAILS",
        payload: {
            hpResult: hpResult,
            hpLoading: hpLoading,
            hpDone: hpDone,
            hpFail: hpFail
        }
    }
}

export const setNeDetails = (neResultCategory, neResultCount, neLoading, neDone, neFail) => {
    return {
        type: "SET_NE_DETAILS",
        payload: {
            neResultCategory: neResultCategory,
            neResultCount: neResultCount,
            neLoading: neLoading,
            neDone: neDone,
            neFail: neFail
        }
    }
}


export const setSingleMediaPresent = (singleMediaPresent) => {
    return {
        type: "SET_SINGLE_MEDIA_PRESENT",
        payload: {
            singleMediaPresent: singleMediaPresent
        }
    }
}

export const setWarningExpanded = (warningExpanded) => {
    return {
        type: "SET_WARNING_EXPANDED",
        payload: {
            warningExpanded: warningExpanded
        }
    }
}

export const setStateExpanded = (stateExpanded) => {
    return {
        type: "SET_STATE_EXPANDED",
        payload: {
            stateExpanded: stateExpanded
        }
    }
}


export const cleanAssistantState = () => {
    return {
        type: "CLEAN_STATE"
    }
};
