import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isImage: true,
  notification: false,
  loading: false,
  url: "",
  result: null,
  mediaType: "nomedia",
};

const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadadaResult(state, action) {
      return action.payload;
    },
    setMetadadaLoading(state, action) {
      state.loading = action.payload;
    },
    setMetadataIsImage(state, action) {
      state.isImage = action.loading;
    },
    cleanMetadataState(state, action) {
      state.url = "";
      state.result = null;
    },
    setMetadataMediaType(state, action) {
      state.mediaType = action.payload;
    },
  },
});
export const {
  setMetadadaResult,
  setMetadadaLoading,
  setMetadataIsImage,
  cleanMetadataState,
  setMetadataMediaType,
} = metadataSlice.actions;
const metadataReducer = metadataSlice.reducer;
export default metadataReducer;
