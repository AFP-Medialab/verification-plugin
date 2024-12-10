const defaultState = {
  url: "",
  result: null,
  chunks: [],
  isInconclusive: false,
  loading: false,
};

const loccusReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "LOCCUS_RESET":
      return {
        ...state,
        url: "",
        result: null,
        chunks: [],
        isInconclusive: false,
        loading: false,
      };
    case "SET_LOCCUS_LOADING":
      return {
        ...state,
        loading: action.payload,
      };
    case "SET_LOCCUS_RESULT":
      return {
        ...state,
        url: action.payload.url,
        result: action.payload.result,
        chunks: action.payload.chunks,
        isInconclusive: action.payload.isInconclusive,
        loading: false,
      };
    default:
      return state;
  }
};
export default loccusReducer;
