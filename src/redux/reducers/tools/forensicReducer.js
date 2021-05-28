const defaultState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
    gifAnimation: false,
    maskUrl: "",
};

const forensicReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_FORENSIC_RESULT":
            return action.payload;
        case "SET_FORENSIC_LOADING":
            state.loading = action.payload;
            return state;
        case "FORENSIC_CLEAN_STATE":
            state.url = "";
            state.result = null;
            return state;
        case "SET_FORENSIC_GIF_HIDE":
            state.gifAnimation = false;
            return state;
        case "SET_FORENSIC_GIF_SHOW":
            state.gifAnimation = true;
            return state;
        case "SET_FORENSIC_MASK_GIF":
            state.maskUrl = action.payload;
            return state;
        default:
            return state;
    }
};
export default forensicReducer;