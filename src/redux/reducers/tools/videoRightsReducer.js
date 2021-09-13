const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const videoRightsReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_VIDEO_RIGHTS_RESULT":
            return action.payload;
        case "SET_VIDEO_RIGHTS_LOADING":
            return {...state, loading:action.payload};
        case "VIDEO_RIGHTS_CLEAN_STATE":
            return {...state, url:"", result:null};
        default:
            return state;
    }
};
export default videoRightsReducer;