const defaultState = {
    url: undefined,
    //loading : false,
    fail: false,
    errorKey: null,
    //done: false,
    //result: null,
    id_str: null,
    cloud: null,
};

const conversationReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_CONVERSATION_INPUT":
        case "SET_CONVERSATION_TWEET":
        case "SET_CONVERSATION_CLOUD":
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