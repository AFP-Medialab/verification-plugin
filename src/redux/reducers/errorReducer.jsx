import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  tools: null,
  network: null,
};
const errorSlice = createSlice({
  name: "error",
  initialState,
  reducers: {
    setError(state, action) {
      state.tools = action.payload;
    },
    cleanError(state) {
      state.tools = null;
    },
    setErrorNetwork(state, action) {
      state.network = action.payload;
    },
    cleanErrorNetwork(state) {
      state.network = null;
    },
  },
});
export const { setError, cleanError, setErrorNetwork, cleanErrorNetwork } =
  errorSlice.actions;
const errorReducer = errorSlice.reducer;

export default errorReducer;
