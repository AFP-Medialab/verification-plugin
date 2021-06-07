export const setHomogroaphic = (urlImg1, urlImg2) => {
    return {
        type: "SET_GIF_HOMOGRAPHIC",
        payload: {
            showHomo: true,
            loading: false,
            homoImg1: urlImg1,
            homoImg2: urlImg2,
        }
    }
};


export const setGifLoading = () => {
    return {
        type: "SET_GIF_LOADING"
    }
};


export const setGifDownloading = () => {
    return {
        type: "SET_GIF_DOWNLOADING"
    }
};

export const setGifDownloaded= () => {
    return {
        type: "SET_GIF_DOWNLOADED"
    }
};

export const setGifClean = () => {
    return {
        type: "SET_GIF_CLEAN"
    }
};

export const setFinishReset = () => {
    return {
        type: "SET_FINISH_RESET"
    }
};