import { createAction } from "@reduxjs/toolkit";

export const setForensicsResult = createAction("SET_FORENSIC_RESULT");

/*export const setForensicsResult = (url, result, notification, loading) => {
    return {
        type: "SET_FORENSIC_RESULT",
        payload: {
            notification: notification,
            loading: loading,
            url: url,
            result: result,
            gifAnimation: false,
            
        }
    }
};*/
//masks: masks,
export const setForensicMask = createAction("SET_FORENSIC_MASK");
/*export const setForensicMask = (masks) => {
    return {
        type: "SET_FORENSIC_MASK",
        payload: masks

    }
};*/

export const setForensicsLoading = createAction("SET_FORENSIC_LOADING");

/*export const setForensicsLoading = (loading) => {
    return {
        type: "SET_FORENSIC_LOADING",
        payload: loading
    }
};*/

export const cleanForensicState = createAction("FORENSIC_CLEAN_STATE");
/*export const cleanForensicState = () => {
    return {
        type: "FORENSIC_CLEAN_STATE"
    }
};*/

export const setForensicsGifAnimateShow = createAction("SET_FORENSIC_GIF_SHOW");
/*export const setForensicsGifAnimateShow = () => {
    return {
        type: "SET_FORENSIC_GIF_SHOW",
    }
};*/

export const setForensicsGifAnimateHide = createAction("SET_FORENSIC_GIF_HIDE");
/*export const setForensicsGifAnimateHide = () => {
    return {
        type: "SET_FORENSIC_GIF_HIDE",
    }
};*/

export const setForensicMaskGif = createAction("SET_FORENSIC_MASK_GIF");
/*export const setForensicMaskGif = (url) => {
    return {
        type: "SET_FORENSIC_MASK_GIF",
        payload: url
    }
};*/

export const setForensicKey = createAction("SET_FORENSIC_ERROR_KEY");

/*export const setForensicKey = (errorKey) => {
    return {
        type: "SET_FORENSIC_ERROR_KEY",
        payload: {
            errorKey: errorKey,
        }
    }

};*/

export const setForensicDisplayItem = createAction("SET_FORENSIC_DISPLAY_ITEM");
/*export const setForensicDisplayItem = (itemUrl) => {
    return {
        type: "SET_FORENSIC_DISPLAY_ITEM",
        payload: itemUrl
    }
}*/

export const setForensicInputFile = createAction("SET_FORENSIC_LOCAL_FILE");
/*export const setForensicInputFile = (localurl) => {
    return {
        type: "SET_FORENSIC_LOCAL_FILE",
        payload: {
            localurl: localurl,
        }
    }
}*/
