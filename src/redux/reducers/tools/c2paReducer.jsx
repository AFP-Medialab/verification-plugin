const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  results: null,
  loading: false,
};

const c2paSlice = createSlice({
  name: "c2pa",
  initialState,
  reducers: {
    c2paResultsSet(state, action) {
      state.results = action.payload;
    },
    c2paLoadingSet(state, action) {
      state.loading = action.payload;
    },
    c2paStateCleaned(state, action) {
      state.result = null;
    },
  },
});

export const { c2paResultsSet, c2paLoadingSet, c2paStateCleaned } =
  c2paSlice.actions;

const c2paReducer = c2paSlice.reducer;
export default c2paReducer;
