import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  result: null,
  loading: false,
  url: null,
  currentImageId: null,
  mainImageId: null,
  validationIssues: false,
  thumbnail: null,
  thumbnailCaption: null,
  afpHdImage: null,
  hdImageC2paData: null,
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
    resetC2paState(state) {
      state.result = null;
      state.url = null;
      state.currentManifest = null;
      state.validationIssues = false;
      state.thumbnail = null;
      state.thumbnailCaption = null;
      state.afpHdImage = null;
      state.hdImageC2paData = null;
      state.currentHdImageId = null;
      state.mainHdImageId = null;
    },
    c2paIngredientResultCleaned(state) {
      state.ingredientResult = null;
    },
    c2paValidationIssuesSet(state, action) {
      state.validationIssues = action.payload;
    },
    setC2paThumbnail(state, action) {
      state.thumbnail = action.payload;
    },
    setC2paThumbnailCaption(state, action) {
      state.thumbnailCaption = action.payload;
    },
    setAfpHdImage(state, action) {
      state.afpHdImage = action.payload;
    },
    setHdImageC2paData(state, action) {
      state.hdImageC2paData = action.payload;
    },
  },
});

export const {
  c2paResultSet,
  c2paCurrentImageIdSet,
  c2paMainImageIdSet,
  c2paUrlSet,
  c2paLoadingSet,
  resetC2paState,
  c2paIngredientResultCleaned,
  c2paValidationIssuesSet,
  setC2paThumbnail,
  setC2paThumbnailCaption,
  setAfpHdImage,
  setHdImageC2paData,
} = c2paSlice.actions;

const c2paReducer = c2paSlice.reducer;
export default c2paReducer;
