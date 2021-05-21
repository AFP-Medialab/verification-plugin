const defaultLanguageReducer = (state = null, action) => {
    switch (action.type) {
        case "CHANGE_DEFAULT":
            return action.payload;
        default:
            return state;
    }
};
export default defaultLanguageReducer;