const defaultState = {
    urlMode: null,
    requireLogIn: false,
    inputUrl: null,
    processUrl: null,
    imageList: [],
    videoList: [],
    processUrlActions : [],
    processUrlType: null,
    inputUrlActions: null
};

const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_INPUT_URL":
            state.inputUrl = action.payload;
            return state;

        case "SET_PROCESS_URL":
            state.processUrl = action.payload;
            return state;

        case "SET_MEDIA_LISTS":
            return action.payload;

        case "SET_PROCESS_URL_ACTIONS":
            state.inputUrl = action.inputUrl;
            state.processUrl = action.processUrl;
            state.processUrlType = action.processUrlType;
            state.processUrlActions = action.payload;
            return state;

        case "SET_MODE":
            state.urlMode = action.payload;
            return state;

        case "SET_REQUIRE_LOGIN":
            state.requireLogIn = action.payload;
            return state;

        case "CLEAN_STATE":
            state = {
                urlMode: null,
                requireLogIn: false,
                inputUrl: null,
                processUrl: null,
                imageList: [],
                videoList: [],
                processUrlActions : [],
                processUrlType: null,
                inputUrlActions: null
            };
            return state;

        default:
            return state;
    }
};
export default assistantReducer;