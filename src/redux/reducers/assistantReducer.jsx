const defaultState = {
  urlMode: false,
  imageVideoSelected: false,
  singleMediaPresent: null,

  inputUrl: null,
  errorKey: null,
  processUrl: null,
  imageList: [],
  videoList: [],
  linkList: [],
  urlText: null,
  textLang: null,
  processUrlActions: [],
  processUrlType: null,
  inputUrlType: null,

  positiveSourceCred: null,
  cautionSourceCred: null,
  mixedSourceCred: null,
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

  newsTopicResult: null,
  newsTopicLoading: false,
  newsTopicDone: false,
  newsTopicFail: false,

  newsGenreResult: null,
  newsGenreLoading: false,
  newsGenreDone: false,
  newsGenreFail: false,

  mtResult: null,
  mtLoading: false,
  mtDone: false,
  mtFail: false,

  loading: false,
  warningExpanded: false,
  assuranceExpanded: false,
  stateExpanded: false,
};

const assistantReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_INPUT_URL":
    case "SET_ERROR_KEY":
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
    case "SET_NEWS_TOPIC_DETAILS":
    case "SET_NEWS_GENRE_DETAILS":
    case "SET_LOADING":
    case "SET_WARNING_EXPANDED":
    case "SET_ASSURANCE_EXPANDED":
    case "SET_STATE_EXPANDED":
    case "SET_MT_DETAILS":
      return Object.assign({}, state, action.payload);

    case "CLEAN_STATE":
      return {
        ...state,
        urlMode: false,
        imageVideoSelected: false,
        singleMediaPresent: null,

        inputUrl: null,
        errorKey: null,
        processUrl: null,
        imageList: [],
        videoList: [],
        linkList: [],
        urlText: null,
        textLang: null,
        processUrlActions: [],
        processUrlType: null,
        inputUrlType: null,

        positiveSourceCred: null,
        cautionSourceCred: null,
        mixedSourceCred: null,
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

        newsTopicResult: null,
        newsTopicLoading: false,
        newsTopicDone: false,
        newsTopicFail: false,

        newsGenreResult: null,
        newsGenreLoading: false,
        newsGenreDone: false,
        newsGenreFail: false,

        mtResult: null,
        mtLoading: false,
        mtDone: false,
        mtFail: false,

        loading: false,
        warningExpanded: false,
        assuranceExpanded: false,
        stateExpanded: false,
      };

    default:
      return state;
  }
};
export default assistantReducer;
