const defaultState = {
  url: "",
  result: null,
  loading: false,
  type: "",
};

const audioExtractionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "AUDIO_EXTRACTION_RESET":
      return {
        ...state,
        url: "",
        result: null,
        file: null,
        loading: false,
        type: "",
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
    default:
      return state;
  }
};
export default audioExtractionReducer;
