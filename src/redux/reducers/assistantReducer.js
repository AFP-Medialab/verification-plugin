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
    inputSCDone: true,

    dbkfTextMatch: null,
    dbkfTextMatchLoading: false,
    dbkfTextMatchDone: false,

    dbkfImageMatch: null,
    dbkfVideoMatch: null,
    dbkfMediaMatchLoading: false,
    dbkfMediaMatchDone: false,

    ocrResult: null,
    ocrLoading: false,
    ocrDone: false,

    hpResult: null,
    hpLoading: false,
    hpDone: false,

    loading: false,
    warningExpanded: false
};


const assistantReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_INPUT_URL":
        case "SET_PROCESS_URL":
        case "SET_SCRAPED_DATA":
        case "SET_PROCESS_URL_ACTIONS":
        case "SET_MODE":
        case "SET_IMAGE_VIDEO_SELECTED":
        case "SET_SINGLE_MEDIA_PRESENT":
        case "SET_INPUT_SC_DETAILS":
        case "SET_DBKF_TEXT_MATCH_DETAILS":
        case "SET_DBKF_IMAGE_MATCH_DETAILS":
        case "SET_DBKF_VIDEO_MATCH_DETAILS":
        case "SET_OCR_DETAILS":
        case "SET_HP_DETAILS":
        case "SET_LOADING":
        case "SET_WARNING_EXPANDED":
            return Object.assign({}, state, action.payload)


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
                inputSCDone: false,

                dbkfTextMatch: null,
                dbkfTextMatchLoading: false,
                dbkfTextMatchDone: false,

                dbkfImageMatch: null,
                dbkfVideoMatch: null,
                dbkfMediaMatchLoading: false,
                dbkfMediaMatchDone: false,

                ocrResult: null,
                ocrLoading: false,
                ocrDone: false,

                hpResult: null,
                hpLoading: false,
                hpDone: false,

                loading: false,
                warningExpanded: false
            };
            return state;

        default:
            return state;
    }
};
export default assistantReducer;