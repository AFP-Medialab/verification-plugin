import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    urlImage: "",
    result: null,
    loading: false,
};

const geolocalisationSlice = createSlice({
    name : "geolocalisation",
    initialState,
    reducers : {
        resetGeolocation(){
            return initialState;
        },
        setGeolocationLoading(state, action) {
            state.loading = action.payload
        },
        setGeolocationResult(state, action){
            return action.payload
        }
    }
})

export const {resetGeolocation, setGeolocationLoading, setGeolocationResult} = geolocalisationSlice.actions
const geolocationReducer = geolocalisationSlice.reducer

/*const geolocationReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GEOLOCATION_RESET":
            return {
                ...state, 
                urlImage: "",
                result: null,
                loading: false,
            }
        case "SET_GEOLOCATION_LOADING":
            return {
                ...state,
                loading: action.payload,
            }
        case "SET_GEOLOCATION_RESULT":
            return action.payload;
        default:
            return state;
    }
};*/
export default geolocationReducer;