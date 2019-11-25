const defaultState = {
    selected: 0,
};

const toolReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SELECT_TOOL":
            state.selected = action.payload;
            return state;
        case "CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default toolReducer;