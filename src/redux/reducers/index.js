import {combineReducers} from "redux";
import languageReducer from "./languagesReducer";
import dictionaryReducer from "./dictionaryReducer";
import navReducer from "./navReducer";
import toolReducer from "./toolReducer";
import humanRightsCheckBoxReducer from "./humanRightsCheckBoxReducer";
import interactiveExplanationReducer from "./interactiveExplanationReducer";
import errorReducer from "./errorReducer";

const allReducers = combineReducers({
    language : languageReducer,
    dictionary : dictionaryReducer,
    nav : navReducer,
    tool : toolReducer,
    humanRightsCheckBox : humanRightsCheckBoxReducer,
    interactiveExplanation : interactiveExplanationReducer,
    error : errorReducer
});

export default allReducers;