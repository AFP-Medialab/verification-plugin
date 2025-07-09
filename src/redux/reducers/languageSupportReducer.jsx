import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  languagesList: {},
  selectedLanguage: "en",
  alreadyLoaded: false,
};

const languageSupportSlice = createSlice({
  name: "languageSupport",
  initialState,
  reducers: {
    loadLanguages(state, action) {
      state.languagesList = action.payload;
      state.alreadyLoaded = true;
    },
  },
});

export const { loadLanguages } = languageSupportSlice.actions;

const languageSupportReducer = languageSupportSlice.reducer;

export default languageSupportReducer;
