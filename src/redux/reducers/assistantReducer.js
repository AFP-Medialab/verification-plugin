const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: "",
    processUrl : null,
};

const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_ASSISTANT_RESULT":
            return action.payload;
        case "ASSISTANT_CLEAN_STATE":
            state.notification = false;
            state.loading = false;
            state.url = "";
            state.result = "";
            return state;
        default:
            return state;
    }
};
export default assistantReducer;