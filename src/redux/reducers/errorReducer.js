const errorReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_ERROR":
            return action.payload;
        case "CLEAN_ERROR":
            return null;
        default:
            return state;
    }
};
export default errorReducer;