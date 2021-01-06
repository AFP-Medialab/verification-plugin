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
    textLang: null,
    processUrlActions : [],
    processUrlType: null,

    inputUrlSourceCredibility: null,
    inputSCLoading: false,
    inputSCDone: false,
    inputSCFail: false,

    dbkfTextMatch: null,
    dbkfTextMatchLoading: false,
    dbkfTextMatchDone: false,
    dbkfTextMatchFail: false,

    dbkfImageMatch: null,
    dbkfVideoMatch: null,
    dbkfMediaMatchLoading: false,
    dbkfMediaMatchDone: false,
    dbkfMediaMatchFail: false,

    hpResult: null,
    hpLoading: false,
    hpDone: false,
    hpFail: false,

    neResultCategory: null,
    neResultCount: null,
    neLoading: false,
    neDone: false,
    neFail: false,

    mtResult: null,
    mtLoading: false,
    mtDone: false,
    mtFail: false,

    loading: false,
    warningExpanded: false,
    stateExpanded: false
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
        case "SET_HP_DETAILS":
        case "SET_NE_DETAILS":
        case "SET_LOADING":
        case "SET_WARNING_EXPANDED":
        case "SET_STATE_EXPANDED":
        case "SET_MT_DETAILS":
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
                textLang: null,
                processUrlActions : [],
                processUrlType: null,

                inputUrlSourceCredibility: null,
                inputSCLoading: false,
                inputSCDone: false,
                inputSCFail: false,

                dbkfTextMatch: null,
                dbkfTextMatchLoading: false,
                dbkfTextMatchDone: false,
                dbkfTextMatchFail: false,

                dbkfImageMatch: null,
                dbkfVideoMatch: null,
                dbkfMediaMatchLoading: false,
                dbkfMediaMatchDone: false,
                dbkfMediaMatchFail: false,

                hpResult: null,
                hpLoading: false,
                hpDone: false,
                hpFail: false,

                neResultCategory: null,
                neResultCount: null,
                neLoading: false,
                neDone: false,
                neFail: false,

                mtResult: null,
                mtLoading: false,
                mtDone: false,
                mtFail: false,

                loading: false,
                warningExpanded: false,
                stateExpanded: false
            };
            return state;

        default:
            return state;
    }
};
export default assistantReducer;