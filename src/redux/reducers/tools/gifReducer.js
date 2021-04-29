const defaultState = {
    showHomo: false,
    loading: false,
    homoImg1: "",
    homoImg2: "",
};

const gifReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_GIF_LOADING":
            state.loading = true;
            return state;
        case "SET_GIF_HOMOGRAPHIC":
            return action.payload;
        default:
            return state;
    }
};
export default gifReducer;