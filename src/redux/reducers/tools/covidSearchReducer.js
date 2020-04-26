const defaultState = true;
const covidSearchReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_TRUE":
            return true;
        case "SET_FALSE":
            return false;
        case "SET_CUSTOM":
            return action.payload;
        case "TOGGLE_STATE":
            return !state;
        default:
            return state;
    }
};
export default covidSearchReducer;