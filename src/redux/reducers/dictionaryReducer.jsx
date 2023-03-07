const dictionaryReducer = (state = {}, action) => {
  switch (action.type) {
    case "SET":
      return action.payload;
    case "ADD_DICO":
      return { ...state, [action.payload.label]: action.payload.json };
    default:
      return state;
  }
};
export default dictionaryReducer;
