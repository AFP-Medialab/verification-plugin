import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
  result: null,
  loading: false,
  duplicates: null,
};

const syntheticImageDetectionSlice = createSlice({
  name: "syntheticImageDetection",
  initialState,
  reducers: {
    resetSyntheticImageDetectionImage: () => initialState,
    setSyntheticImageDetectionLoading: (state, action) => {
      state.loading = action.payload;
    },
    setSyntheticImageDetectionResult: (state, action) => {
      state.url = action.payload.url;
      state.result = action.payload.result;
      state.loading = false;
    },
    setSyntheticImageDetectionNearDuplicates: (state, action) => {
      state.duplicates = action.payload;
      state.loading = false;
    },
    setSyntheticImageDetectionUrl: (state, action) => {
      state.url = action.payload.url;
    },
  },
});

export const {
  resetSyntheticImageDetectionImage,
  setSyntheticImageDetectionLoading,
  setSyntheticImageDetectionResult,
  setSyntheticImageDetectionNearDuplicates,
  setSyntheticImageDetectionUrl,
} = syntheticImageDetectionSlice.actions;

export default syntheticImageDetectionSlice.reducer;
