const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const thumbnailsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_THUMBNAILS_RESULT":
            return action.payload;
        case "SET_THUMBNAILS_LOADING":
            state.loading = action.payload;
            return state;
        case "THUMBNAILS_CLEAN_STATE":
            state.url = "";
            state.result = null;
            return state;
        default:
            return state;
    }
};
export default thumbnailsReducer;