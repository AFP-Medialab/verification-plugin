const defaultState = {
    showHomo: false,
    loading: false,
    homoImg1: "",
    homoImg2: "",
    downloading: false,
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
        default:
            return state;
    }
};
export default gifReducer;