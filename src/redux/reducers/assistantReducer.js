const defaultState = {
    urlMode: null,
    imageVideoSelected: false,
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
            state.imageList = action.imageList;
            state.videoList = action.videoList;
            return state;

        case "SET_IMAGE_LIST":
            state.imageList = action.imageList;
            return state;

        case "SET_VIDEO_LIST":
            state.videoList = action.videoList;
            return state;

        case "SET_PROCESS_URL_ACTIONS":
            state.processUrlType = action.processUrlType;
            state.processUrlActions = action.payload;
            return state;

        case "SET_MODE":
            state.urlMode = action.payload;
            return state;

        case "SET_IMAGE_VIDEO_SELECTED":
            state.imageVideoSelected = action.payload;
            return state;

        case "SET_REQUIRE_LOGIN":
            state.requireLogIn = action.payload;
            return state;

        case "CLEAN_STATE":
            state = {
                urlMode: null,
                imageVideoSelected: false,
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