const defaultState = {
  notification: false,
  loading: false,
  url: "",
  result: null,
  gifAnimation: false,
  maskUrl: "",
  masks: null,
  displayItem: "",
  errorKey: null,
  localurl: "",
};

const forensicReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_FORENSIC_RESULT":
      return {
        ...state,
        notification: action.payload.otification,
        loading: action.payload.loading,
        url: action.payload.url,
        result: action.payload.result,
        gifAnimation: action.payload.gifAnimation,
      };
    case "SET_FORENSIC_MASK":
      return { ...state, masks: action.payload };
    case "SET_FORENSIC_LOADING":
      return { ...state, loading: action.payload };
    case "FORENSIC_CLEAN_STATE":
      return {
        ...state,
        notification: false,
        loading: false,
        url: "",
        result: null,
        gifAnimation: false,
        maskUrl: "",
        displayItem: "",
        errorKey: null,
      };
    case "SET_FORENSIC_GIF_HIDE":
      return { ...state, gifAnimation: false };
    case "SET_FORENSIC_GIF_SHOW":
      return { ...state, gifAnimation: true };
    case "SET_FORENSIC_MASK_GIF":
      return { ...state, maskUrl: action.payload };
    case "SET_FORENSIC_DISPLAY_ITEM":
      return { ...state, displayItem: action.payload };
    case "SET_FORENSIC_LOCAL_FILE":
    case "SET_FORENSIC_IMAGE_BINARY":
    case "SET_FORENSIC_ERROR_KEY":
      return Object.assign({}, state, action.payload);
    default:
      return state;
  }
};
export default forensicReducer;
