import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isImage : true,
    notification : false,
    loading : false,
    url: "",
    result: null,
    mediaType: "nomedia",
};

const metadataSlice = createSlice({
    name:"metadata",
    initialState,
    reducers:{
        setMetadadaResult(state, action){
            return action.payload
        },
        setMetadadaLoading(state, action){
            state.loading = action.payload;
        },
        setMetadataIsImage(state,action){
            state.isImage = action.loading
        },
        cleanMetadataState(state,action){
            state.url = ""
            state.result = null
        },
        setMetadataMediaType(state, action){
            state.mediaType = action.payload
        }
    }
})
export const {setMetadadaResult, setMetadadaLoading, setMetadataIsImage, cleanMetadataState, setMetadataMediaType} = metadataSlice.actions
const metadataReducer = metadataSlice.reducer

/*const metadataReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SET_METADATA_RESULT":
            return action.payload;
        case "SET_METADATA_LOADING":
            return {...state, loading:action.payload};
        case "SET_METADATA_IS_IMAGE":
            return {...state, isImage: action.payload};
        case "METADATA_CLEAN_STATE":
            return {...state, url:"", result:null};
        case "SET_METADATA_MEDIA_TYPE":
            return {...state, mediaType:action.payload};
        default:
            return state;
    }
};*/
export default metadataReducer;