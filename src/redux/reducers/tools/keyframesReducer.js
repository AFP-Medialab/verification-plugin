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
            state.loading = action.payload;
            return state;
        case "SET_KEYFRAMES_MESSAGE":
            state.message = action.payload;
            return state;
        case "KEYFRAMES_CLEAN_STATE":
            state.url = "";
            state.result = null;
            return state;
        default:
            return state;
    }
};
export default keyframesReducer;