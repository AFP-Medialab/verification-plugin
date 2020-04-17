const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: "",
    processUrl : null,
    processType : null,
};

const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_ASSISTANT_RESULT":
            return action.payload;
        case "ASSISTANT_CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default assistantReducer;