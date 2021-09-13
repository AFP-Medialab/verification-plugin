const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    request: "",
    result: null,
};

const twitterSnaReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TWITTER_SNA_RESULT":
            return action.payload;
        case "SET_TWITTER_SNA_LOADING":
            return {...state, loading:action.payload};
        case "SET_TWITTER_SNA_LOADING_MSG":
            return {...state, loadingMessage: action.payload};
        case "TWITTER_SNA_CLEAN_STATE":
            return {...state, request:"", result:null};
        default:
            return state;
    }
};
export default twitterSnaReducer;