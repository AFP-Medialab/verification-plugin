import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    notification : false,
    loading : false,
    url: "",
    result: null,
};

const thumbnailSlice = createSlice({
    name: "thumbnail",
    initialState,
    reducers: {
        setThumbnailsResult(state, action){
            return action.payload
        },
        setThumbnailsLoading(state, action){
            state.loading = action.loading
        },
        cleanThumbnailsState(){
            return initialState;
        }
    }
})

export const {setThumbnailsResult, setThumbnailsLoading, cleanThumbnailsState} = thumbnailSlice.actions

const thumbnailsReducer = thumbnailSlice.reducer

/*const thumbnailsReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_THUMBNAILS_RESULT":
            return action.payload;
        case "SET_THUMBNAILS_LOADING":
            return {...state, loading: action.payload};
        case "THUMBNAILS_CLEAN_STATE":
            return {...state, url:"", result:null};
        default:
            return state;
    }
};*/
export default thumbnailsReducer;