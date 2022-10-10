import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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

const gifSlice = createSlice({
    name:"gif",
    initialState,
    reducers:{
        setStateInit(state, action){
            return initialState
        },
        setStateSelectingLocal(state){
            state.toolState=21
        },
        setStateSelectingUrl(state){
            state.toolState=22
        },
        setStateReady(state){
            state.toolState=3
        },
        setStateLoading(state){
            state.toolState=4
        },
        setStateDownloading(state){
            state.toolState=7
        },
        setStateError(state){
            state.toolState=6
        },
        setStateBackResults(state){
            state.toolState=5
        },
        setStateShow(state, action){
            return action.payload
        }
    }
})

export const {setStateInit, setStateSelectingLocal, setStateSelectingUrl, setStateReady,
    setStateLoading, setStateDownloading, setStateError, setStateBackResults, setStateShow} = gifSlice.actions

const gifReducer = gifSlice.reducer;
/*const gifReducer = (state = defaultState, action) => {
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
};*/
export default gifReducer;