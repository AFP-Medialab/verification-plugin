const { createSlice } = require("@reduxjs/toolkit");

const initialState = {
  result: null,
  loading: false,
  url: null,
  currentImageId: null,
  mainImageId: null,
  validationIssues: false,
};

const c2paSlice = createSlice({
  name: "c2pa",
  initialState,
  reducers: {
    c2paResultSet(state, action) {
      if (!state.result) state.result = {};
      state.result = action.payload;
    },
    c2paCurrentImageIdSet(state, action) {
      state.currentImageId = action.payload;
    },
    c2paMainImageIdSet(state, action) {
      state.mainImageId = action.payload;
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
      state.currentManifest = null;
      state.validationIssues = false;
    },
    c2paIngredientResultCleaned(state, action) {
      state.ingredientResult = null;
    },
    c2paValidationIssuesSet(state, action) {
      state.validationIssues = action.payload;
    },
  },
});

export const {
  c2paResultSet,
  c2paCurrentImageIdSet,
  c2paMainImageIdSet,
  c2paUrlSet,
  c2paLoadingSet,
  c2paStateCleaned,
  c2paIngredientResultCleaned,
  c2paValidationIssuesSet,
} = c2paSlice.actions;

const c2paReducer = c2paSlice.reducer;
export default c2paReducer;
