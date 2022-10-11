import { createSlice } from "@reduxjs/toolkit";
const initialState = 0

const navSlice = createSlice({
    name: "nav",
    initialState,
    reducers:{
        selectPage(state, action){
            return action.payload;
        }
    }
})
export const {selectPage} = navSlice.actions
const navReducer = navSlice.reducer

/*const navReducer = (state = 0, action) => {
    switch (action.type) {
        case "SELECT_PAGE":
            console.log("nav ...", action.payload)
            return action.payload;
        default:
            return state;
    }
};*/
export default navReducer;