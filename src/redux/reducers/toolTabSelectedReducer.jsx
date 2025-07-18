import { createSlice } from "@reduxjs/toolkit";

const initialState = 0;

const toolTabSelectedSlice = createSlice({
  name: "toolTabSelected",
  initialState,
  reducers: {
    selectToolTab(state, action) {
      return action.payload;
    },
  },
});
export const { selectToolTab } = toolTabSelectedSlice.actions;
const toolTabSelected = toolTabSelectedSlice.reducer;

export default toolTabSelected;
