const defaultState = {
    //1 - Init
    //21 - Selecting files local
    //22 - Selecting files url
    //3 - Ready to upload
    //4 - Loading (uploading)
    //5 - Show results
    toolState:1,

    homoImg1: "",
    homoImg2: "",
};

const gifReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_STATE_INIT":
            state.homoImg1 = "";
            state.homoImg2 = "";
            state.toolState = 1;
            return state;
        case "SET_STATE_SELECTINGFILES_LOCAL":
            state.toolState = 21;
            return state;
        case "SET_STATE_SELECTINGFILES_URL":
            state.toolState = 22;
            return state;
        case "SET_STATE_READY":
            state.toolState = 3;
            return state;
        case "SET_STATE_LOADING":
            state.toolState = 4;
            return state;
        case "SET_STATE_SHOW":
            return action.payload;
        case "SET_STATE_ERROR":
            state.toolState = 6;
            return state;
        default:
            return state;

    }
};
export default gifReducer;