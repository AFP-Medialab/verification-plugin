const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const analysisReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_ANALYSIS_RESULT":
            return action.payload;
        case "SET_ANALYSIS_LOADING":
            state.loading = action.payload;
            return state;
        case "ANALYSIS_CLEAN_STATE":
            state.result = null;
            state.url = "";
            return state;
        default:
            return state;
    }
};
export default analysisReducer;