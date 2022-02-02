const defaultState = {
    url: "",
    result: null,
    loading: false,
    type: "",
};

const deepfakeReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "DEEPFAKE_RESET":
            return {
                ...state,
                url: "",
                result: null,
                loading: false,
                type: "",
            }
        case "SET_DEEPFAKE_TYPE":
            return {
                ...state,
                type: action.payload,
            }
        case "SET_DEEPFAKE_LOADING":
            return {
                ...state,
                loading: action.payload,
            }
        case "SET_DEEPFAKE_RESULT":
            return {
                ...state,
                url: action.payload.url,
                result: action.payload.result,
                loading: false,
            }
        default:
            return state;
    }
};
export default deepfakeReducer;