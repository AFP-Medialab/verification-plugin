const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const forensicReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_FORENSIC_RESULT":
            return action.payload;
        case "SET_FORENSIC_LOADING":
            state.loading = action.payload;
            return state;
        case "FORENSIC_CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default forensicReducer;