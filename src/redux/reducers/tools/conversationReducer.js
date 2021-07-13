const defaultState = {
    url: undefined,
    loading : false,
//  fail: false,
//  errorKey: null,
    cloud: null,
    urls: null,
    tweet: null,
    conversation: null,
    stance: null,
};

const conversationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_CONVERSATION_INPUT":
            // if we have a new URL then start a clean state
            state = defaultState;
        case "SET_CONVERSATION_ROOT":
        case "SET_CONVERSATION_TWEET":
        case "SET_CONVERSATION_CLOUD":
        case "SET_CONVERSATION_STANCE":
            // whatever we are being asked to do just push
            // the payload into the state
            return Object.assign({}, state, action.payload)
        default:
            return state;
    }
};
export default conversationReducer;