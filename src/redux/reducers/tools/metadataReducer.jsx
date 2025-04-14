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
    setMetadataResult(state, action) {
      return action.payload;
    },
    setMetadataLoading(state, action) {
      state.loading = action.payload;
    },
    setMetadataIsImage(state, action) {
      state.isImage = action.loading;
    },
    cleanMetadataState() {
      return initialState;
    },
    setMetadataMediaType(state, action) {
      state.mediaType = action.payload;
    },
  },
});
export const {
  setMetadataResult,
  setMetadataLoading,
  setMetadataIsImage,
  cleanMetadataState,
  setMetadataMediaType,
} = metadataSlice.actions;
const metadataReducer = metadataSlice.reducer;
export default metadataReducer;
