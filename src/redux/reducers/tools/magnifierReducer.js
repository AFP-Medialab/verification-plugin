const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const magnifierReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_MAGNIFIER_RESULT":
            return action.payload;
        case "SET_MAGNIFIER_LOADING":
            state.loading = action.payload;
            return state;
        case "MAGNIFIER_CLEAN_STATE":
            state.url = "";
            state.result = null;
            return state;
        default:
            return state;
    }
};
export default magnifierReducer;