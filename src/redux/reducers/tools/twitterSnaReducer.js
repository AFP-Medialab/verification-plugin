const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const twitterSnaReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TWITTER_SNA_RESULT":
            return action.payload;
        case "SET_TWITTER_SNA_LOADING":
            state.loading = action.payload;
            return state;
        case "TWITTER_SNA_CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default twitterSnaReducer;