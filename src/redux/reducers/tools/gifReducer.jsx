const defaultState = {
    //1 - Init
    //21 - Selecting files local
    //22 - Selecting files url
    //3 - Ready to upload
    //4 - Loading (uploading)
    //5 - Show results
    //6 - Error
    //7 - Downloading
    toolState:1,

    homoImg1: "",
    homoImg2: "",
};

const gifReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SET_STATE_INIT":
            return {...state, homoImg1:"", homoImg2:"", toolState:1};
        case "SET_STATE_SELECTINGFILES_LOCAL":
            return {...state, toolState:21};
        case "SET_STATE_SELECTINGFILES_URL":
            return {...state, toolState:22};
        case "SET_STATE_READY":
            return {...state, toolState:3};
        case "SET_STATE_LOADING":
            return {...state, toolState:4};
        case "SET_STATE_SHOW":
            return action.payload;
        case "SET_STATE_ERROR":
            return {...state, toolState:6};
        case "SET_STATE_DOWNLOADING":
            return {...state, toolState:7};
        case "SET_STATE_BACKRESULTS":
            return {...state, toolState:5};
        default:
            return state;

    }
};
export default gifReducer;