import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selected: 0,
};
const toolSlice = createSlice({
  name: "tools",
  initialState,
  reducers: {
    selectTool(state, action) {
      state.selected = action.payload;
    },
    cleanTool() {
      return initialState;
    },
  },
});

export const { selectTool, cleanTool } = toolSlice.actions;
const toolReducer = toolSlice.reducer;

/*const toolReducer = (state = defaultState, action) => {
    switch (action.type) {
        case "SELECT_TOOL":
            console.log("selected ", action.payload)
            return {...state, selected:action.payload};
        case "CLEAN_STATE":
            return defaultState;
        default:
            return state;
    }
};*/
export default toolReducer;
