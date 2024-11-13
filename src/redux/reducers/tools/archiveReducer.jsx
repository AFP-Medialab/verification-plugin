const { createSlice } = require("@reduxjs/toolkit");

const initialState = { mainUrl: "" };

const archiveSlice = createSlice({
  name: "archive",
  initialState,
  reducers: {
    archiveUrlSet(state, action) {
      state.mainUrl = action.payload;
    },
    archiveStateCleaned(state, action) {
      state.mainUrl = "";
    },
  },
});
export const { archiveUrlSet, archiveStateCleaned } = archiveSlice.actions;

const archiveReducer = archiveSlice.reducer;
export default archiveReducer;