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
  urlTextHtmlMap: null,
  collectedComments: null,
  textLang: null,
  processUrlActions: [],
  processUrlType: null,
  inputUrlType: null,

  positiveSourceCred: null,
  cautionSourceCred: null,
  mixedSourceCred: null,
  extractedSourceCred: {},
  trafficLightColors: [],
  extractedLinks: [],
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

  neResultCategory: null,
  neResultCount: null,
  neLoading: false,
  neDone: false,
  neFail: false,

  newsFramingResult: null,
  newsFramingLoading: false,
  newsFramingDone: false,
  newsFramingFail: false,

  newsGenreResult: null,
  newsGenreLoading: false,
  newsGenreDone: false,
  newsGenreFail: false,

  persuasionResult: null,
  persuasionLoading: false,
  persuasionDone: false,
  persuasionFail: false,

  subjectivityResult: null,
  subjectivityLoading: false,
  subjectivityTextDone: false,
  subjectivityTextFail: false,

  prevFactChecksResult: null,
  prevFactChecksLoading: false,
  prevFactChecksDone: false,
  prevFactChecksFail: false,

  machineGeneratedTextChunksResult: null,
  machineGeneratedTextChunksLoading: false,
  machineGeneratedTextChunksDone: false,
  machineGeneratedTextChunksFail: false,

  machineGeneratedTextSentencesResult: null,
  machineGeneratedTextSentencesLoading: false,
  machineGeneratedTextSentencesDone: false,
  machineGeneratedTextSentencesFail: false,

  multilingualStanceResult: null,
  multilingualStanceLoading: false,
  multilingualStanceDone: false,
  multilingualStanceFail: false,

  loading: false,
  warningExpanded: false,
  assuranceExpanded: false,
  stateExpanded: false,

  importantSentenceThreshold: 80,

  currentLabel: "all",
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
    case "SET_NE_DETAILS":
    case "SET_NEWS_TOPIC_DETAILS":
    case "SET_NEWS_GENRE_DETAILS":
    case "SET_PERSUASION_DETAILS":
    case "SET_SUBJECTIVITY_DETAILS":
    case "SET_PREV_FACT_CHECKS_DETAILS":
    case "SET_MACHINE_GENERATED_TEXT_CHUNKS_DETAILS":
    case "SET_MACHINE_GENERATED_TEXT_SENTENCES_DETAILS":
    case "SET_MULTILINGUAL_STANCE_DETAILS":
    case "SET_LOADING":
    case "SET_MISSING_MEDIA":
    case "SET_WARNING_EXPANDED":
    case "SET_ASSURANCE_EXPANDED":
    case "SET_STATE_EXPANDED":
      return Object.assign({}, state, action.payload);

    case "SET_IMPORTANT_SENTENCE_THRESHOLD":
      return {
        ...state,
        importantSentenceThreshold: action.payload,
      };

    case "SET_CURRENT_LABEL":
      return {
        ...state,
        currentLabel: action.payload,
      };

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
        urlTextHtmlMap: null,
        collectedComments: null,
        textLang: null,
        processUrlActions: [],
        processUrlType: null,
        inputUrlType: null,

        positiveSourceCred: null,
        cautionSourceCred: null,
        mixedSourceCred: null,
        extractedSourceCred: {},
        trafficLightColors: [],
        extractedLinks: [],
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

        neResultCategory: null,
        neResultCount: null,
        neLoading: false,
        neDone: false,
        neFail: false,

        newsFramingResult: null,
        newsFramingLoading: false,
        newsFramingDone: false,
        newsFramingFail: false,

        newsGenreResult: null,
        newsGenreLoading: false,
        newsGenreDone: false,
        newsGenreFail: false,

        persuasionResult: null,
        persuasionLoading: false,
        persuasionDone: false,
        persuasionFail: false,

        subjectivityResult: null,
        subjectivityLoading: false,
        subjectivityTextDone: false,
        subjectivityTextFail: false,

        prevFactChecksResult: null,
        prevFactChecksLoading: false,
        prevFactChecksDone: false,
        prevFactChecksFail: false,

        machineGeneratedTextChunksResult: null,
        machineGeneratedTextChunksLoading: false,
        machineGeneratedTextChunksDone: false,
        machineGeneratedTextChunksFail: false,

        machineGeneratedTextSentencesResult: null,
        machineGeneratedTextSentencesLoading: false,
        machineGeneratedTextSentencesDone: false,
        machineGeneratedTextSentencesFail: false,

        multilingualStanceResult: null,
        multilingualStanceLoading: false,
        multilingualStanceDone: false,
        multilingualStanceFail: false,

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
