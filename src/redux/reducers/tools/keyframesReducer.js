const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
    message : "",
};

const keyframesReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_KEYFRAMES_RESULT":
            return action.payload;
        case "SET_KEYFRAMES_LOADING":
            return {...state, loading: action.payload};
        case "SET_KEYFRAMES_MESSAGE":
            return {...state, message:action.payload};
        case "KEYFRAMES_CLEAN_STATE":                        
            return {...state, url:"", result:null};
        default:
            return state;
    }
};
export default keyframesReducer;