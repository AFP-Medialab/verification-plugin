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
  toolState: 1,

  homoImg1: "",
  homoImg2: "",
};

const gifSlice = createSlice({
  name: "gif",
  initialState,
  reducers: {
    setStateInit() {
      return initialState;
    },
    setStateSelectingLocal(state) {
      state.toolState = 21;
    },
    setStateSelectingUrl(state) {
      state.toolState = 22;
    },
    setStateReady(state) {
      state.toolState = 3;
    },
    setStateLoading(state) {
      state.toolState = 4;
    },
    setStateDownloading(state) {
      state.toolState = 7;
    },
    setStateError(state) {
      state.toolState = 6;
    },
    setStateBackResults(state) {
      state.toolState = 5;
    },
    setStateShow(state, action) {
      return action.payload;
    },
  },
});

export const {
  setStateInit,
  setStateSelectingLocal,
  setStateSelectingUrl,
  setStateReady,
  setStateLoading,
  setStateDownloading,
  setStateError,
  setStateBackResults,
  setStateShow,
} = gifSlice.actions;

const gifReducer = gifSlice.reducer;

export default gifReducer;
