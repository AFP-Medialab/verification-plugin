import { createSlice } from "@reduxjs/toolkit";

/**
 * Redux slice for caching SNA data sources
 * This prevents reloading from IndexedDB on every navigation
 */
const initialState = {
  dataSources: null, // Cached data sources
  lastLoaded: null, // Timestamp of last load
  isLoading: false,
};

const snaDataSlice = createSlice({
  name: "snaData",
  initialState,
  reducers: {
    setSNADataSources(state, action) {
      state.dataSources = action.payload;
      state.lastLoaded = Date.now();
      state.isLoading = false;
    },
    setSNALoading(state, action) {
      state.isLoading = action.payload;
    },
    clearSNACache(state) {
      state.dataSources = null;
      state.lastLoaded = null;
      state.isLoading = false;
    },
  },
});

export const { setSNADataSources, setSNALoading, clearSNACache } =
  snaDataSlice.actions;

export default snaDataSlice.reducer;
