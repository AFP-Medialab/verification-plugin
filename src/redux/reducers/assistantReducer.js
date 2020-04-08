const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: "",
};

const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_ASSISTANT_RESULT":
            state.result = action.payload;
            return state;
        case "SET_ASSISTANT_LOADING":
            state.loading = action.payload;
            return state;
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