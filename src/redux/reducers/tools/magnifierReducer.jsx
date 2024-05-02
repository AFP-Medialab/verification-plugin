const defaultState = {
  notification: false,
  loading: false,
  url: "",
  result: null,
};

const magnifierReducer = (state = defaultState, action) => {
  switch (action.type) {
    case "SET_MAGNIFIER_RESULT":
      return action.payload;
    case "SET_MAGNIFIER_LOADING":
      return { ...state, loading: action.payload };
    case "MAGNIFIER_RESET_STATE":
      return { ...state, url: "", result: null };
    default:
      return state;
  }
};
export default magnifierReducer;
