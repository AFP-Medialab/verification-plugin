const googleAnalyticReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_TRUE":
            return true;
        case "SET_FALSE":
            return false;
        case "TOGGLE_GA_STATE":
            return !state;
        case "TOGGLE_STATE":
            return action.payload;
        default:
            return state;
    }
};
export default googleAnalyticReducer;