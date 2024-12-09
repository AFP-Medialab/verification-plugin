const defaultState = {
  url: "",
  result: null,
  loading: false,
  type: "",
};

const deepfakeVideoReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "DEEPFAKE_VIDEO_RESET":
      return {
        ...state,
        url: "",
        result: null,
        loading: false,
        type: "",
      };
    case "SET_DEEPFAKE_VIDEO_TYPE":
      return {
        ...state,
        type: action.payload,
      };
    case "SET_DEEPFAKE_VIDEO_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_DEEPFAKE_VIDEO_RESULT":
      return {
        ...state,
        url: action.payload.url,
        result: action.payload.result,
        loading: false,
      };
    case "SET_DEEPFAKE_VIDEO_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    default:
      return state;
  }
};
export default deepfakeVideoReducer;
