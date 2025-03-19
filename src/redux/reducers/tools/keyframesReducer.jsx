import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  url: "",
  /** @type {KeyframesData | null} */
  result: null,
  similarity: null,
  similarityLoading: false,
  /** @type {KeyframesFeatures | null} */
  keyframesFeatures: null,
};

const keyframesSlice = createSlice({
  name: "keyframes",
  initialState,
  reducers: {
    resetKeyframes() {
      return initialState;
    },
    setKeyframesUrl(state, action) {
      state.url = action.payload;
    },
    setKeyframesLoading(state, action) {
      state.loading = action.payload;
    },
    setKeyframesResult(state, action) {
      state.result = action.payload;
    },
    setKeyframesFeatures(state, action) {
      state.keyframesFeatures = action.payload;
    },
    setKeyframesSimilarityLoading(state, action) {
      state.similarityLoading = action.payload;
    },
    setSimilarity(state, action) {
      state.similarity = action.payload;
    },
  },
});

export const {
  resetKeyframes,
  setKeyframesUrl,
  setKeyframesLoading,
  setKeyframesResult,
  setKeyframesFeatures,
  setKeyframesSimilarityLoading,
  setSimilarity,
} = keyframesSlice.actions;
const keyframesReducer = keyframesSlice.reducer;

// const keyframesReducer = (state = defaultState, action) => {
//   switch (action.type) {
//     case "SET_KEYFRAMES_RESULT":
//       return {
//         ...state,
//         loading: action.payload.loading,
//         url: action.payload.url,
//         result: action.payload.result,
//         video_id: action.payload.video_id,
//       };
//     case "SET_KEYFRAMES_LOADING":
//       return { ...state, loading: action.payload };
//     case "SET_KEYFRAMES_SIMILARITY_LOADING":
//       return { ...state, similarityLoading: action.payload };
//     case "SET_KEYFRAMES_MESSAGE":
//       return { ...state, message: action.payload };
//     case "KEYFRAMES_CLEAN_STATE":
//       return { defaultState };
//     case "KEYFRAMES_UPDATE_SIMILARITY":
//       return { ...state, similarity: action.payload };
//     default:
//       return state;
//   }
// };
export default keyframesReducer;
