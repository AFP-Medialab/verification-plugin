const defaultState = {
    urlMode: true,
    imageVideoSelected: false,
    singleMediaPresent: null,
    inputUrl: null,
    processUrl: null,
    imageList: [],
    videoList: [],
    linkList: [],
    urlText: null,
    processUrlActions : [],
    processUrlType: null,
    inputUrlSourceCredibility: null,
    inputSCLoading: false,
    textMatchLoading: false,
    dbkfTextMatch: null,
    dbkfImageMatch: null,
    dbkfVideoMatch: null,
    dbkfMediaMatchLoading: false,
    ocrTextResult: null,
    ocrLoading: null,
    loading: false,
    warningExpanded: false
};


const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_INPUT_URL":
            state.inputUrl = action.payload;
            return state;

        case "SET_PROCESS_URL":
            // return Object.assign({}, state, action)
            state.processUrl = action.processUrl;
            state.processUrlType = action.processUrlType;

        case "SET_PROCESS_URL_TYPE":
            state.processUrlType = action.payload;
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
            state.inputUrlSourceCredibility = action.payload
            return state;

        case "SET_INPUT_SC_LOADING":
            state.inputSCLoading = action.payload
            return state;


        case "SET_TEXT_MATCH_LOADING":
            state.textMatchLoading = action.payload
            return state;


        case "SET_DBKF_CLAIMS":
            state.dbkfTextMatch = action.payload
            return state

        case "SET_DBKF_IMAGE_MATCH":
            state.dbkfImageMatch = action.payload
            return state

        case "SET_DBKF_VIDEO_MATCH":
            state.dbkfVideoMatch = action.payload
            return state

        case "SET_OCR_TEXT_RESULT":
            state.ocrTextResult = action.payload
            return state

        case "SET_SINGLE_MEDIA_PRESENT":
            state.singleMediaPresent = action.payload
            return state

        case "SET_OCR_LOADING":
            state.ocrLoading = action.payload
            return state

        case "SET_DBKF_MEDIA_MATCH_LOADING":
            state.dbkfMediaMatchLoading = action.payload
            return state


        case "SET_LOADING":
            state.loading = action.loading
            return state;

        case "SET_WARNING_EXPANDED":
            state.warningExpanded = action.payload
            return state;


        case "CLEAN_STATE":
            state = {
                urlMode: true,
                imageVideoSelected: false,
                singleMediaPresent: null,
                inputUrl: null,
                processUrl: null,
                imageList: [],
                videoList: [],
                linkList: [],
                urlText: null,
                processUrlActions : [],
                processUrlType: null,
                inputUrlSourceCredibility: null,
                inputSCLoading: false,
                textMatchLoading: false,
                dbkfTextMatch: null,
                dbkfImageMatch: null,
                dbkfVideoMatch: null,
                ocrTextResult: null,
                ocrLoading: null,
                loading: false,
                warningExpanded: false,
                dbkfMediaMatchLoading: false
            };
            return state;

        default:
            return state;
    }
};
export default assistantReducer;