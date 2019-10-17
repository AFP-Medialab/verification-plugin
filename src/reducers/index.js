import {combineReducers} from "redux";
import languageReducer from "./languages";
import dictionaryReducer from "./dictionary";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer
});

export default allReducers;