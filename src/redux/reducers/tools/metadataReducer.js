const defaultState = {
    isImage : true,
    notification : false,
    loading : false,
    url: "",
    result: null,
    mediaType: "nomedia",
};

const metadataReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_METADATA_RESULT":
            return action.payload;
        case "SET_METADATA_LOADING":
            state.loading = action.payload;
            return state;
        case "SET_METADATA_IS_IMAGE":
            state.isImage = action.payload;
            return state;
        case "METADATA_CLEAN_STATE":
            state.url = "";
            state.result = null;
            return state;
        case "SET_METADATA_MEDIA_TYPE":
            state.mediaType = action.payload;
            return state;
        default:
            return state;
    }
};
export default metadataReducer;