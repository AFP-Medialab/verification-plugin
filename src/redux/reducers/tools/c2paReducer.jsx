const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  results: null,
  loading: false,
  url: null,
};

const c2paSlice = createSlice({
  name: "c2pa",
  initialState,
  reducers: {
    c2paResultsSet(state, action) {
      if (!state.results) state.results = {};
      state.results.title = action.payload.title;
      state.results.signatureIssuer = action.payload.signatureIssuer;
    },
    c2paUrlSet(state, action) {
      state.url = action.payload;
    },
    c2paLoadingSet(state, action) {
      state.loading = action.payload;
    },
    c2paStateCleaned(state, action) {
      state.result = null;
      state.url = null;
    },
  },
});

export const { c2paResultsSet, c2paUrlSet, c2paLoadingSet, c2paStateCleaned } =
  c2paSlice.actions;

const c2paReducer = c2paSlice.reducer;
export default c2paReducer;
