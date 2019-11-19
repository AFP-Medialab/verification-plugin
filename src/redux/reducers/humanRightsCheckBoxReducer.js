const humanRightsCheckBoxReducer = (state = false, action) => {
    switch (action.type) {
        case "TOGGLE_HUMAN_RIGHTS_CHECKBOX":
            return !state;
        default:
            return state;
    }
};
export default humanRightsCheckBoxReducer;