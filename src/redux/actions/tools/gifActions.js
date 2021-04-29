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

