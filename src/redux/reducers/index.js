import {combineReducers} from "redux";
import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import navReducer from "./navReducer";
import toolReducer from "./toolReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    nav : navReducer,
    tool : toolReducer,
});

export default allReducers;