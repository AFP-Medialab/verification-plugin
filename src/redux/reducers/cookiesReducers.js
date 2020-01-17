const cookiesReducer = (state = null, action) => {
    switch (action.type) {
        case "SET_TRUE":
            return true;
        case "SET_FALSE":
            return false;
        case "TOGGLE_STATE":
            return !state;
        default:
            return state;
    }
};
export default cookiesReducer;