import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  url: "",
  /** @type {KeyframesData | null} */
  result: null,
  similarity: null,
  similarityLoading: false,
  /** @type {KeyframesFeatures | null} */
  keyframesFeatures: null,
};

const keyframesSlice = createSlice({
  name: "keyframes",
  initialState,
  reducers: {
    resetKeyframes() {
      return initialState;
    },
    setKeyframesUrl(state, action) {
      state.url = action.payload;
    },
    setKeyframesLoading(state, action) {
      state.loading = action.payload;
    },
    setKeyframesResult(state, action) {
      state.result = action.payload;
    },
    setKeyframesFeatures(state, action) {
      state.keyframesFeatures = action.payload;
    },
    setKeyframesSimilarityLoading(state, action) {
      state.similarityLoading = action.payload;
    },
    setSimilarity(state, action) {
      state.similarity = action.payload;
    },
  },
});

export const {
  resetKeyframes,
  setKeyframesUrl,
  setKeyframesLoading,
  setKeyframesResult,
  setKeyframesFeatures,
  setKeyframesSimilarityLoading,
  setSimilarity,
} = keyframesSlice.actions;
const keyframesReducer = keyframesSlice.reducer;

export default keyframesReducer;
