const defaultState = {
    notification: false,
    loading: false,
    url: "",
    result: null,
    gifAnimation: false,
    maskUrl: "",
    masks: null,
};

const forensicReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_FORENSIC_RESULT":
            return action.payload;
        case "SET_FORENSIC_MASK":
            return {...state, masks:action.payload};
        case "SET_FORENSIC_LOADING":
            return {...state, loading:action.payload};
        case "FORENSIC_CLEAN_STATE":
            return {
                ...state, notification: false, loading: false,
                url: "",
                result: null,
                gifAnimation: false,
                maskUrl: ""
            }
        case "SET_FORENSIC_GIF_HIDE":
            return {...state, gifAnimation:false};
        case "SET_FORENSIC_GIF_SHOW":
            return {...state, gifAnimation:true};
        case "SET_FORENSIC_MASK_GIF":
            return {...state, maskUrl:action.payload};
        default:
            return state;
    }
};
export default forensicReducer;