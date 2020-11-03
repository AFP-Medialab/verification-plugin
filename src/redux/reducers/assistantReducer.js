const defaultState = {
    urlMode: null,
    imageVideoSelected: false,
    inputUrl: null,
    processUrl: null,
    imageList: [],
    videoList: [],
    linkList: [],
    urlText: null,
    processUrlActions : [],
    processUrlType: null,
    inputUrlActions: null,
    inputUrlSc: null,
    inputSCLoading: false,
    linkListSC: null,
    linkListSCLoading: false,
    dbkfClaims: null,
    loading: false
};


const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_INPUT_URL":
            state.inputUrl = action.payload;
            return state;

        case "SET_PROCESS_URL":
            state.processUrl = action.payload;
            return state;


        case "SET_SCRAPED_DATA":
            state.urlText = action.text
            state.linkList = action.links
            state.imageList = action.images
            state.videoList = action.videos
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


        case "SET_INPUT_SC":
            state.inputUrlSc = action.payload
            return state;


        case "SET_LINK_LIST_SC":
            state.linkListSC = action.payload
            return state;

        case "SET_INPUT_SC_LOADING":
            state.inputSCLoading = action.payload
            return state;


        case "LINK_LIST_SC_LOADING":
            state.linkListSCLoading = action.payload
            return state;


        case "SET_DBKF_CLAIMS":
            state.dbkfClaims = action.payload
            return state


        case "SET_LOADING":
            state.loading = action.loading
            return state;


        case "CLEAN_STATE":
            state = {
                urlMode: null,
                imageVideoSelected: false,
                inputUrl: null,
                processUrl: null,
                imageList: [],
                videoList: [],
                linkList: [],
                urlText: null,
                processUrlActions : [],
                processUrlType: null,
                inputUrlActions: null,
                inputUrlSc: null,
                inputSCLoading: false,
                linkListSC: null,
                linkListSCLoading: false,
                dbkfClaims: null,
                loading: false
            };
            return state;

        default:
            return state;
    }
};
export default assistantReducer;