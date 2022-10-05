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
            return {...state, loading:action.payload};
        case "SET_METADATA_IS_IMAGE":
            return {...state, isImage: action.payload};
        case "METADATA_CLEAN_STATE":
            return {...state, url:"", result:null};
        case "SET_METADATA_MEDIA_TYPE":
            return {...state, mediaType:action.payload};
        default:
            return state;
    }
};
export default metadataReducer;