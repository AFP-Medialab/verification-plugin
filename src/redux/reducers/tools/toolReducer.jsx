const defaultState = {
    selected: 0,
};

const toolReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SELECT_TOOL":
            console.log("selected ", action.payload)
            return {...state, selected:action.payload};
        case "CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};
export default toolReducer;