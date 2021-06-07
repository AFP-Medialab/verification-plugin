const defaultState = {
    showHomo: false,
    loading: false,
    homoImg1: "",
    homoImg2: "",
    downloading: false,
    reset: false
};

const gifReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_GIF_LOADING":
            state.loading = true;
            return state;
        case "SET_GIF_HOMOGRAPHIC":
            return action.payload;
        case "SET_GIF_DOWNLOADING":
            state.downloading = true;
            return state;
        case "SET_GIF_DOWNLOADED":
            state.downloading = false;
            return state;
        case "SET_GIF_CLEAN":
            state.showHomo = false;
            state.loading = false;
            state.homoImg1 = "reset";
            state.homoImg2 = "reset";
            state.downloading = false;
            state.reset = true;
            return state;
        case "SET_FINISH_RESET":
            state.reset = false;
            return state;
        default:
            return state;
    }
};
export default gifReducer;