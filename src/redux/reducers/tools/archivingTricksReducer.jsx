const { createSlice } = require("@reduxjs/toolkit");

const initialState = { url: null };

const archivingTricksSlice = createSlice({
  name: "archivingTricks",
  initialState,
  reducers: {
    archivingTricksUrlSet(state, action) {
      state.url = action.payload;
    },
    archivingTricksStateCleaned(state, action) {
      state.url = null;
    },
  },
});
export const { archivingTricksUrlSet, archivingTricksStateCleaned } =
  archivingTricksSlice.actions;

const archivingTricksReducer = archivingTricksSlice.reducer;
export default archivingTricksReducer;
