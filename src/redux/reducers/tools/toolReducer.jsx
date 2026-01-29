import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  toolName: "navbar_tools",
  pinnedTools: [],
};
const toolSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    selectTool(state, action) {
      state.toolName = action.payload;
    },
    resetToolSelected(state) {
      // Only reset toolName, preserve pinnedTools
      state.toolName = initialState.toolName;
    },
    pinTool(state, action) {
      const toolKeyword = action.payload;
      if (!state.pinnedTools.includes(toolKeyword)) {
        state.pinnedTools.push(toolKeyword);
      }
    },
    unpinTool(state, action) {
      const toolKeyword = action.payload;
      state.pinnedTools = state.pinnedTools.filter(
        (tool) => tool !== toolKeyword,
      );
    },
    setPinnedTools(state, action) {
      state.pinnedTools = action.payload;
    },
  },
});

export const {
  selectTool,
  resetToolSelected,
  pinTool,
  unpinTool,
  setPinnedTools,
} = toolSlice.actions;
const toolReducer = toolSlice.reducer;

export default toolReducer;
