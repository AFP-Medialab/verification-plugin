const defaultState = {
  url: "",
  result: null,
  loading: false,
  duplicates: null,
};

const syntheticImageDetectionReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SYNTHETIC_IMAGE_DETECTION_RESET":
      return {
        ...defaultState,
      };
    case "SET_SYNTHETIC_IMAGE_DETECTION_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_SYNTHETIC_IMAGE_DETECTION_RESULT":
      return {
        ...state,
        url: action.payload.url,
        result: action.payload.result,
        loading: false,
      };
    case "SET_SYNTHETIC_IMAGE_DETECTION_NEAR_DUPLICATES":
      return {
        ...state,
        duplicates: action.payload,
        loading: false,
      };
    case "SET_SYNTHETIC_IMAGE_DETECTION_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    default:
      return state;
  }
};
export default syntheticImageDetectionReducer;
