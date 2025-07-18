import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isImage: true,
  notification: false,
  loading: false,
  url: "",
  result: null,
  mediaType: "nomedia",
  c2pa: null,
  currentC2paImageId: null,
};

const metadataSlice = createSlice({
  name: "metadata",
  initialState,
  reducers: {
    setMetadataResult(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
    setC2paMetadataResult(state, action) {
      state.c2pa = action.payload.c2pa;
    },
    setCurrentC2paImageId(state, action) {
      state.currentC2paImageId = action.payload;
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
  setC2paMetadataResult,
  setCurrentC2paImageId,
  setMetadataLoading,
  setMetadataIsImage,
  cleanMetadataState,
  setMetadataMediaType,
} = metadataSlice.actions;
const metadataReducer = metadataSlice.reducer;
export default metadataReducer;
