import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
  file: null, // { name: "example.mp3", url: "blob://..." }
  result: null,
  resultUrl: "", // URL used for the displayed result (separate from input URL)
  chunks: [],
  isInconclusive: false,
  loading: false,
};

const hiyaReducer = createSlice({
  name: "hiya",
  initialState,
  reducers: {
    resetHiyaAudio: (state) => {
      state.url = "";
      state.file = null;
      state.result = null;
      state.resultUrl = "";
      state.chunks = [];
      state.isInconclusive = false;
      state.loading = false;
    },
    setHiyaLoading: (state, action) => {
      state.loading = action.payload;
    },
    setHiyaFile: (state, action) => {
      state.file = {
        name: action.payload.name,
        url: action.payload.url,
      };
      // Only set URL if there's no file name (i.e., it's a URL input, not a file)
      if (!action.payload.name) {
        state.url = action.payload.displayUrl || action.payload.url || "";
      } else {
        // Clear URL when file is selected so input field stays empty
        state.url = "";
      }
    },
    setHiyaResult: (state, action) => {
      // Don't overwrite input URL, store result URL separately
      state.resultUrl = action.payload.url;
      state.result = action.payload.result;
      state.chunks = action.payload.chunks;
      state.isInconclusive = action.payload.isInconclusive;
      state.loading = false;
    },
  },
});

export const { resetHiyaAudio, setHiyaLoading, setHiyaFile, setHiyaResult } =
  hiyaReducer.actions;

export default hiyaReducer.reducer;
