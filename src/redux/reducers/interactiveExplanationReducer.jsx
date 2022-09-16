const interactiveExplanationReducer = (state = false, action) => {
    switch (action.type) {
        case "TOGGLE_INTERACTIVE_EXPLANATION_CHECKBOX":
            return !state;
        default:
            return state;
    }
};
export default interactiveExplanationReducer;