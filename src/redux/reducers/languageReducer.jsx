import { createSlice } from "@reduxjs/toolkit";

const initialState = "en";

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    changeLanguage(state, action) {
      return action.payload;
    },
  },
});

export const { changeLanguage } = languageSlice.actions;

const languageReducer = languageSlice.reducer;

export default languageReducer;
