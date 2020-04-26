const defaultState = {
    notification: false,
    loading: false,
    loadingMessage: "",
    url: "",
    request: "",
    resultData: null,
    tweet: "",
    mediaUrl: "",
};

const twitterReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TWITTER_RESULT":
            return action.payload;
        case "SET_TWITTER_LOADING":
            state.loading = action.payload;
            return state;
        case "SET_TWITTER_URL":
            state.url = action.payload;
            return state;
        case "SET_TWITTER_TWEET":
            state.tweet = action.payload;
            return state;
        case "SET_TWITTER_MEDIA":
            state.mediaUrl = action.payload;
            return state;
        case "SET_TWITTER_SNA_LOADING_MSG":
            state.loadingMessage = action.payload;
            return state;
        case "TWITTER_CLEAN_STATE":
            return action.payload;
        default:
            return state;
    }
};
export default twitterReducer;