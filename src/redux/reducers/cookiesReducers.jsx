import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuid } from "uuid";
const initialState = null;

const cookiesSlice = createSlice({
  name: "cookies",
  initialState,
  reducers: {
    setTrue(state, action) {
      const id = uuid();
      return {
        active: true,
        id: id,
      };
    },
    setStorageTrue(state, action) {
      state.active = true;
      state.id = uuid();
    },
    setFalse(state, action) {
      state.active = false;
    },
    toggleState(state, action) {
      state.active = !action.payload;
    },
  },
});

export const { setTrue, setStorageTrue, setFalse, toggleState } =
  cookiesSlice.actions;
const cookiesReducer = cookiesSlice.reducer;
export default cookiesReducer;
