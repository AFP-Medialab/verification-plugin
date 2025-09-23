import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  url: "",
  file: null, // { name: "example.mp3", url: "blob://..." }
  result: null,
  chunks: [],
  isInconclusive: false,
  loading: false,
};

const hiyaSlice = createSlice({
  name: "hiya",
  initialState,
  reducers: {
    resetHiyaAudio: (state) => {
      state.url = "";
      state.file = null;
      state.result = null;
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
      // Clear URL when file is selected
      state.url = "";
    },
    setHiyaResult: (state, action) => {
      state.url = action.payload.url;
      state.result = action.payload.result;
      state.chunks = action.payload.chunks;
      state.isInconclusive = action.payload.isInconclusive;
      state.loading = false;
    },
  },
});

export const { resetHiyaAudio, setHiyaLoading, setHiyaFile, setHiyaResult } =
  hiyaSlice.actions;
export default hiyaSlice.reducer;
