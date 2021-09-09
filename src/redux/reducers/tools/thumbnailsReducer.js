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
            return {...state, loading: action.payload};
        case "THUMBNAILS_CLEAN_STATE":
            return {...state, url:"", result:null};
        default:
            return state;
    }
};
export default thumbnailsReducer;