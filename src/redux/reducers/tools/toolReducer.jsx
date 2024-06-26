import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toolName: "navbar_tools",
};
const toolSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    selectTool(state, action) {
      state.toolName = action.payload;
    },
    cleanTool() {
      return initialState;
    },
  },
});

export const { selectTool, cleanTool } = toolSlice.actions;
const toolReducer = toolSlice.reducer;

export default toolReducer;
