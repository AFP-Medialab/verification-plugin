const defaultState = {
  url: "",
  result: null,
  loading: false,
  type: "",
  endCutTime: null,
  beginCutTime: null,
  keyframes: null,
  keyframesLoading: null,
  file: null,
  fileName: null,
};

const ffmpegToolkitReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "FFMPEG_TOOLKIT_RESET":
      return {
        ...state,
        url: "",
        result: null,
        file: null,
        fileName: null,
        loading: false,
        type: "",
        endCutTime: null,
        beginCutTime: null,
        keyframes: null,
      };
    case "SET_FFMPEG_TOOLKIT_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_FFMPEG_TOOLKIT_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    case "SET_FFMPEG_TOOLKIT_RESULT":
      return {
        ...state,
        result: action.payload ? action.payload.url : null,
        loading: false,
      };
    case "SET_FFMPEG_TOOLKIT_FILE":
      return {
        ...state,
        file: action.payload,
      };
    case "SET_FFMPEG_TOOLKIT_FILE_NAME":
      return {
        ...state,
        fileName: action.payload,
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
export default ffmpegToolkitReducer;
