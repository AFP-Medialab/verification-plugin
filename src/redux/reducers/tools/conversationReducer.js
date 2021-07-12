const defaultState = {
    url: undefined,
    loading : false,
    fail: false,
    errorKey: null,
    //done: false,
    //result: null,
    //id_str: null,
    cloud: null,
    urls: null,
    //tweet_id: null,
    tweet: null,
    conversation: null,
    stance: null,
};

const conversationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_CONVERSATION_INPUT":
        case "SET_CONVERSATION_ROOT":
        case "SET_CONVERSATION_TWEET":
        case "SET_CONVERSATION_CLOUD":
        case "SET_CONVERSATION_STANCE":
            console.log("hit a " + action.type);
            console.log(action.payload);
            return Object.assign({}, state, action.payload)
        /**case "OCR_CLEAN_STATE":
            state = {
                url: undefined,
                b64Image: undefined,
                loading : false,
                errorKey: null,
                fail: false,
                done: false,
                result: null,
            };
            return state;
        **/
        default:
            return state;
    }
};
export default conversationReducer;