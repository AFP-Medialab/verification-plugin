const toolReducer = (state = 0, action) => {
    switch (action.type) {
        case "SELECT_TOOL":
            return action.payload;
        default:
            return state;
    }
};
export default toolReducer;