const defaultState = {
    url: undefined,
    b64Image: undefined,
    loading : false,
    fail: false,
    errorKey: null,
    done: false,
    result: null,
    scripts: null,
    selectedScript: "auto"
};

const ocrReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_OCR_INPUT":
        case "SET_OCR_RESULT":
        case "SET_B64_IMG":
        case "SET_OCR_ERROR_KEY":
        case "SET_SCRIPTS":
        case "SET_SELECTED_SCRIPT":
            return Object.assign({}, state, action.payload)
        case "OCR_CLEAN_STATE":
            return {...state, url: undefined,
                b64Image: undefined,
                loading : false,
                errorKey: null,
                fail: false,
                done: false,
                result: null,
                selectedScript: "auto"};
        default:
            return state;
    }
};
export default ocrReducer;