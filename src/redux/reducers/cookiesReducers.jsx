import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";

const initialState = {
  active: null,
  analytics: null,
  id: null,
};

const cookiesSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    setTrue() {
      const id = uuid();
      //state.id = uuid();
      return {
        active: true,
        analytics: true,
        //analytics: false, //temporarily disable for test
        id: id,
      };
    },
    setStorageTrue(state) {
      state.active = true;
      state.id = uuid();
    },
    setFalse() {
      return {
        active: false,
        analytics: false,
        id: null,
      };
    },
    toggleState(state, action) {
      state.active = !action.payload;
    },
    toggleAnalyticsCheckBox(state, action) {
      state.analytics = !action.payload;
    },
  },
});

export const {
  setTrue,
  setStorageTrue,
  setFalse,
  toggleState,
  toggleAnalyticsCheckBox,
} = cookiesSlice.actions;
const cookiesReducer = cookiesSlice.reducer;
export default cookiesReducer;
