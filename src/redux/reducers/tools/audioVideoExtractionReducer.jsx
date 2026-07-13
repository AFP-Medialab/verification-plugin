const defaultState = {
  url: "",
  result: null,
  loading: false,
  type: "",
  endCutTime: null,
  beginCutTime: null,
  keyframes: null,
  keyframesLoading: null,
};

const audioVideoExtractionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "AUDIO_EXTRACTION_RESET":
      return {
        ...state,
        url: "",
        result: null,
        file: null,
        loading: false,
        type: "",
        endCutTime: null,
        beginCutTime: null,
        keyframes: null,
      };
    case "SET_AUDIO_EXTRACTION_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_AUDIO_EXTRACTION_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    case "SET_AUDIO_EXTRACTION_RESULT":
      return {
        ...state,
        result: action.payload ? action.payload.url : null,
        loading: false,
      };
    case "SET_BEGIN_CUT_TIME":
      return {
        ...state,
        beginCutTime: action.payload,
      };
    case "SET_END_CUT_TIME":
      return {
        ...state,
        endCutTime: action.payload,
      };
    case "SET_KEYFRAMES":
      return {
        ...state,
        keyframes: action.payload,
      };
    case "SET_KEYFRAMES_LOADING":
      return {
        ...state,
        keyframesLoading: action.payload,
      };
    default:
      return state;
  }
};
export default audioVideoExtractionReducer;
