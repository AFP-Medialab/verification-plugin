import { createSlice } from "@reduxjs/toolkit";
const initialState = null;

const cookiesSlice = createSlice({
    name:"cookies", 
    initialState,
    reducers:{
        setTrue(state, action){
            return true;
        },
        setStorageTrue(state, action){
            return true;
        },
        setFalse(state, action){
            return false;
        },
        toggleState(state, action){
            return !state;
        }
    }
})

export const {setTrue, setStorageTrue, setFalse, toggleState} = cookiesSlice.actions
const cookiesReducer = cookiesSlice.reducer
export default cookiesReducer;
