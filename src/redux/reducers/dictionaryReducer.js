const dictionaryReducer = (state = {}, action) => {
    switch (action.type) {
        case "SET":
            return action.payload;
        case "ADD":
            state[action.payload.label] = action.payload.json;
            return state;
        default:
            return state;
    }
};
export default dictionaryReducer;