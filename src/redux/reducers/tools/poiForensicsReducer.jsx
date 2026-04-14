const defaultState = {
  url: "",
  result: null,
  loading: false,
  type: "",
};

const poiForensicsReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "POI_FORENSICS_RESET":
      return {
        ...state,
        url: "",
        result: null,
        loading: false,
        type: "",
      };
    case "SET_POI_FORENSICS_TYPE":
      return {
        ...state,
        type: action.payload,
      };
    case "SET_POI_FORENSICS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_POI_FORENSICS_RESULT":
      return {
        ...state,
        url: action.payload.url,
        result: action.payload.result,
        loading: false,
      };
    case "SET_POI_FORENSICS_URL":
      return {
        ...state,
        url: action.payload.url,
      };
    default:
      return state;
  }
};
export default poiForensicsReducer;
