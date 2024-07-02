import { createSlice } from "@reduxjs/toolkit";
import { TOP_MENU_ITEMS } from "../../constants/topMenuItems";

const initialState = TOP_MENU_ITEMS[0].title;

const navSlice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    selectTopMenuItem(state, action) {
      return action.payload;
    },
  },
});
export const { selectTopMenuItem } = navSlice.actions;
const navReducer = navSlice.reducer;

export default navReducer;
