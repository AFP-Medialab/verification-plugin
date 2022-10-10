import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    request: "",
    result: null,
    loading: false,
};

const twitterSnaSlice = createSlice({
    name : "tsna",
    initialState,
    reducers : {
        setTwitterSnaLoading(state, action){
            state.loading = action.payload
        },
        setTwitterSnaResult(state, action){
            return action.payload
        }
    }

})

export const {setTwitterSnaLoading, setTwitterSnaResult} = twitterSnaSlice.actions
const twitterSnaReducer = twitterSnaSlice.reducer

/*const twitterSnaReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_TWITTER_SNA_RESULT":
            return action.payload;
        case "SET_TWITTER_SNA_LOADING":
            return {...state, loading:action.payload};
        case "SET_TWITTER_SNA_LOADING_MSG":
            return {...state, loadingMessage: action.payload};
        case "TWITTER_SNA_CLEAN_STATE":
            return {...state, request:"", result:null};
        default:
            return state;
    }
};*/
export default twitterSnaReducer;