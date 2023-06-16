import { createSlice } from "@reduxjs/toolkit";

const initialState = null;

const defaultLanguageSlice = createSlice({
  name: "defaultLanguage",
  initialState,
  reducers: {
    changeDefaultLanguage(state, action) {
      return action.payload;
    },
  },
});

export const { changeDefaultLanguage } = defaultLanguageSlice.actions;

const defaultLanguageReducer = defaultLanguageSlice.reducer;

export default defaultLanguageReducer;

/*const defaultLanguageReducer = (state = null, action) => {
    switch (action.type) {
        case "CHANGE_DEFAULT":
            return action.payload;
        default:
            return state;
    }
};
export default defaultLanguageReducer;*/
