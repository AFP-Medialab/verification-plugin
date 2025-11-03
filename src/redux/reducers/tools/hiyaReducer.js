import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
  file: null, // { name: "example.mp3", url: "blob://..." }
  result: null,
  resultUrl: "", // URL used for the displayed result (separate from input URL)
  chunks: [],
  isInconclusive: false,
  loading: false,
  hasError: false, // True when ALL chunks have error labels (no results)
  errorData: null, // { mainMessage: string, suggestions: string[] } for full errors
  hasPartialWarning: false, // True when SOME chunks have error labels (show results + warning)
  warningData: null, // { mainMessage: string, suggestions: string[] } for partial errors
  errorLabels: [], // Array of error labels found
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
      state.hasError = false;
      state.errorData = null;
      state.hasPartialWarning = false;
      state.warningData = null;
      state.errorLabels = [];
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
      // Clear any previous error/warning state when setting successful results
      state.hasError = false;
      state.errorData = null;
      state.hasPartialWarning = false;
      state.warningData = null;
      state.errorLabels = [];
    },
    setHiyaResultWithWarning: (state, action) => {
      // Set result data with partial warnings
      state.resultUrl = action.payload.url;
      state.result = action.payload.result;
      state.chunks = action.payload.chunks;
      state.isInconclusive = action.payload.isInconclusive;
      state.loading = false;
      // Set partial warning state
      state.hasPartialWarning = true;
      state.warningData = {
        mainMessage: action.payload.mainMessage,
        suggestions: action.payload.suggestions,
      };
      state.errorLabels = action.payload.errorLabels;
      // Clear full error state
      state.hasError = false;
      state.errorData = null;
    },
    setHiyaError: (state, action) => {
      state.hasError = true;
      state.errorData = {
        mainMessage: action.payload.mainMessage,
        suggestions: action.payload.suggestions,
      };
      state.errorLabels = action.payload.errorLabels;
      state.resultUrl = action.payload.url; // Set the URL for error display
      state.loading = false;
      // Clear result data when there's a full error
      state.result = null;
      state.chunks = [];
      state.isInconclusive = false;
      // Clear partial warning state
      state.hasPartialWarning = false;
      state.warningData = null;
    },
  },
});

export const {
  resetHiyaAudio,
  setHiyaLoading,
  setHiyaFile,
  setHiyaResult,
  setHiyaResultWithWarning,
  setHiyaError,
} = hiyaReducer.actions;

export default hiyaReducer.reducer;
