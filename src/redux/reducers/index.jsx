import { combineReducers } from 'redux'
import authenticationReducer from './authenticationReducer';
import defaultLanguageReducer from './defaultLanguageReducer';
import dictionaryReducer from './dictionaryReducer';
import errorReducer from './errorReducer';
import languageReducer from './languageReducer'
import navReducer from './navReducer';
import toolReducer from './tools/toolReducer';
import assistantReducer from './assistantReducer';
import humanRightsCheckBoxReducer from './humanRightsCheckBoxReducer';
import interactiveExplanationReducer from './interactiveExplanationReducer';
import analysisReducer from './tools/analysisReducer';
import keyframesReducer from './tools/keyframesReducer';
import thumbnailsReducer from './tools/thumbnailsReducer';
import videoRightsReducer from "./tools/videoRightsReducer";



const allReducers = combineReducers({
    language: languageReducer,
    defaultLanguage : defaultLanguageReducer,
    dictionary : dictionaryReducer,
    nav : navReducer,
    tool : toolReducer,
    humanRightsCheckBox : humanRightsCheckBoxReducer,
    interactiveExplanation : interactiveExplanationReducer,
    error : errorReducer,
    userSession : authenticationReducer,
    analysis: analysisReducer,
    keyframes : keyframesReducer,
    thumbnails : thumbnailsReducer,
    videoRights : videoRightsReducer,
    assistant : assistantReducer,
    
})

export default allReducers;